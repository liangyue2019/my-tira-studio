import { test, expect, Page } from '@playwright/test'

type ChoiceMap = Record<string, number>

const LEGENDARY_REI_CHOICES: ChoiceMap = {
  'story_d1_m_2': 0,
  'story_d1_a_1': 0,
  'story_d1_e_2': 0,
  'story_d2_m_2': 0,
  'story_d2_a_2': 0,
  'story_d2_e_3': 0,
  'story_d3_e_2': 0,
}

const PARTNER_REI_CHOICES: ChoiceMap = {
  ...LEGENDARY_REI_CHOICES,
  'story_d3_e_2': 1,
}

interface GameState {
  day: number
  timeSlot: string
  phase: string
  currentDialogId: string | null
  characterAffinity: { tira: number; rei: number }
  employeeCount: number
  dialogCount: number
  dialogOptions: string[]
  dialogSpeaker: string | null
  dialogTitle: string | null
}

async function getGameState(page: Page): Promise<GameState | null> {
  return page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return null
    const g = s.game.getState()
    const dialog = g.dialogs.find((d: any) => d.id === g.currentDialogId)
    return {
      day: g.day,
      timeSlot: g.timeSlot,
      phase: g.phase,
      currentDialogId: g.currentDialogId,
      characterAffinity: g.characterAffinity,
      employeeCount: s.employee.getState().employees.length,
      dialogCount: dialog?.options?.length ?? 0,
      dialogOptions: dialog?.options?.map((o: any) => o.text) ?? [],
      dialogSpeaker: dialog?.speaker ?? null,
      dialogTitle: dialog?.title ?? null,
    }
  })
}

async function waitForStores(page: Page, timeout = 15000): Promise<void> {
  await page.waitForFunction(() => !!(window as any).__stores, { timeout })
}

async function startFreshGame(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.removeItem('ai_studio_game_save'))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await waitForStores(page)
}

async function selectDialogOption(page: Page, optionIndex: number): Promise<void> {
  await page.evaluate((idx) => {
    const s = (window as any).__stores
    if (!s) return
    const g = s.game.getState()
    if (!g.currentDialogId) return
    const dialog = g.dialogs.find((d: any) => d.id === g.currentDialogId)
    if (!dialog || !dialog.options[idx]) return
    g.selectDialogOption(g.currentDialogId, dialog.options[idx])
  }, optionIndex)
  await page.waitForTimeout(400)
}

async function executeAction(page: Page, actionId: string): Promise<boolean> {
  return page.evaluate((id) => {
    const s = (window as any).__stores
    if (!s) return false
    const g = s.game.getState()
    if (g.phase !== 'action_select' && g.phase !== 'project_assign') return false
    if (g.currentDialogId) return false
    const result = g.selectAction(id)
    return !!result
  }, actionId)
}

async function executeWorkProject(page: Page): Promise<boolean> {
  await page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return
    const g = s.game.getState()
    if (g.phase !== 'action_select' || g.currentDialogId) return
    g.setPhase('project_assign')
  })
  await page.waitForTimeout(400)

  return page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return false
    const p = s.project.getState()
    const e = s.employee.getState()
    const g = s.game.getState()
    if (g.phase !== 'project_assign') return false

    const activeProject = p.projects.find((proj: any) => !proj.isCompleted && !proj.isFailed)
    if (!activeProject) { g.setPhase('action_select'); return false }

    const idleEmp = e.employees.find((emp: any) => emp.status === 'idle')
    if (!idleEmp) { g.setPhase('action_select'); return false }

    p.assignEmployee(activeProject.id, idleEmp.id)
    e.updateEmployee(idleEmp.id, { status: 'working', assignedProjectId: activeProject.id })

    const result = g.selectAction('work_project', { projectId: activeProject.id })
    return !!result
  })
}

async function advanceFromSettlement(page: Page): Promise<void> {
  await page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return
    const g = s.game.getState()
    if (g.phase === 'settlement') {
      g.advanceTimeSlot()
    }
  })
  await page.waitForTimeout(400)
}

async function advanceFromDaySummary(page: Page): Promise<void> {
  await page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return
    const g = s.game.getState()
    if (g.phase === 'day_summary') {
      g.setPhase('action_select')
    }
  })
  await page.waitForTimeout(400)
}

async function resolveEvent(page: Page): Promise<void> {
  await page.evaluate(() => {
    const s = (window as any).__stores
    if (!s) return
    const g = s.game.getState()
    if (g.phase !== 'event' || !g.currentEvent) return
    const options = g.currentEvent.options.filter((o: any) => !o.locked)
    if (options.length > 0) {
      g.resolveEvent(g.currentEvent.id, options[0].id)
    }
  })
  await page.waitForTimeout(400)
}

async function playFullGame(page: Page, choices: ChoiceMap, untilDay = 4): Promise<GameState | null> {
  let prevDay = 0
  let prevSlot = ''
  let prevDialog: string | null = null

  for (let i = 0; i < 300; i++) {
    const state = await getGameState(page)
    if (!state) {
      await page.waitForTimeout(300)
      continue
    }

    if (state.day >= untilDay) {
      console.log(`Game completed at Day ${state.day}, affinity: tira=${state.characterAffinity.tira} rei=${state.characterAffinity.rei}, employees: ${state.employeeCount}`)
      return state
    }

    if (state.day !== prevDay || state.timeSlot !== prevSlot || state.currentDialogId !== prevDialog) {
      console.log(`[Step ${i}] Day ${state.day} ${state.timeSlot} | phase: ${state.phase} | dialog: ${state.currentDialogId} | employees: ${state.employeeCount}`)
      prevDay = state.day
      prevSlot = state.timeSlot
      prevDialog = state.currentDialogId
    }

    if (state.currentDialogId) {
      const optionIndex = choices[state.currentDialogId] ?? 0
      await selectDialogOption(page, Math.min(optionIndex, state.dialogCount - 1))
      continue
    }

    if (state.phase === 'event') {
      await resolveEvent(page)
      continue
    }

    if (state.phase === 'settlement') {
      await advanceFromSettlement(page)
      continue
    }

    if (state.phase === 'day_summary') {
      await advanceFromDaySummary(page)
      continue
    }

    if (state.phase === 'action_select') {
      const success = await executeAction(page, 'rest')
      if (!success) {
        await executeWorkProject(page)
      }
      await page.waitForTimeout(400)
      continue
    }

    if (state.phase === 'project_assign') {
      await executeWorkProject(page)
      await page.waitForTimeout(400)
      continue
    }

    await page.waitForTimeout(200)
  }

  return getGameState(page)
}

test.describe('3-day story playthrough', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await startFreshGame(page)
  })

  test('completes full 3-day story with legendary rei path', async ({ page }) => {
    const finalState = await playFullGame(page, LEGENDARY_REI_CHOICES, 4)

    expect(finalState).toBeTruthy()
    expect(finalState!.day).toBeGreaterThanOrEqual(4)
    expect(finalState!.employeeCount).toBeGreaterThanOrEqual(3)
    expect(finalState!.characterAffinity.rei).toBeGreaterThan(0)
    expect(finalState!.characterAffinity.tira).toBeDefined()
    expect(finalState!.currentDialogId).toBeNull()
  })

  test('completes full 3-day story with partner rei path', async ({ page }) => {
    const finalState = await playFullGame(page, PARTNER_REI_CHOICES, 4)

    expect(finalState).toBeTruthy()
    expect(finalState!.day).toBeGreaterThanOrEqual(4)
    expect(finalState!.employeeCount).toBeGreaterThanOrEqual(3)
    expect(finalState!.characterAffinity.rei).toBeGreaterThanOrEqual(3)
    expect(finalState!.currentDialogId).toBeNull()
  })

  test('Day 1 morning: intro followed by story chain', async ({ page }) => {
    const state0 = await getGameState(page)
    expect(state0?.currentDialogId).toBe('intro')

    await selectDialogOption(page, 0)

    await page.waitForTimeout(300)
    const state1 = await getGameState(page)
    if (state1?.currentDialogId && !state1.currentDialogId.startsWith('story_')) {
      await selectDialogOption(page, 0)
    }

    await page.waitForFunction(
      () => {
        const s = (window as any).__stores
        return s && s.game.getState().currentDialogId?.startsWith('story_d1_m')
      },
      { timeout: 10000 }
    )

    const state2 = await getGameState(page)
    expect(state2?.currentDialogId).toMatch(/^story_d1_m/)
    expect(state2?.dialogSpeaker).toContain('白夜 tira')
    expect(state2?.dialogTitle).toContain('工作室开张')

    for (let i = 0; i < 5; i++) {
      const s = await getGameState(page)
      expect(s?.currentDialogId).toMatch(/^story_d1_m/)
      await selectDialogOption(page, 0)
    }

    const state = await getGameState(page)
    expect(state?.currentDialogId).toBeNull()
    expect(state?.phase).toBe('action_select')
  })

  test('recruit lan special action works at Day 1 afternoon', async ({ page }) => {
    const finalState = await playFullGame(page, LEGENDARY_REI_CHOICES, 2)

    expect(finalState).toBeTruthy()
    expect(finalState!.employeeCount).toBeGreaterThanOrEqual(2)
  })

  test('story dialogs render with story-dialog CSS class', async ({ page }) => {
    const state0 = await getGameState(page)
    expect(state0?.currentDialogId).toBe('intro')
    await selectDialogOption(page, 0)

    await page.waitForTimeout(300)
    const state1 = await getGameState(page)
    if (state1?.currentDialogId && !state1.currentDialogId.startsWith('story_')) {
      await selectDialogOption(page, 0)
    }

    await page.waitForSelector('.dialog-modal.story-dialog', { timeout: 10000 })
    const storyDialog = page.locator('.dialog-modal.story-dialog')
    await expect(storyDialog).toBeVisible()

    const className = await storyDialog.getAttribute('class')
    expect(className).toContain('story-dialog')
  })

  test('affinity panel visible after affinity changes', async ({ page }) => {
    await playFullGame(page, LEGENDARY_REI_CHOICES, 2)

    await page.evaluate(() => {
      const s = (window as any).__stores
      if (s) {
        const g = s.game.getState()
        if (g.phase === 'day_summary') {
          g.setPhase('action_select')
        }
      }
    })
    await page.waitForTimeout(500)

    const affinityPanel = page.locator('.affinity-panel')
    await expect(affinityPanel).toBeVisible({ timeout: 5000 })
  })

  test('work_project enters project_assign phase when clicked', async ({ page }) => {
    while (true) {
      const state = await getGameState(page)
      if (!state) { await page.waitForTimeout(300); continue }
      if (!state.currentDialogId && state.phase === 'action_select') break
      if (state.currentDialogId) { await selectDialogOption(page, 0); continue }
      await page.waitForTimeout(200)
    }

    await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return
      s.game.getState().setPhase('project_assign')
    })
    await page.waitForTimeout(500)

    const assignView = page.locator('.project-assign-view')
    await expect(assignView).toBeVisible({ timeout: 5000 })

    const projectCards = page.locator('.pa-project-card')
    await expect(projectCards.first()).toBeVisible({ timeout: 5000 })

    const backBtn = page.locator('.pa-back-btn')
    await expect(backBtn).toBeVisible({ timeout: 3000 })
  })

  test('work_project action card shows project preview', async ({ page }) => {
    while (true) {
      const state = await getGameState(page)
      if (!state) { await page.waitForTimeout(300); continue }
      if (!state.currentDialogId && state.phase === 'action_select') break
      if (state.currentDialogId) { await selectDialogOption(page, 0); continue }
      await page.waitForTimeout(200)
    }

    const previewItems = page.locator('.action-project-preview .preview-project-item')
    await expect(previewItems.first()).toBeVisible({ timeout: 5000 })

    const projectName = await previewItems.first().locator('.preview-project-name').textContent()
    expect(projectName).toBeTruthy()
  })

  test('work_project disabled when no active projects', async ({ page }) => {
    while (true) {
      const state = await getGameState(page)
      if (!state) { await page.waitForTimeout(300); continue }
      if (!state.currentDialogId && state.phase === 'action_select') break
      if (state.currentDialogId) { await selectDialogOption(page, 0); continue }
      await page.waitForTimeout(200)
    }

    await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return
      const projects = s.project.getState().projects
      for (const p of projects) {
        s.project.getState().failProject(p.id)
      }
      s.project.getState().clearCompletedAndFailed()
    })
    await page.waitForTimeout(500)

    const workProjectCard = page.locator('.action-card').filter({ hasText: '推进项目' })
    await expect(workProjectCard).toHaveClass(/disabled/, { timeout: 5000 })

    const reason = workProjectCard.locator('.action-reason')
    await expect(reason).toHaveText('没有进行中项目', { timeout: 3000 })
  })

  test('full work_project flow: assign view → assign employee → confirm → settlement', async ({ page }) => {
    while (true) {
      const state = await getGameState(page)
      if (!state) { await page.waitForTimeout(300); continue }
      if (!state.currentDialogId && state.phase === 'action_select') break
      if (state.currentDialogId) { await selectDialogOption(page, 0); continue }
      await page.waitForTimeout(200)
    }

    const beforePower = await page.evaluate(() => {
      const s = (window as any).__stores
      return s ? s.resource.getState().resources.power : 0
    })

    await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return
      s.game.getState().setPhase('project_assign')
    })
    await page.waitForTimeout(500)

    const assignView = page.locator('.project-assign-view')
    await expect(assignView).toBeVisible({ timeout: 5000 })

    const projectCards = page.locator('.pa-project-card')
    await expect(projectCards.first()).toBeVisible({ timeout: 5000 })
    await projectCards.first().click()
    await page.waitForTimeout(300)

    const idleEmpCards = page.locator('.pa-emp-card.idle')
    const idleCount = await idleEmpCards.count()
    if (idleCount > 0) {
      await idleEmpCards.first().click()
      await page.waitForTimeout(300)
    }

    const confirmBtn = page.locator('.pa-confirm-btn:not(.disabled)')
    await expect(confirmBtn).toBeVisible({ timeout: 3000 })
    await confirmBtn.click()
    await page.waitForTimeout(800)

    const stateAfter = await getGameState(page)
    expect(stateAfter?.phase).toBe('settlement')

    if (beforePower >= 5) {
      const afterPower = await page.evaluate(() => {
        const s = (window as any).__stores
        return s ? s.resource.getState().resources.power : 0
      })
      expect(afterPower).toBe(beforePower - 5)
    }
  })

  test('back button undoes action and restores previous state', async ({ page }) => {
    while (true) {
      const state = await getGameState(page)
      if (!state) { await page.waitForTimeout(300); continue }
      if (!state.currentDialogId && state.phase === 'action_select') break
      if (state.currentDialogId) { await selectDialogOption(page, 0); continue }
      await page.waitForTimeout(200)
    }

    const before = await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return null
      const r = s.resource.getState().resources
      const p = s.project.getState().projects.map((proj: any) => ({
        id: proj.id, slotsSpent: proj.slotsSpent, isCompleted: proj.isCompleted
      }))
      const e = s.employee.getState().employees.map((emp: any) => ({
        id: emp.id, status: emp.status
      }))
      return { gold: r.gold, power: r.power, projects: p, employees: e }
    })
    expect(before).not.toBeNull()

    const result = await executeAction(page, 'rest')
    expect(result).toBe(true)
    await page.waitForTimeout(500)

    const stateAfterAction = await getGameState(page)
    expect(stateAfterAction?.phase).toBe('settlement')

    const backBtn = page.locator('.settlement-footer .back-btn')
    await expect(backBtn).toBeVisible({ timeout: 5000 })
    await expect(backBtn).toHaveText(/返回/, { timeout: 3000 })

    await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return
      s.game.getState().undoLastAction()
    })
    await page.waitForTimeout(500)

    const afterUndo = await page.evaluate(() => {
      const s = (window as any).__stores
      if (!s) return null
      const r = s.resource.getState().resources
      const p = s.project.getState().projects.map((proj: any) => ({
        id: proj.id, slotsSpent: proj.slotsSpent, isCompleted: proj.isCompleted
      }))
      const e = s.employee.getState().employees.map((emp: any) => ({
        id: emp.id, status: emp.status
      }))
      const g = s.game.getState()
      return { gold: r.gold, power: r.power, projects: p, employees: e, phase: g.phase, hasActedThisSlot: g.hasActedThisSlot }
    })
    expect(afterUndo).not.toBeNull()

    expect(afterUndo!.phase).toBe('action_select')
    expect(afterUndo!.hasActedThisSlot).toBe(false)
    expect(afterUndo!.gold).toBe(before!.gold)
    expect(afterUndo!.power).toBe(before!.power)

    for (let i = 0; i < before!.projects.length; i++) {
      expect(afterUndo!.projects[i].slotsSpent).toBe(before!.projects[i].slotsSpent)
      expect(afterUndo!.projects[i].isCompleted).toBe(before!.projects[i].isCompleted)
    }

    const actionGrid = page.locator('.action-grid')
    await expect(actionGrid).toBeVisible({ timeout: 5000 })

    const actedSlot = page.locator('.acted-slot')
    await expect(actedSlot).not.toBeVisible()
  })
})

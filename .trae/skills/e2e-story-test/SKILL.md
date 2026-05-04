---
name: "e2e-story-test"
description: "Run Playwright E2E tests to automatically play through the 3-day story from browser perspective. Invoke when user asks to test the story, run e2e tests, verify story flow, or check if the game works end-to-end."
---

# E2E Story Test

Automated browser testing for the 3-day galgame story using Playwright.

## Architecture

Uses a **"Store-Driven Agent"** pattern: the test agent manipulates game state through `window.__stores` (Zustand store methods exposed in dev mode), while using Playwright DOM queries to verify UI rendering correctness.

```
Playwright Agent  ←page.evaluate()→  window.__stores.game
                  ←page.locator()→   DOM elements
```

## Prerequisites

1. **Dev server must be running** on `localhost:10087` (or auto-started by Playwright)
2. **Playwright browsers installed**: `npx playwright install chromium`
3. **`window.__stores`** is available (dev-only, defined in `src/app.ts`)

## Commands

```bash
# Run all story e2e tests
npm run test:e2e:story

# Run with visible browser
npm run test:e2e:headed

# Step-by-step debug mode
npm run test:e2e:debug

# Run full test suite
npm run test:e2e
```

## Store API Reference

The agent interacts with the game via these Zustand store methods:

| Method | Store | Purpose |
|--------|-------|---------|
| `selectDialogOption(dialogId, option)` | game | Choose a dialog option |
| `selectAction(actionId)` | game | Execute an action (rest, work_project, etc.) |
| `advanceTimeSlot()` | game | Move to next time slot |
| `setPhase(phase)` | game | Switch game phase |
| `resolveEvent(eventId, optionId)` | game | Handle random events |
| `checkStoryDialogTriggers()` | game | Manually trigger story dialogs |
| `getState()` | game | Read full game state |

## Game State Query

```typescript
const state = await page.evaluate(() => {
  const s = (window as any).__stores
  const g = s.game.getState()
  return {
    day: g.day,
    timeSlot: g.timeSlot,
    phase: g.phase,
    currentDialogId: g.currentDialogId,
    characterAffinity: g.characterAffinity,
    employeeCount: s.employee.getState().employees.length,
  }
})
```

## Choice Maps

The test defines two choice maps for branching story paths:

| Map | Key Choice | Result |
|-----|-----------|--------|
| `LEGENDARY_REI_CHOICES` | `story_d3_e_2` → option 0 | Rei joins as legendary (rei=3) |
| `PARTNER_REI_CHOICES` | `story_d3_e_2` → option 1 | Rei joins as partner (rei=4) |

Other branch points (`story_d1_m_2`, `story_d1_a_1`, `story_d1_e_2`, `story_d2_m_2`, `story_d2_a_2`, `story_d2_e_3`) default to option 0.

## Test Loop Flow

The `playFullGame()` function runs a 300-iteration loop:

1. **Read state** via `getGameState()`
2. **If dialog active** → `selectDialogOption()` with choice map
3. **If event phase** → `resolveEvent()`
4. **If settlement phase** → `advanceFromSettlement()` (calls `advanceTimeSlot()`)
5. **If day_summary phase** → `advanceFromDaySummary()` (calls `setPhase('action_select')`)
6. **If action_select phase** → `executeAction('rest')` (fallback: `work_project`)
7. **Exit when** `day >= untilDay`

## 3-Day Story Timeline

| Day | Slot | Entry Dialog | Key Events |
|-----|------|-------------|------------|
| 1 | morning | `story_d1_m_1` | 5-step chain, tira introduces studio |
| 1 | afternoon | `story_d1_a_1` | 3-step chain, **recruit_lan** (specialAction) |
| 1 | evening | `story_d1_e_1` | 3-step chain, affinity choice |
| 2 | morning | `story_d2_m_1` | 5-step chain, Rei appears |
| 2 | afternoon | `story_d2_a_1` | 3-step chain |
| 2 | evening | `story_d2_e_1` | 4-step chain, tira vs Rei conflict |
| 3 | morning | `story_d3_m_1` | 3-step chain, truth revealed |
| 3 | afternoon | `story_d3_a_1` | 2-step chain |
| 3 | evening | `story_d3_e_1` | 4-step chain, **recruit_rei_legendary/recruit_rei_partner** |

## Known Issues

- Taro's `onClick` on `View` elements does not reliably propagate Playwright clicks. Use store methods instead of UI clicks for state transitions.
- `settleDayEnd()` sets `phase=day_summary`, but the old `handleContinueAfterSettlement` in `index.tsx` called `setPhase('action_select')` after it, overriding the day_summary phase. This was fixed.
- `event.ts` was missing `import { useProjectStore } from './project'`, which caused a ReferenceError during `tryTriggerDayEvent()`. This was fixed.

## Files

| File | Purpose |
|------|---------|
| `e2e/story-playthrough.spec.ts` | 6 test cases |
| `playwright.config.ts` | Playwright configuration |
| `src/app.ts` | `window.__stores` dev-only exposure |

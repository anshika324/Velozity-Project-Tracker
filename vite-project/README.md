# Velozity Project Tracker

A fully-featured multi-view project management UI built with React, TypeScript, Tailwind CSS, and Zustand.

**Live demo:** https://velozity-project-tracker-indol.vercel.app/
---

## Setup Instructions

```bash
git clone <your-repo-url>
cd project-tracker
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
```

Requires Node.js 18+. No environment variables needed.

---

## State Management: Zustand

I chose **Zustand** over React Context + useReducer for three reasons:

1. **Performance** — Zustand uses fine-grained subscriptions. Components only re-render when the specific slice they select changes. With 500+ tasks, Context would cause every consumer to re-render on any state change (e.g. dragging a card). Zustand's selector pattern (`useStore(s => s.tasks)`) avoids this.

2. **No boilerplate** — Context + useReducer requires a provider tree, action type enums, a reducer, and dispatch everywhere. Zustand collapses this into a single `create()` call with co-located actions.

3. **Scalability** — Zustand has first-class support for Redux DevTools and `persist` middleware. Undo/redo or offline support would be straightforward additions.

---

## Virtual Scrolling Implementation

Implemented from scratch in `src/components/list/ListView.tsx` — no library used.

**Core algorithm:**

```
totalHeight  = totalRows × ROW_HEIGHT          // full scrollbar height
startIndex   = floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS
endIndex     = startIndex + visibleCount + BUFFER_ROWS * 2
visibleTasks = sorted.slice(startIndex, endIndex)
offsetY      = startIndex × ROW_HEIGHT         // absolute position of first rendered row
```

A single outer `<div>` has `height: totalHeight` to maintain the correct scrollbar. Inside it, an `position: absolute; top: offsetY` wrapper holds only the rendered rows. `onScroll` updates `scrollTop` which triggers a recalculation — only the visible window re-renders.

`ROW_HEIGHT` is fixed at 52px for exact arithmetic. A `ResizeObserver` keeps `containerHeight` accurate on window resize. Buffer of 5 rows above and below prevents any blank flicker during fast scrolls.

---

## Drag-and-Drop Implementation

No library. Implemented across `KanbanBoard`, `KanbanColumn`, `KanbanCard`, and `useTouchDrag`.

**Mouse (HTML Drag Events):**
- `dragstart` — stores task ID in `dataTransfer`, creates 1×1px offscreen drag image so the card's own opacity-fade acts as the ghost, stores original status in a ref
- `dragover` on columns — calls `preventDefault()` to allow drop, highlights column
- `drop` — reads task ID, calls `moveTask()` in store
- `dragend` — always fires; clears all drag state. If `drop` never fired (dropped outside), task status is unchanged — this is the snap-back mechanism

**Placeholder without layout shift:**
When `draggingTaskId === task.id`, the card is replaced with a `<div className="drag-placeholder">` of identical height (110px). Siblings never move. The indigo dashed box is a clear affordance.

**Touch (Pointer Events, `useTouchDrag.ts`):**
- `touchstart` — clones the card into a `position: fixed` ghost div
- `touchmove` — translates ghost with finger, uses `document.elementsFromPoint()` to detect column under touch, highlights it
- `touchend` — calls `onDrop(taskId, column)` if valid column found; otherwise animates ghost back with `opacity: 0 + scale(0.9)` over 320ms

Touch events use `{ passive: false }` so `preventDefault()` works and drag doesn't conflict with scroll.

---

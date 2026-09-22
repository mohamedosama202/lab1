# Lab 1 — Filter & Search Todos

This fork implements Practice Assignment 1 for Software Project I (Winter 2026): filtering todos by their `done` status via `GET /api/todos?done=true|false`, while `GET /api/todos` (no query) still returns everything.

## Path casing fix

The starter project had import paths that didn't match the actual file casing on disk (`backend/server.js` required `./Routes/todoRoutes` instead of `./routes/todoRoutes`, and the frontend imported `./TodoForm`, `./TodoList`, and `./TodoItem` instead of the lowercase `./todoForm`, `./todoList`, `./todoItem`). This works on case-insensitive filesystems (macOS/Windows) but breaks on case-sensitive ones (Linux, most CI/CD and deployment environments). This was fixed first so the rest of the changes build on a working project.

## Backend filter

`getTodos` in `backend/controllers/todoController.js` now reads `done` off `req.query`. If `done` is `'true'` or `'false'`, it's added to a `filter` object passed to `Todo.find(filter)`; if no `done` param is given, `filter` stays `{}` and every todo is returned, exactly as before.

## `fetchTodos` param

`frontend/src/api/todos.js`'s `fetchTodos` now accepts an optional `done` argument and forwards it as a query param (`api.get('/', { params: { done } })`). When `done` is `undefined`, axios omits the param entirely, so the request is identical to the original no-filter call.

## Filter state and `FilterTabs` UI

`App.jsx` holds a `filter` state (`'all' | 'active' | 'done'`) and re-fetches from the server whenever it changes, translating it to `done = undefined | false | true`. A `FilterTabs` component (`frontend/src/filterTabs.jsx`) renders the All / Active / Done buttons and reports the selected tab back up through `onChange`. `TodoList` also receives the current `filter` so it can show a filter-specific empty state message.

## Server-side vs. client-side filtering

This exercise implements **server-side** filtering: switching tabs re-fetches from `GET /api/todos?done=...`. Trade-offs:

- **Server-side** (what's implemented here): the client only ever holds the todos it's currently showing, so it scales better with large lists and less data crosses the network — but every tab switch costs a network round-trip.
- **Client-side**: fetch everything once and filter the array in React. Switching tabs is instant with no network cost, but the client has to hold (and initially download) the full todo list, which doesn't scale as well.

For this exercise, the server-side approach was chosen to practice passing query params end to end.

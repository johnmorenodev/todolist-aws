## React client (`client_react`)

A React port of the existing Vue client with equivalent auth, routing, and API behavior.

### Stack
- React + Vite + TypeScript
- Tailwind CSS
- Mantine UI
- Zustand (auth store)
- TanStack Query

### Scripts
- `npm run dev` — start dev server on port 5174
- `npm run build` — production build
- `npm run preview` — preview build
- `npm test` — run unit tests (Vitest)

### Environment
- Create `.env` with:
```
VITE_API_BASE_URL=/api
```

Ensure the Spring Boot backend CORS `allowed-origin` includes the React dev origin (e.g., `http://localhost:5174`) for local testing.

### Structure
```
client_react/
  src/
    api/auth.ts
    lib/api.ts
    stores/auth.ts
    components/RequireAuth.tsx
    pages/{Home,Login,Signup}.tsx
    App.tsx
    main.tsx
    styles/index.css
```



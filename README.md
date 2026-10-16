# Latihan Frontend PKL LSKK

Project ini merupakan aplikasi frontend React untuk latihan PKL di LSKK. Aplikasi ini mengimplementasikan praktik terbaik (best practices) dalam pengembangan web modern, termasuk manajemen state, routing, validasi form, dan penanganan data yang efisien.

## Tech Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Ant Design](https://ant.design/) & [MUI X DataGrid](https://mui.com/x/react-data-grid/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (dengan persist middleware)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing:** [React Router DOM](https://reactrouter.com/) (`createHashRouter` + Lazy Loading)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Networking:** [Axios](https://axios-http.com/) + [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter)
- **Tooling:** [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

##  Prerequisites

Pastikan kamu telah menginstal:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/)

## Install Dependencies
- npm install
- cp .env.example .env
- npm run dev

```
## Progress Minggu 1
- [x] Setup Environment (Vite, React, TS, Tailwind v4)
- [x] Auth Flow (Zustand + RHF + Zod)
- [x] Data Fetching & Pagination (TanStack Query)
- [x] Form Tambah/Edit (Ant Design Modal)

## Check List Revisi
- [x] Logika CRUD & Pagination
- [x] Error Api
- [x] Interface respone
- [x] createHashRouter & lazy loading
- [x] auth
- [x] lain-lain
- [x] setup + format code with prettier
- [x] change antd Table to ReactDataGrid (MUI)
- [x] N1 : Revisi network axios mock adapter & restore auth inerceptor
- [x] N2 : Revisi model prevent modal close on sub failure
- [x] N3 : Revisi schemas single true source
- [x] N4 : Revisi show api error, per-row delete loading state, cleanup 
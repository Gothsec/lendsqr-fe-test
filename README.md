# lendsqr-fe-test

Frontend Engineer technical assessment for LendSQR.

A fintech admin dashboard built with **Next.js 16**, **TypeScript**, and **SCSS Modules**. Features a mock API with 500 user records, authentication flow, user directory with full CRUD-style management, and responsive design matching the Figma specification.

## Tech Stack

| Concern        | Choice                              |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 (App Router)             |
| Language       | TypeScript (strict mode)            |
| Styling        | SCSS Modules (`*.module.scss`)      |
| Package mgr    | pnpm 11                             |
| Path alias     | `@/*` → root `./*`                  |
| Data           | Mock JSON (500 records) + localStorage persistence |

## Getting Started

```bash
pnpm install
pnpm dev          # → http://localhost:3000
pnpm build        # production build + type check
pnpm start        # run production server
pnpm lint         # ESLint
```

## Routes

| Route            | Description                               |
| ---------------- | ----------------------------------------- |
| `/login`         | Login with mock authentication            |
| `/dashboard`     | Analytics overview with stats & charts    |
| `/users`         | User directory with filters & pagination  |
| `/users/[id]`    | User profile with details & status mgmt   |

## Features

- **Mock auth** — login with any email/password (demo: `admin@lendsqr.com` / `password`)
- **500 synthetic users** — generated with realistic data matching the Figma schema
- **Dashboard** — stat cards, user status distribution, recent user activity
- **Users directory** — sortable, filterable, paginated table with 4 status badges
- **User details** — full profile, tabs, education/employment/socials/guarantor info
- **Status management** — activate / blacklist users, persisted to localStorage
- **Responsive** — mobile-first breakpoints at 1200px, 768px, 480px
- **No external runtime deps** — only Next.js, React, and Sass

## Architecture

```
app/
├── login/               # Login page
├── (dashboard)/         # Authenticated routes group
│   ├── dashboard/       # Overview page
│   ├── users/           # User listing + [id] detail
│   └── layout.tsx       # Auth guard + TopNav + SideNav
├── api/users/           # Mock REST endpoints (GET)
├── globals.scss         # Design tokens & reset
components/              # Reusable UI (SideNav, TopNav, UsersTable)
context/                 # AuthContext with session timeout
lib/                     # Types, auth helpers, data loaders
data/users.json          # 500 mock records
```

## Mock Credentials

The login form accepts any email/password combination. Demo hint displayed on the login page.

## Figma Design

Designed against: [Frontend Testing](https://www.figma.com/file/ZKILoCoIoy1IESdBpq3GNC/Frontend-Testing?node-id=5530%3A0)

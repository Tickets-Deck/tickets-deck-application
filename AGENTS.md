# Agent & Developer Onboarding Guide

This document outlines the essential guidelines for agents and developers working on the **Ticketsdeck** platform. Following these standards will ensure consistency, maintain quality, and promote effective collaboration across the team.

---

## 1. Project Overview

**Ticketsdeck** is a ticketing and event management platform that enables organizers to create, manage, and sell tickets for their events while giving users a seamless ticket-buying experience.

The project ecosystem includes:

* **Ticketsdeck Events** – user-facing event discovery and ticketing portal

This document focuses primarily on the **Ticketsdeck Events** frontend.

### Tech Stack Overview

* **Framework**: [Next.js](https://nextjs.org/) (v15) with the App Router
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **UI Components**: Custom-built components using [Tailwind CSS](https://tailwindcss.com/) and [Headless UI](https://headlessui.dev/), with gradual migration to [Lucide React](https://lucide.dev/) for icons
* **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) for global state management
* **Forms**: Currently handled via controlled components; **React Hook Form** will be introduced in future updates
* **Validation**: Minimal for now (manual checks); **Zod** will be introduced later for schema validation
* **Authentication**: [NextAuth.js](https://next-auth.js.org/) for handling sessions and user authentication
* **Deployment**: [Vercel](https://vercel.com/)
* **Package Manager**: [npm](https://www.npmjs.com/) (primary)

---

## 2. Getting Started

### Prerequisites

* **Node.js** (v20 or later)
* **npm** (installed by default with Node.js)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd ticketsdeck-events
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env.local` file**:

   * Copy variables from `.env.example` (if available).
   * Fill in your environment-specific secrets such as database URLs, API keys, and NextAuth credentials.

---

## 3. Build and Test Commands

Available npm scripts:

| Command         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `npm run dev`   | Starts the development server on `http://localhost:3000` |
| `npm run build` | Builds the app for production                            |
| `npm run start` | Runs the production build                                |
| `npm run lint`  | Runs ESLint to catch and fix code issues                 |
| `npm run test`  | Runs the unit tests (if configured)                      |

> Note: Testing setup is minimal at this stage. We will gradually integrate Jest and React Testing Library.

---

## 4. Code Style & Conventions

* **Components**

  * Shared UI components live in `src/components/ui`.
  * Feature-specific components live under `src/components/{featureName}`.
* **Styling**

  * Always use **Tailwind CSS** utilities.
  * Avoid custom CSS unless absolutely necessary.
* **File Naming**

  * Components: `PascalCase` (e.g., `EventCard.tsx`)
  * Hooks, utils, and non-component files: `camelCase` (e.g., `useFetch.ts`, `apiClient.ts`)
* **Typing**

  * Maintain strong typing using TypeScript.
  * Common interfaces/types should go under `src/types`.
* **Icons**

  * Use [Lucide React](https://lucide.dev/) icons for consistency.
* **Accessibility**

  * Follow semantic HTML standards.
  * Prefer Headless UI for interactive elements (dialogs, dropdowns, modals, etc.).

---

## 5. Version Control (Git)

### Branching Strategy

* **`develop`** — main development branch
* **Feature Branches** — `feature/<feature-name>` (e.g., `feature/event-url-shortener`)
* **Bugfix Branches** — `fix/<bug-name>` (e.g., `fix/login-error`)

### Pull Request (PR) Process

1. Create a PR from your feature/fix branch to `develop`.
2. Add a clear title and concise description.
3. Make sure all checks pass (`lint`, `build`, `test`).
4. Assign a reviewer for approval.

### Commit Messages

Follow the **Conventional Commits** format:

```
<type>[optional scope]: <description>
```

Examples:

* `feat(events): add event URL shortener`
* `fix(auth): handle session token expiration`
* `chore(ci): update Vercel build config`

**Types:**

* `feat`: new feature
* `fix`: bug fix
* `docs`: documentation updates
* `style`: formatting, no code change
* `refactor`: code restructure
* `test`: adding or fixing tests
* `chore`: config or build changes

---

## 6. Testing Guidelines

We’re gradually building the test coverage for the project.

* Co-locate test files with components (e.g., `EventCard.test.tsx`)
* Use Jest + React Testing Library for component and logic testing
* Mock external calls (e.g., API requests) for isolated tests
* Write at least one test for new core logic or UI flow

---

## 7. Security & Environment Handling

* **Environment Variables**

  * Never commit `.env.local` files or any secrets.
  * Sensitive keys should only exist locally or in Vercel environment settings.
* **Authentication**

  * Protected routes reside under `(protected)` segments.
  * Use `useSession()` from NextAuth to manage access.
* **Input Validation**

  * Sanitize user inputs manually for now.
  * Future plan: adopt Zod validation both client- and server-side.

---

## 8. Deployment

Ticketsdeck uses **Vercel** for hosting and continuous deployment.

* **Production**

  * Merging into `main` triggers a production deployment.
* **Staging / Preview**

  * PRs into `develop` auto-deploy as preview environments.
* **Build Command**

  ```bash
  npm run build
  ```

Vercel automatically optimizes static assets, Next.js routes, and API functions for performance.

---

## 9. Additional Notes

* Always run `npm run lint` before pushing changes.
* Keep PRs small and atomic — easier to review and deploy.
* Check for consistent Tailwind usage and color tokens before merging.
* Document any new utilities or config changes in `/docs/` or relevant README files.

---

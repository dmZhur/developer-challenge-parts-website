# Parts Finder

A B2B parts catalogue SPA for browsing, filtering, and quoting heavy-truck components.

Built with **Nuxt 4**, **Vue 3**, **TypeScript**, and **Tailwind CSS v4**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (Vue 3, `<script setup>`) |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Language | TypeScript |
| Testing | Vitest + @nuxt/test-utils + happy-dom |
| Linting | ESLint 9 flat config + eslint-config-prettier |
| Formatting | Prettier |

---

## Features

- Browse and search a catalogue of truck parts
- Filter by category, brand, condition, and stock availability
- Sort by name or price
- Part detail page with specifications and colour selection
- Quote drawer — add parts with quantity and selected colour
- Fully reactive state via Vue composables

---

## Prerequisites

- **Node.js** ≥ 18 (developed on v22)
- **npm** ≥ 9

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint with ESLint |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Project Structure

```
app/
├── components/
│   ├── common/        # AppBadge, AppButton, AppInput
│   ├── layout/        # AppHeader, AppFooter
│   ├── parts/         # PartCard, PartFilters, PartSortSelect
│   └── quote/         # QuoteDrawer, QuoteItem
├── composables/       # usePartsFinder, useQuote
├── pages/             # / (catalogue), /parts/[id] (detail)
├── types/             # Shared TypeScript interfaces
└── utils/             # filterParts, colorSwatch
server/
├── api/               # GET /api/parts, GET /api/parts/:id
└── data/              # Mock parts dataset (36 parts)
tests/
├── components/        # PartCard, PartSortSelect component tests
├── composables/       # useQuote composable tests
└── utils/             # filterParts unit tests
```

---

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/parts` | Returns all parts |
| `GET` | `/api/parts/:id` | Returns a single part by ID |

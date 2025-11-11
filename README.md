## CareerPilotAI

AI-powered career document generator with a unified Next.js 14 (App Router) application. It provides authenticated generation and management of resumes, cover letters, and LinkedIn bios, plus export to PDF/DOCX/TXT and plan management via Razorpay.

### Key Features
- Auth (JWT) with protected API routes and usage limits per plan
- Generate and edit: Resume, Cover Letter, LinkedIn Bio
- Exports: PDF (LaTeX compilation via external service), DOCX, TXT
- PDF Preview (inline render) and Download
- Subscription plans (Free, Basic, Premium) with Razorpay
- Clean UI built with Tailwind and shadcn/ui components
- MongoDB via Mongoose with shared models for API routes


## Tech Stack
- Framework: Next.js 14 (App Router), React 18
- UI: Tailwind CSS, shadcn/ui, Radix primitives
- Database: MongoDB (Mongoose)
- Auth: JWT (stateless, Authorization header)
- Payments: Razorpay
- PDF: LaTeX-on-HTTP (`https://latex.ytotech.com`) + DOCX via `docx` package
- TypeScript everywhere on the frontend


## Monorepo Structure

```
root
├─ backend/                # Legacy Node/Express code (not required at runtime after migration)
├─ frontend/               # Next.js application (SSR + API routes)
│  ├─ app/                 # App Router pages and API endpoints
│  │  ├─ (auth)/           # Login/Register pages
│  │  ├─ (dashboard)/      # Authenticated UI (documents, profile, subscription)
│  │  └─ api/              # Server-side API routes (replacing Express)
│  ├─ components/          # UI components (shadcn/ui)
│  ├─ lib/                 # db, middleware, server-config, API client, utils
│  ├─ models/              # Mongoose models (User, Resume, CoverLetter, LinkedInBio)
│  └─ hooks/               # Client hooks (export, toast, etc.)
└─ README.md               # This document
```

Notes:
- The Next.js app now serves both the frontend UI and the backend API under `/api`. The `backend/` folder is retained for reference during migration but is not required to run the app.


## Environment Variables
Create a `.env.local` in `frontend/` (used by Next.js runtime). The Next.js API routes also read server-side secrets from this file.

Required (server-side):
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace_with_long_random_string
JWT_EXPIRE=30d

# Gemini/OpenAI (optional if you later integrate model generation)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

# Razorpay (payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET= # optional if using webhooks later
```

Public (client-visible):
```
# App branding
NEXT_PUBLIC_APP_NAME=CareerPilotAI
NEXT_PUBLIC_APP_VERSION=1.0.0

# Pricing (INR) for client UI
NEXT_PUBLIC_BASIC_PLAN_PRICE=499
NEXT_PUBLIC_PREMIUM_PLAN_PRICE=999

# Optional override for API base (defaults to /api). Do not point to legacy server.
# NEXT_PUBLIC_API_BASE_URL=/api
```

Important:
- Do not expose secrets without `NEXT_PUBLIC_` prefix.
- The frontend Axios client defaults to `baseURL = /api`, so the same origin serves all API routes.


## Installation

1) Install dependencies
```
cd frontend
npm install
```

2) Configure `.env.local` (see above)

3) Run development server
```
npm run dev
# App: http://localhost:3000
```

4) Build and run production locally
```
npm run build
npm start
```


## Architecture Overview

- Data storage: MongoDB via `lib/db.ts` (connection caching for hot reloads)
- Domain models: `models/User.ts`, `models/Resume.ts`, `models/CoverLetter.ts`, `models/LinkedInBio.ts`
- Auth + limits: `lib/middleware/auth.ts`
  - `protect(req)` validates JWT from `Authorization: Bearer <token>`
  - `checkUsageLimit(user, type)` enforces per-plan generation limits
  - `checkPdfPermission`, `checkDocxExportPermission`, `checkTxtExportPermission` enforce plan-based exports
- Plan config: `lib/server-config.ts` defines Free/Basic/Premium features
- API Responses: uniform error handling via `lib/middleware/errorHandler.ts`
- PDF pipeline: `lib/pdf/latexToPdf.ts` compiles LaTeX to PDF using LaTeX-on-HTTP


## Core API Routes (Next.js)
All routes are under `/api`.

Auth
- POST `/api/auth/register` – Register user
- POST `/api/auth/login` – Log in, returns JWT
- GET `/api/auth/me` – Current user (protected)

User
- GET `/api/users/profile` – Get profile (protected)
- PUT `/api/users/profile` – Update name/email (protected)
- PUT `/api/users/password` – Update password (protected)
- GET `/api/users/usage` – Usage counts + plan limits (protected)

Generate (CRUD)
- Resume
  - POST `/api/generate/resume` – Create (protected, usage-limited)
  - GET `/api/generate/resume` – List (protected, pagination)
  - GET `/api/generate/resume/[id]` – Read
  - PUT `/api/generate/resume/[id]` – Update
  - DELETE `/api/generate/resume/[id]` – Delete
- Cover Letter
  - POST `/api/generate/cover-letter`
  - GET `/api/generate/cover-letter`
  - GET `/api/generate/cover-letter/[id]`
  - PUT `/api/generate/cover-letter/[id]`
  - DELETE `/api/generate/cover-letter/[id]`
- LinkedIn Bio
  - POST `/api/generate/linkedin`
  - GET `/api/generate/linkedin`
  - GET `/api/generate/linkedin/[id]`
  - PUT `/api/generate/linkedin/[id]`
  - DELETE `/api/generate/linkedin/[id]`

Exports
- PDF Download
  - GET `/api/pdf/resume/[id]`
  - GET `/api/pdf/cover-letter/[id]`
  - GET `/api/pdf/linkedin/[id]`
- PDF Preview (inline)
  - GET `/api/pdf/resume/[id]/preview`
  - GET `/api/pdf/cover-letter/[id]/preview`
  - GET `/api/pdf/linkedin/[id]/preview`
- DOCX
  - GET `/api/export/resume/[id]/docx`
  - GET `/api/export/cover-letter/[id]/docx`
  - GET `/api/export/linkedin/[id]/docx`
- TXT
  - GET `/api/export/resume/[id]/txt`
  - GET `/api/export/cover-letter/[id]/txt`
  - GET `/api/export/linkedin/[id]/txt`

Payments (Razorpay)
- GET `/api/payment/plans` – Plan metadata
- POST `/api/payment/create-order` – Create Razorpay order (protected)
- POST `/api/payment/verify` – Verify signature, update user plan (protected)

Response format
- Success: `{ success: true, message, data: {...} }`
- Error: `{ success: false, error }` with proper HTTP status


## Frontend Highlights
- App routes under `app/(dashboard)` and `app/(auth)`
- `lib/api.ts` Axios client attaches `Authorization` header using JWT from `localStorage`
- `hooks/use-export.ts` handles file export UX with toasts and state
- `components/pdf-preview.tsx` streams inline previews from `/api/pdf/.../preview`


## Production Deployment

Vercel (recommended)
- Set build command: `npm run build`
- Output dir: `.next`
- Set environment variables in Vercel project settings (all required server/client vars)
- Ensure `MONGO_URI`, `JWT_SECRET`, Razorpay keys are configured in the Vercel environment
- LaTeX-on-HTTP is an external HTTPS service; no extra config is needed

Self-host / Docker (example)
- Build:
  ```
  npm ci
  npm run build
  npm start
  ```
- Include `.env` variables at runtime
- Ensure outbound HTTPS is allowed to `https://latex.ytotech.com`


## Security & Compliance
- JWT secrets must be long and random. Rotate periodically.
- Never expose non-`NEXT_PUBLIC_` secrets to the browser.
- Rate-limit critical endpoints if hosting publicly.
- Validate all input (Next.js routes already ensure required fields for critical routes).
- Use HTTPS in production.


## Troubleshooting
- Registration/Login fails
  - Ensure `JWT_SECRET` and `MONGO_URI` are set; restart server
  - Check Network tab for `/api/auth/register` or `/api/auth/login` response body
- Profile page shows empty data
  - Confirm `/api/users/profile` returns 200; 401 indicates missing/invalid JWT
  - Ensure `Authorization: Bearer <token>` is present (Axios interceptor)
- PDF preview “failed to fetch”
  - Preview calls `/api/pdf/.../preview` on same origin; ensure you’re logged in and plan allows PDF export
  - Check `lib/middleware/auth.ts` permissions; adjust to allow previews for all plans if desired
- Exports blocked (403)
  - Plan may not include DOCX/TXT/PDF; upgrade or relax checks in `checkDocxExportPermission`, etc.
- DB connection errors
  - Verify `MONGO_URI` and IP allow-listing for your MongoDB cluster


## Scripts (frontend/package.json)
- `npm run dev` – Start Next.js in development
- `npm run build` – Build production assets
- `npm start` – Run Next.js in production mode
- `npm run lint` – Lint


## Roadmap
- Replace placeholder LaTeX generation with Gemini-powered content for all document types
- Add webhook handling for Razorpay (optional)
- Add e2e tests and integration tests for API routes


## License
Proprietary – All rights reserved. Update this section if you intend to open-source the repo.



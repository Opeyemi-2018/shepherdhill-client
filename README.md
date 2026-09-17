# Shepherd Hill Client Portal

A client-facing web dashboard for **Shepherd Hill** — a service/staffing provider (e.g. security, cleaning, or facility "operatives" services). This app lets a client company log in, manage their subscriptions, pay invoices, review the operatives (staff) assigned to them, raise escalations/complaints, and audit account activity.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, using **shadcn/ui** (Radix primitives) for the component library.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Authentication Flow](#authentication-flow)
- [Data Flow & API Integration](#data-flow--api-integration)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Styling & UI System](#styling--ui-system)
- [Known Gaps / Notes](#known-gaps--notes)

---

## Overview

Shepherd Hill provides staff/operatives (e.g. security guards, cleaners) to client companies under subscription plans. This client portal is the self-service dashboard those client companies use to:

- View a snapshot of their account (active staff, payments, subscription status).
- Manage and pay for subscriptions (online via a payment gateway, or manually via bank transfer with proof-of-payment upload).
- View and rate/review the staff (referred to in the UI as **"Operatives"**) assigned to their location.
- Track payment history and download generated PDF receipts.
- Raise and follow up on escalations/complaints against staff, with a chat-style reply thread and file attachments.
- View an audit log of account activity (logins, updates, etc.) with filtering and pagination.
- Manage account settings: profile info, password, security, payment methods, and support enquiries.

The app is purely a **frontend client** — all business logic and data persistence live on a separate backend API (a Laravel-style REST API, based on response shapes like `status`, `message`, `data`).

## Tech Stack

| Concern | Library |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| UI library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| Components | shadcn/ui ("new-york" style) on top of Radix UI primitives |
| Forms & validation | `react-hook-form` + `zod` (`@hookform/resolvers`) |
| Icons | `lucide-react`, `react-icons` |
| Notifications | `sonner` (toasts) |
| Theming | `next-themes` (light/dark/system) |
| PDF generation | `jspdf` + `jspdf-autotable` (client-side receipt generation) |
| Date utilities | `date-fns` |
| Loading indicator | `react-top-loading-bar`, `react-spinners` |

## Project Structure

```
app/
  (auth)/                     Route group for unauthenticated pages
    layout.tsx                 Auth-specific layout
    sign-in/page.tsx           Login page
    forgot-password/page.tsx   Password recovery
  dashboard/
    layout.tsx                 Shared dashboard shell (Header + container)
    overview/page.tsx          Landing dashboard: stats, subscriptions, payments
    staffs/page.tsx            Operatives (staff) list, ratings & reviews
    subscription/page.tsx      Full subscription management + payments
    payment-history/page.tsx   Paginated payment history table
    payment-verify/page.tsx    Payment gateway callback/verification page
    audit-logs/page.tsx        Filterable, paginated account activity log
    Escalations/page.tsx       Complaint/escalation tracker with chat thread
    account-setting/           Tabbed account settings
      page.tsx
      components/
        AccountInformation.tsx
        ChangePassword.tsx
        Security.tsx
        PaymentMethod.tsx
        EnquiryEscalation.tsx
  layout.tsx                  Root layout (fonts, ThemeProvider, Toaster, AuthProvider)
  page.tsx                    Root route — redirects to /sign-in
  globals.css                 Tailwind base styles & CSS variables

actions/                      Next.js Server Actions ("use server") — server-side API calls
  signin.ts                   Login + change-password server actions (sets httpOnly auth cookie)
  staff.ts                    Fetch client's staff/operatives list
  payment.ts                  Fetch paginated payment history
  subscription.ts             Fetch paginated subscriptions

context/
  AuthContext.tsx              Client-side auth state (user, token) backed by localStorage

hooks/
  useSubscription.ts           Client-side data hook wrapping subscription fetching + filters
  usePayment.ts                Client-side data hook wrapping payment history fetching

components/
  Header.tsx, Headercontent.tsx, Cards.tsx, DateTime.tsx, LoadingBar.tsx, AddNewService.tsx
  ui/                           shadcn/ui primitives (button, card, dialog, table, form, etc.)

types/                          Shared TypeScript types (auth, escalation, changePassword, newPlan)
lib/utils.ts                    Shared utilities (e.g. `cn()` class merger)
```

## Core Features

### 1. Dashboard Overview (`/dashboard/overview`)
- Stat cards for active staff count and total payments.
- Subscription summary cards (active operative, validity period, next payment date).
- Subscriptions table with per-row actions: **Pay Online**, submit **manual bank transfer proof**, or view a **payment proof/document preview** (image or PDF, rendered inline).
- Embeds the **Payment History** table below the subscriptions section.

### 2. Subscriptions (`/dashboard/subscription`)
- Full subscription list with status filtering (all / paid / pending).
- "Request New Service" dialog (`AddNewService` component).
- Same online/manual payment flow as the overview page.
- **Client-side PDF receipt generation** via `jspdf`/`jspdf-autotable` for paid subscriptions.

### 3. Payments
- **Online payment**: calls `/api/client/initialize`, redirects the user to a hosted payment gateway (e.g. Paystack-style `authorization_url`), with a `callback_url` pointing back to `/dashboard/payment-verify`.
- **Manual payment**: uploads a bank-transfer proof (image/PDF, max 2MB) plus a transfer date and reference number to `/api/client/initialize/manual`. Includes a generated/copyable transaction reference and the company's bank details.
- **Payment verification** (`/dashboard/payment-verify`): reads the `reference` query param after gateway redirect, calls `/api/client/verify-transaction/:reference`, shows a toast, and redirects back to the overview page.
- **Payment History** (`/dashboard/payment-history`): searchable table of past transactions with status badges.

### 4. Operatives / Staff (`/dashboard/staffs`)
- Lists staff currently assigned to the client, with avatar, role, resume time, and status.
- Clients can **submit a star rating (1–5) and written review** (min. 10 characters) for each staff member, or view an existing review, via `/api/client/add-review`.

### 5. Escalations (`/dashboard/Escalations`)
- Lists complaints/escalations the client has raised against staff, with priority and status badges.
- Clicking a row opens a slide-out **conversation thread** (Sheet) showing the original complaint and threaded replies.
- Clients can reply with text and/or a file attachment (multipart upload) directly in the thread.

### 6. Audit Logs (`/dashboard/audit-logs`)
- Debounced search plus filters for action type and date range.
- Server-paginated table of account actions (create/update/delete/login), each with a **details modal** showing old/new JSON values, IP address, and user agent.

### 7. Account Settings (`/dashboard/account-setting`)
Tabbed interface (mobile-responsive with a slide-out menu) covering:
- Account information
- Change password
- Security settings
- Payment method
- Enquiry/escalation submission

## Authentication Flow

- **Login** (`actions/signin.ts` → `loginUser`): a Server Action posts credentials to `/api/client/login`. On success it:
  - Sets an **httpOnly `auth_token` cookie** (7-day expiry, `secure` in production) — used by other Server Actions (`payment.ts`, `subscription.ts`) that read the cookie directly via `next/headers`.
  - Returns the user object and bearer token to the client.
- **Client-side session** (`context/AuthContext.tsx`): a React context stores `user` and `token` in `localStorage` (so they survive refreshes) and exposes `login()` / `logout()`. Most dashboard pages read `token` from this context and pass it as a `Bearer` header on `fetch` calls made directly from client components.
- **Logout** clears localStorage, expires the `auth_token` cookie, and redirects to `/sign-in`.
- Note: there is currently **no route middleware** guarding `/dashboard/*` — protection relies on client-side redirects/hooks rather than a Next.js `middleware.ts`.

## Data Flow & API Integration

All requests target a backend defined by `NEXT_PUBLIC_API_URL`. Two patterns are used side by side:

1. **Server Actions** (`actions/*.ts`, marked `"use server"`) — used for login, password change, and the paginated payment/subscription list endpoints. These read the auth token from the `auth_token` cookie.
2. **Direct client-side `fetch`** — used throughout dashboard pages/components for actions triggered by user interaction (payments, reviews, escalations, audit logs). These read the token from `AuthContext` and send it as an `Authorization: Bearer <token>` header.

Custom hooks (`hooks/useSubscription.ts`, `hooks/usePayment.ts`) wrap the corresponding server actions to provide `data`, `isLoading`, `error`, and filter-update helpers to components.

Uploaded documents (payment proofs, escalation attachments) are served from the backend's `storage/` path and rendered in-app via image tags or embedded PDF viewers (`<object>`/`<iframe>`).

## Getting Started

**Prerequisites:** Node.js (LTS) and a running instance of the Shepherd Hill backend API.

```bash
# install dependencies
npm install

# configure environment
cp .env.example .env   # if present, otherwise create .env manually (see below)

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route (`/`) immediately redirects to `/sign-in`.

## Environment Variables

Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.example.com
```

This is the base URL for **all** backend API and storage requests (e.g. `${NEXT_PUBLIC_API_URL}/api/client/login`, `${NEXT_PUBLIC_API_URL}/storage/...`).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Styling & UI System

- Tailwind CSS v4 with CSS variables for theming, configured for light/dark/system via `next-themes`.
- UI primitives are generated with **shadcn/ui** (`components.json`: style `new-york`, base color `neutral`, icon library `lucide`), living under `components/ui/`.
- Path alias `@/*` maps to the project root (see `tsconfig.json`), so imports look like `@/components/ui/button`, `@/context/AuthContext`, etc.
- Brand accent color used throughout: `#FAB435` (amber/gold), with `#E89500`/`#E59300` as hover/darker variants.

## Known Gaps / Notes

These are things worth being aware of when extending the app — not necessarily bugs to fix immediately:

- No `middleware.ts` currently enforces auth on `/dashboard/*` routes at the routing layer; protection is client-side only.
- Some values (e.g. the manual-payment bank account number/name on the Overview and Subscription pages) are hardcoded placeholders rather than pulled from the API.
- A few components use `any` types for API responses (flagged with inline ESLint disables) rather than fully-typed response shapes.

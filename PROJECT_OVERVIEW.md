# Project Overview — Latter Day Shopping

## What Is This Project?

**Latter Day Shopping** is a multi-vendor e-commerce marketplace built with Next.js. The platform connects conscious shoppers with independent vendors who sell purposeful, sustainable, and ethically produced products. The tagline is "Discover & Shop. Inspire." — the marketplace positions itself around intentional living and community-driven commerce.

---

## Brand Identity

| Detail | Value |
|---|---|
| Brand name | Latter Day Shopping |
| Primary color | `#1B6FEB` (blue) |
| Typography | Inter (body) + Playfair Display (headings/display) |
| Support email | support@latterdayshopping.com |
| Phone | 256-640-5700 |
| Platform stats | 10K+ vendors · 50K+ products · 200K+ customers · 99% satisfaction |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| UI library | React 19 |
| Styling | Tailwind CSS 4 |
| ORM | Prisma 7 |
| Database | PostgreSQL (via `@prisma/adapter-pg`) |
| Auth utilities | `bcryptjs` (password hashing), `jsonwebtoken` (JWT) |
| Font loading | `next/font/google` (Inter + Playfair Display) |

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout (Header + Footer wrapper)
│   ├── about/               # About page
│   ├── shop/                # Shop / product listing
│   ├── vendor/              # Vendor application page
│   ├── blog/                # Blog
│   ├── brands/              # Brands directory
│   ├── categories/          # Category browser
│   ├── contact/             # Contact page
│   ├── advertise/           # Advertise with us
│   ├── partner-program/     # Partner program
│   ├── affiliate-disclosure/
│   ├── privacy/
│   ├── terms/
│   └── disclaimer/
├── api/
│   └── auth/register/       # User registration API route (scaffolded, currently commented out)
├── components/
│   ├── Header.tsx           # Sticky header with announcement bar, nav, mobile menu
│   └── Footer.tsx           # Site footer
├── lib/
│   └── prisma.ts            # Prisma client singleton (commented out pending DB config)
└── generated/prisma/        # Auto-generated Prisma client output
prisma/
├── schema.prisma            # DB schema (User model)
└── migrations/              # Migration: 20260514203214_init
```

---

## Pages & Features

### Homepage (`/`)
The richest page — contains:
- **Hero section**: Split dark/image layout, headline, CTAs ("Shop Now", "Become a Vendor"), live stats
- **Trust badges**: Easy Returns · Money Back Guarantee · 24/7 Support
- **New Arrivals grid**: 8 products (4-column grid with product cards)
- **Trendy Fashion slider**: Auto-advancing 4-slide image carousel with prev/next controls
- **Popular Categories grid**: 8 category cards linking to `/shop`
- **Featured Products grid**: 8 handpicked products
- **Vendor CTA section**: Full-width section targeting sellers with stats + testimonial
- **Customer Reviews**: 3-card testimonial block
- **Newsletter signup**: Email capture with 10% discount incentive

### Shop (`/shop`)
Full product listing with:
- Filter sidebar (category, vendor, price range, badge type)
- Sort controls (Newest, Price ASC/DESC, Best Rated, Most Reviewed)
- Grid / list view toggle
- 24 static products across 11 categories

### Vendor (`/vendor`)
Vendor acquisition funnel:
- Hero with key stats
- "How It Works" — 4-step process (Apply → Review → Setup → Sell)
- Perks/benefits section (6 feature cards)
- Vendor testimonials
- Vendor application form (name, email, brand, website, category, description) — currently client-side only (no backend submission)

### About (`/about`)
- Company story / timeline (2022–2026)
- Core values: Sustainability, Trust, Intentionality, Community
- Team profiles (4 members)

### Blog (`/blog`)
- 8+ articles with category filters (Fashion, Lifestyle, Wellness, Business, Sustainability, Tech)
- Featured article hero + article grid

### Other pages
- `/brands` — Brand directory
- `/categories` — Category browser
- `/contact` — Contact form
- `/advertise` — Advertising options
- `/partner-program` — Partnership info
- `/privacy`, `/terms`, `/disclaimer`, `/affiliate-disclosure` — Legal pages

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

Database: PostgreSQL. Migration `20260514203214_init` has been created.

---

## Authentication (In Progress)

The auth infrastructure is scaffolded but **not yet active**:

- `src/api/auth/register/route.ts` — POST handler using `bcryptjs` for password hashing and Prisma for user creation. Currently commented out.
- `src/lib/prisma.ts` — Prisma client singleton. Currently commented out pending `DATABASE_URL` configuration.
- The Header links to `/login` but no login page exists yet.

To activate: set `DATABASE_URL` in `.env`, uncomment `src/lib/prisma.ts`, and uncomment the register route.

---

## Current State

| Area | Status |
|---|---|
| UI / Frontend | Complete — all pages built with static/mock data |
| Product data | Static (hardcoded arrays in page files) |
| Database | Schema updated (Role enum + vendor fields), needs migration after DATABASE_URL is set |
| Authentication | API routes complete — register, vendor/register, login, logout, me |
| Route protection | Middleware guards /admin-dashboard and /vendor-dashboard |
| Vendor application | UI complete, no backend handler |
| Newsletter signup | UI complete, no backend handler |
| Login / Register pages | Not yet built (UI pages needed) |

---

## Auth API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | User signup |
| POST | `/api/auth/vendor/register` | Vendor signup (with company/shop fields) |
| POST | `/api/auth/login` | Login for all roles — returns JWT cookie + redirect path |
| POST | `/api/auth/logout` | Clears JWT cookie |
| GET | `/api/auth/me` | Returns current user from JWT cookie |

JWT is stored as an HTTP-only cookie named `token` (7-day expiry).
Login response includes a `redirect` field: `/admin-dashboard`, `/vendor-dashboard`, or `/`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — long random string (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

---

## Development Commands

```bash
npm run dev                        # start development server (localhost:3000)
npm run build                      # production build
npm run start                      # start production server
npm run lint                       # ESLint
npx prisma migrate dev --name ...  # run after setting DATABASE_URL
npx prisma generate                # regenerate Prisma client after schema changes
```

---

## Next Steps

1. Set `DATABASE_URL` + `JWT_SECRET` in `.env` and run `npx prisma migrate dev --name add_roles_vendor_fields`
2. Build `/login` page (shared, redirects by role)
3. Build `/vendor/login` and `/admin/login` pages (or one unified login)
4. Build `/register` page for users
5. Build vendor registration page using the extra fields
6. Connect product data to database (replace static arrays)
7. Wire vendor application form to a backend API route
8. Implement cart and checkout flow

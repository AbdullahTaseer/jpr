# Latter Day Shopping — Project Documentation

Multi-vendor e-commerce marketplace built with Next.js 16, Prisma 7, PostgreSQL (Supabase), and JWT authentication. 

---

## Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Auth | JWT via `jose` (HTTP-only cookie) |
| Email | Resend |
| Styling | Tailwind CSS |
| File Uploads | Local disk (`/public/uploads/`) |

### Key Next.js 16 breaking changes applied
- Middleware file is `src/proxy.ts`, export is `proxy` (not `middleware`)
- Prisma datasource URL lives in `prisma/prisma.config.ts`, not in `schema.prisma`
- `params` in route handlers is `Promise<{ id: string }>` — must be awaited

---

## Database Schema

```
User            — id, name, username, email, phone, password, role
                  companyName, ein, shopName, shopSlug, vendorStatus
                  isActive, createdAt, updatedAt

Product         — id, title, slug, description, shortDesc, price, comparePrice
                  sku, stock, images[], redirectUrl
                  vendorId → User, categoryId → Category, brandId → Brand
                  isFeatured, isNewArrival, isActive
                  clicks → ProductClick[]

Category        — id, name, slug, imageUrl, showOnHomepage
Brand           — id, name, slug, logoUrl, website, showOnHomepage
ProductClick    — id, productId → Product, source, clickedAt
```

### Enums
- `Role`: USER | VENDOR | ADMIN
- `VendorStatus`: PENDING | APPROVED | REJECTED

### Database commands
```bash
npx prisma db push          # sync schema to Supabase (use this, not migrate dev)
npx prisma generate         # regenerate client after schema changes
npm run seed                # create admin account
```

> `prisma migrate dev` does NOT work with Supabase session pooler (advisory lock issue). Always use `prisma db push`.

---

## Authentication

- JWT stored in HTTP-only cookie named `token`, 7-day expiry
- `src/lib/jwt.ts` — `signToken`, `verifyToken`
- `src/lib/auth-guard.ts` — `getAuthUser`, `requireAdmin`, `requireVendor`
- `src/proxy.ts` — Next.js 16 proxy (replaces middleware):
  - Blocks unauthenticated access to `/admin-dashboard` and `/vendor-dashboard`
  - Redirects logged-in ADMIN/VENDOR away from `/`, `/login`, `/register` to their dashboard
  - Wrong-role access redirects to the user's own dashboard

### Admin seed account
- Email: `admin@latterdayshopping.com`
- Password: `Admin@LDS2026!`

---

## API Routes

### Auth (`/api/auth/`)
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration, returns JWT cookie |
| POST | `/api/auth/vendor/register` | Vendor registration, sets PENDING + isActive=false, no JWT |
| POST | `/api/auth/login` | Login for all roles, checks vendor approval, returns JWT + redirect path |
| POST | `/api/auth/logout` | Clears JWT cookie |
| GET | `/api/auth/me` | Returns current user from JWT |

### Public
| Method | Route | Description |
|---|---|---|
| GET | `/api/categories` | All categories. `?homepage=true` filters to admin-approved only |
| GET | `/api/brands` | All brands. `?homepage=true` filters to admin-approved only |
| POST | `/api/products/[id]/click` | Track a product click (public) |
| POST | `/api/upload` | Upload image file → saves to `/public/uploads/`, returns URL (auth required) |

### Vendor (`/api/vendor/` — requires VENDOR role)
| Method | Route | Description |
|---|---|---|
| GET | `/api/vendor/dashboard` | Stats: clicks, products, avg CTR, 8-month chart, top products |
| GET/POST | `/api/vendor/products` | List own products / create product |
| GET/PUT/DELETE | `/api/vendor/products/[id]` | Get / update / delete own product |
| POST | `/api/vendor/products/import` | Bulk import products from JSON array (max 500) |
| POST | `/api/vendor/categories` | Propose a new category (`showOnHomepage: false` by default) |
| POST | `/api/vendor/brands` | Propose a new brand (`showOnHomepage: false` by default) |
| GET/PUT | `/api/vendor/profile` | Get / update vendor profile |
| PUT | `/api/vendor/profile/password` | Change password |

### Admin (`/api/admin/` — requires ADMIN role)
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform stats: vendors, products, clicks, pending count, 8-month chart |
| GET/POST | `/api/admin/products` | List all products (paginated, searchable) / create product (any vendor) |
| PATCH/DELETE | `/api/admin/products/[id]` | Toggle isActive/isFeatured/isNewArrival / delete product |
| PATCH | `/api/admin/products/[id]/flags` | Set isFeatured and/or isNewArrival |
| GET | `/api/admin/vendors` | List vendors with `?status=PENDING\|APPROVED\|REJECTED` filter |
| PATCH/DELETE | `/api/admin/vendors/[id]` | Approve / reject / suspend / delete vendor (sends email on approve/reject) |
| GET | `/api/admin/vendors/approved` | List approved vendors (for product assignment dropdown) |
| GET/POST | `/api/admin/categories` | List all categories / create category |
| PUT/DELETE | `/api/admin/categories/[id]` | Update (incl. `showOnHomepage`) / delete category |
| GET/POST | `/api/admin/brands` | List all brands / create brand |
| PUT/DELETE | `/api/admin/brands/[id]` | Update (incl. `showOnHomepage`) / delete brand |

---

## Business Rules

1. **Vendor approval flow** — vendor registers as `PENDING` + `isActive=false`. Admin approves or rejects from the dashboard. Vendor receives a branded HTML email via Resend. Vendor can only log in once `APPROVED`.

2. **Featured / New Arrival** — `isFeatured` and `isNewArrival` are stripped from all vendor API routes. Only admin can set them via `PATCH /api/admin/products/[id]` or via the admin products table toggles.

3. **Homepage categories / brands** — `showOnHomepage` defaults to `false`. Only admin can flip it. Public homepage should fetch `/api/categories?homepage=true` and `/api/brands?homepage=true`.

4. **Vendor category/brand creation** — vendors can propose new categories and brands. They are created with `showOnHomepage: false`. Admin decides whether to surface them on the homepage.

5. **Product images** — stored as a `String[]` of URLs. First URL is the thumbnail. Vendors upload via drag-and-drop or file picker; files are saved to `/public/uploads/`.

6. **Product ownership** — vendor API routes enforce `vendorId = req.user.userId`. Vendors cannot read, edit, or delete another vendor's products.

7. **CSV import** — client-side CSV parse → JSON array → `POST /api/vendor/products/import`. Max 500 rows per import, duplicate slugs are skipped.

---

## Pages

### Public
| Route | Description |
|---|---|
| `/` | Homepage |
| `/login` | Single login page for all roles — redirects to correct dashboard on success |
| `/register` | User registration |
| `/vendor/register` | Vendor registration with full business fields + success screen |
| `/shop` | Product listing |
| `/categories`, `/brands`, `/blog` | Public listing pages |
| `/about`, `/contact`, `/privacy`, `/terms`, etc. | Static content pages |

### Vendor Dashboard (`/vendor-dashboard/`)
| Route | Description |
|---|---|
| `/vendor-dashboard` | Dashboard — live stats, referral chart, click analytics table |
| `/vendor-dashboard/products` | Product table with status toggle, edit, delete |
| `/vendor-dashboard/products/create` | Add product form with image upload |
| `/vendor-dashboard/products/[id]/edit` | Edit existing product |
| `/vendor-dashboard/import` | CSV bulk import with format guide |
| `/vendor-dashboard/categories` | Browse categories + propose new ones |
| `/vendor-dashboard/brands` | Browse brands + propose new ones |
| `/vendor-dashboard/profile` | Edit profile and change password |

### Admin Dashboard (`/admin-dashboard/`)
| Route | Description |
|---|---|
| `/admin-dashboard` | Platform overview — real stats + pending vendor alert |
| `/admin-dashboard/vendors` | Vendor management: approve / reject / suspend / delete |
| `/admin-dashboard/products` | All products — toggle active/featured/new arrival, delete, search, paginate |
| `/admin-dashboard/products/create` | Create product (assign to any vendor, set featured/new arrival) |
| `/admin-dashboard/categories` | Full category CRUD + homepage toggle |
| `/admin-dashboard/brands` | Full brand CRUD + homepage toggle |
| `/admin-dashboard/blogs` | Blog manager (UI built) |
| `/admin-dashboard/site-settings` | Site settings form (UI built) |
| `/admin-dashboard/content/*` | Content page editors (UI built) |
| `/admin-dashboard/sliders` | Slider manager (UI built) |
| `/admin-dashboard/teams` | Team manager (UI built) |
| `/admin-dashboard/testimonials` | Testimonials manager (UI built) |
| `/admin-dashboard/reports` | Reports panel (UI built) |
| `/admin-dashboard/inquiries` | Inquiries table (UI built) |
| `/admin-dashboard/newsletters` | Newsletter subscribers (UI built) |

---

## Components

### Dashboard (shared vendor + admin)
| Component | Description |
|---|---|
| `DashboardSidebar` | Fetches `/api/auth/me`, shows user info, real logout |
| `StatsCard` | Metric card with label, value, change %, icon |
| `ReferralBarChart` | SVG bar chart, accepts `data` + `loading` props |
| `ClickAnalyticsTable` | Top products by click with CTR |
| `ProductForm` | Create/edit product form. `isAdmin` prop enables vendor dropdown + featured/new arrival toggles |
| `ProductsTable` | Vendor product list with status toggle, edit, delete |
| `CategoryManager` | Three modes: `readonly` (view), `vendorMode` (create only), admin default (full CRUD + homepage toggle) |
| `BrandManager` | Same three modes as CategoryManager |
| `MultiImageUpload` | Drag-and-drop + URL paste image manager. First image = thumbnail. "Set main" to reorder |
| `ImageUploadField` | Single image upload field with preview — used in category/brand modals |
| `ProfileSettings` | Vendor profile + password change form |
| `RichTextEditor` | Rich text editor for product descriptions |

### Admin-specific
| Component | Description |
|---|---|
| `AdminSidebar` | Admin navigation sidebar |
| `VendorsTable` | Live vendor list with status tabs, approve/reject/suspend/delete actions |
| `AdminProductsTable` | All-platform products with search, pagination, inline flag toggles |

---

## Email Templates (Resend)

Both emails use table-based HTML (email-client safe, no flexbox):

- **Approval** — green accent bar, ✓ circle centered via `line-height`, "What's next" steps, CTA to login
- **Rejection** — red accent bar, ✗ circle, re-apply tips, CTA to vendor register

Sender: configured via `EMAIL_FROM` env var. Domain must be verified in Resend dashboard before emails deliver.

---

## File Upload

- `POST /api/upload` — accepts multipart form data, validates type (JPEG/PNG/WEBP/GIF) and size (max 10MB)
- Saves to `/public/uploads/[timestamp]-[random].[ext]`
- Returns `{ url: "/uploads/filename.jpg" }`
- Requires any authenticated session (USER, VENDOR, or ADMIN)

---

## Environment Variables

```env
DATABASE_URL        # Supabase session pooler URL (use pooler.supabase.com:5432, not direct)
JWT_SECRET          # 32-byte hex random string
RESEND_API_KEY      # From resend.com — domain must be verified to send
EMAIL_FROM          # e.g. "Latter Day Shopping <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL # e.g. http://localhost:3000 (used in email links)
```

> The DATABASE_URL password may contain `+` signs — these must be URL-encoded as `%2B`.

---

## What Still Needs Building

- Public homepage — category grid, brand grid, featured products (use `?homepage=true` filter)
- Public product listing and detail pages
- User account dashboard (`/user-dashboard`)
- Shopping cart and checkout flow
- Order management for vendors and admin
- Admin orders and revenue reporting
- Search functionality
- Vendor store public page (`/store/[shopSlug]`)

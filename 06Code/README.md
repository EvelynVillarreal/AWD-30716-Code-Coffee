# Artisan Shop — Full-Stack Web Application

**Project:** AWD-30716 — Code & Coffee  
**Architecture:** Microservices (Frontend + CRUD Service + Business Rules Service)  
**Language:** TypeScript

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│   Browser (Next.js Frontend — Port 3017)            │
│   Dark-mode artisan UI, React Server Components     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
┌──────────────────────▼──────────────────────────────┐
│   Business Rules Service (Express — Port 5017)      │
│   Auth (JWT), Order Logic, Stock Validation,        │
│   Shipping Calc, Reports, Status Transitions        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
┌──────────────────────▼──────────────────────────────┐
│   CRUD Service (Express + Prisma — Port 4017)       │
│   Pure data access layer for all 8 entities         │
└──────────────────────┬──────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────┐
│   PostgreSQL Database (Supabase)                    │
│   8 tables from UML Class Diagram                   │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
06Code/
├── crud-service/          # Data access layer
│   ├── src/
│   │   ├── modules/       # user, category, product, order, ...
│   │   └── shared/        # prisma client, errors, middleware
│   └── prisma/
│       └── schema.prisma  # Full DB schema
├── business-service/      # Business logic layer
│   └── src/
│       ├── modules/       # auth, order, product, report
│       └── shared/        # CRUD client, JWT middleware, errors
└── frontend/              # Next.js 14 App Router
    └── src/
        ├── app/           # Pages (public, auth, customer, admin)
        ├── components/    # UI atoms + domain components
        ├── services/      # API client
        ├── types/         # Shared TypeScript interfaces
        └── styles/        # Design system CSS
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. CRUD Service
```bash
cd 06Code/crud-service
npm install
npx prisma db push         # Syncs PostgreSQL DB
npm run dev                # Runs on http://localhost:4017
```

### 2. Business Rules Service
```bash
cd 06Code/business-service
npm install
npm run dev                # Runs on http://localhost:5017
```

### 3. Frontend
```bash
cd 06Code/frontend
npm install
npm run dev                # Runs on http://localhost:3017
```

---

## Deployment (AWS Elastic Beanstalk)

### Live Environments

- **Frontend**: https://d16t94mhejiolk.cloudfront.net
- **Business Service**: https://d10yexkiobm8fr.cloudfront.net
- **CRUD Service**: https://dhu121lf5djay.cloudfront.net

### Deployment Process

Deployments are handled via the Elastic Beanstalk CLI (`eb cli`). The `eb deploy` command bundles and deploys the most recent **git commit**, so always ensure your changes are committed locally before deploying.

### 1. Deploying the CRUD Service
```bash
cd 06Code/crud-service
git commit -am "Your update message"
eb deploy
```

### 2. Deploying the Business Service
```bash
cd 06Code/business-service
git commit -am "Your update message"
eb deploy
```

### 3. Deploying the Frontend (Next.js)
```bash
cd 06Code/frontend
git commit -am "Your update message"
eb deploy
```

> **Note:** Wait for the terminal to output `INFO: Environment update completed successfully.` (usually takes 2-4 minutes). The Next.js build process is executed automatically on the AWS server during deployment.

---

## Entities (from UML Class Diagram)

| Entity | Description |
|--------|-------------|
| `User` | Customers and administrators |
| `Category` | Product categories |
| `Product` | Artisan products with stock and customization flag |
| `ProductPhoto` | Product image gallery |
| `Order` | Customer orders with contact and shipping info |
| `OrderDetail` | Line items per order |
| `OrderStatusHistory` | Full audit trail of status changes |
| `ShippingConfig` | Province-to-province shipping costs |

---

## API Reference

### CRUD Service (Local: `http://localhost:4017` | Prod: `https://dhu121lf5djay.cloudfront.net`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET/POST | `/api/user` | List / create users |
| GET/PUT/DELETE | `/api/user/:id` | Read / update / delete user |
| GET | `/api/user/email/:email` | Find user by email |
| GET/POST | `/api/product` | List / create products |
| PATCH | `/api/product/:id/stock` | Update stock |
| GET/POST | `/api/order` | List / create orders |
| PATCH | `/api/order/:id/status` | Update order status |
| GET/POST | `/api/shipping-config` | List / create shipping rules |
| GET | `/api/shipping-config/lookup` | Get cost by province pair |

### Business Service (Local: `http://localhost:5017` | Prod: `https://d10yexkiobm8fr.cloudfront.net`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/profile` | User | Get current user |
| GET | `/api/product` | — | Browse products |
| POST | `/api/product` | Admin | Create product |
| POST | `/api/order` | — | Place order |
| GET | `/api/order/my-orders` | User | My order history |
| PATCH | `/api/order/:id/status` | Admin | Change order status |
| PATCH | `/api/order/:id/approve-customized` | Admin | Approve custom order |
| GET | `/api/report/sales` | Admin | Sales report |
| GET/POST/PUT/DELETE | `/api/shipping` | Admin | Manage shipping configs |
| GET | `/api/shipping/calculate` | — | Calculate shipping cost |

---

## Design System

Coffee-inspired dark theme with warm browns, cream, and honey tones.  
CSS variables in `frontend/src/styles/globals.css`.

**Fonts:** Playfair Display (headings) + Inter (body)  
**Theme:** Dark mode, glassmorphism cards, micro-animations

---

## Clean Code Principles Applied

- **SRP**: Each class/function has exactly one responsibility
- **DRY**: Shared errors, middleware, and types are reused across modules
- **SOLID**: Repositories are interfaces behind controllers; errors extend base classes
- **Early returns**: Controllers use guard clauses before main logic
- **Naming**: All symbols in English, descriptive and intent-revealing
- **Error separation**: `try/catch` blocks isolated from business logic

---

## Programming Paradigms Applied

- **Non-blocking / Asynchronous Data Flow**: Extensive use of `async`/`await` and Promises in backend controllers and frontend API services to prevent blocking the main thread during I/O operations.
- **Lambda Expressions**: Widespread use of Arrow Functions (`=>`) for concise anonymous functions, callbacks, and maintaining lexical `this` scope (e.g., Axios interceptors).
- **Functional Programming**: Declarative data transformations using higher-order array methods like `.map()`, `.filter()`, and `.reduce()` (JavaScript's equivalent to the Streams API).
- **Reactive Programming**: The frontend uses React's reactive state management (`useState`, `useEffect`) and Context API to automatically trigger UI updates when underlying data changes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Vanilla CSS |
| Business Service | Express 4, TypeScript, Axios, JWT, bcryptjs |
| CRUD Service | Express 4, TypeScript, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Language | TypeScript (strict) |

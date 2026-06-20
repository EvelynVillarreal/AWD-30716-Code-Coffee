# Artisan Shop — Full-Stack Web Application

**Project:** AWD-30716 — Code & Coffee  
**Architecture:** Microservices (Frontend + CRUD Service + Business Rules Service)  
**Language:** TypeScript (strict mode, `/codigoIngles`)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│   Browser (Next.js Frontend — Port 3000)            │
│   Dark-mode artisan UI, React Server Components     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
┌──────────────────────▼──────────────────────────────┐
│   Business Rules Service (Express — Port 3002)      │
│   Auth (JWT), Order Logic, Stock Validation,        │
│   Shipping Calc, Reports, Status Transitions        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
┌──────────────────────▼──────────────────────────────┐
│   CRUD Service (Express + Prisma — Port 3001)       │
│   Pure data access layer for all 8 entities         │
└──────────────────────┬──────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────┐
│   SQLite Database (dev.db)                          │
│   8 tables from UML Class Diagram                   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. CRUD Service
```bash
cd 06Code/crud-service
npm install
npx prisma migrate dev     # Creates SQLite DB
npm run dev                # Runs on http://localhost:3001
```

### 2. Business Rules Service
```bash
cd 06Code/business-service
npm install
npm run dev                # Runs on http://localhost:3002
```

### 3. Frontend
```bash
cd 06Code/frontend
npm install
npm run dev                # Runs on http://localhost:3000
```

---

## 📋 Entities (from UML Class Diagram)

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

## 🔌 API Reference

### CRUD Service (`http://localhost:3001`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET/POST | `/api/users` | List / create users |
| GET/PUT/DELETE | `/api/users/:id` | Read / update / delete user |
| GET | `/api/users/email/:email` | Find user by email |
| GET/POST | `/api/products` | List / create products |
| PATCH | `/api/products/:id/stock` | Update stock |
| GET/POST | `/api/orders` | List / create orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET/POST | `/api/shipping-configs` | List / create shipping rules |
| GET | `/api/shipping-configs/lookup` | Get cost by province pair |

### Business Service (`http://localhost:3002`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/profile` | 🔐 User | Get current user |
| GET | `/api/products` | — | Browse products |
| POST | `/api/products` | 🔐 Admin | Create product |
| POST | `/api/orders` | — | Place order |
| GET | `/api/orders/my-orders` | 🔐 User | My order history |
| PATCH | `/api/orders/:id/status` | 🔐 Admin | Change order status |
| PATCH | `/api/orders/:id/approve-customized` | 🔐 Admin | Approve custom order |
| GET | `/api/reports/sales` | 🔐 Admin | Sales report |

---

## 🎨 Design System

Coffee-inspired dark theme with warm browns, cream, and honey tones.  
CSS variables in `frontend/src/styles/globals.css`.

**Fonts:** Playfair Display (headings) + Inter (body)  
**Theme:** Dark mode, glassmorphism cards, micro-animations

---

## ✅ Clean Code Principles Applied

- **SRP**: Each class/function has exactly one responsibility
- **DRY**: Shared errors, middleware, and types are reused across modules
- **SOLID**: Repositories are interfaces behind controllers; errors extend base classes
- **Early returns**: Controllers use guard clauses before main logic
- **Naming**: All symbols in English, descriptive and intent-revealing
- **Error separation**: `try/catch` blocks isolated from business logic

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Vanilla CSS |
| Business Service | Express 4, TypeScript, Axios, JWT, bcryptjs |
| CRUD Service | Express 4, TypeScript, Prisma ORM |
| Database | SQLite (dev) |
| Language | TypeScript (strict) |

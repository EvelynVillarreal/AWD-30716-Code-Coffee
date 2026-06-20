# Artisan Shop — URI Design Document

**Project:** AWD-30716 · Code & Coffee  
**Version:** 1.0  
**Date:** 2026-06-20  

---

## 1. Architecture & Base URLs

The system exposes two independent REST APIs and one web frontend.

| Service | Base URL | Purpose |
|---------|----------|---------|
| **CRUD Service** | `http://localhost:4017` | Raw data access — all database operations |
| **Business Service** | `http://localhost:5017` | Business logic — auth, rules, orchestration |
| **Frontend** | `http://localhost:3017` | Web UI — Next.js App Router pages |

> [!IMPORTANT]
> The **Frontend** only communicates with the **Business Service**.  
> The **Business Service** is the only consumer of the **CRUD Service**.  
> External clients must **never** call the CRUD Service directly.

---

## 2. URI Design Conventions

| Convention | Rule | Example |
|-----------|------|---------|
| **Resource names** | Lowercase, plural, kebab-case | `/api/order-details` |
| **Path parameters** | `:paramName` camelCase | `/:id`, `/:userId` |
| **Query parameters** | camelCase | `?categoryId=2`, `?startDate=` |
| **Versioning** | Prefix `/api/` (version implicit v1) | `/api/products` |
| **Sub-resources** | Nested path with parent id | `/api/order-details/order/:orderId` |
| **Actions** | Specific sub-path for non-CRUD actions | `PATCH /api/orders/:id/status` |
| **Lookup endpoints** | Named sub-path before `:id` | `/api/users/email/:email` |

### HTTP Method → CRUD Mapping

| Method | Semantic | Idempotent |
|--------|----------|-----------|
| `GET` | Read — no side effects | ✅ Yes |
| `POST` | Create — new resource | ❌ No |
| `PUT` | Full update — replace resource | ✅ Yes |
| `PATCH` | Partial update — single field | ✅ Yes |
| `DELETE` | Remove resource | ✅ Yes |

---

## 3. CRUD Service — `http://localhost:3001`

> **Internal use only.** Called exclusively by the Business Service.

### 3.0 System

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 1 | `GET` | `/health` | Service health check |

**Response `200`**
```json
{ "status": "ok", "service": "crud-service", "port": "3001" }
```

---

### 3.1 Users — `/api/users`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 2 | `GET` | `/api/users` | List all users |
| 3 | `GET` | `/api/users/:id` | Get user by ID |
| 4 | `GET` | `/api/users/email/:email` | Get user by email address |
| 5 | `POST` | `/api/users` | Create a new user |
| 6 | `PUT` | `/api/users/:id` | Update user (full) |
| 7 | `DELETE` | `/api/users/:id` | Delete user |

**`POST /api/users` — Request Body**
```json
{
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "phone": "string | null",
  "address": "string | null",
  "province": "string | null",
  "role": "customer | admin"
}
```

**`PUT /api/users/:id` — Request Body** *(all fields optional)*
```json
{
  "name": "string",
  "passwordHash": "string",
  "phone": "string",
  "address": "string",
  "province": "string",
  "role": "string"
}
```

**Standard Success Response**
```json
{ "success": true, "data": { /* User object */ } }
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | Successful read / update |
| `201` | User created |
| `404` | User not found |
| `409` | Email already in use |

---

### 3.2 Categories — `/api/categories`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 8 | `GET` | `/api/categories` | List all categories (sorted A-Z) |
| 9 | `GET` | `/api/categories/:id` | Get category by ID (includes products) |
| 10 | `POST` | `/api/categories` | Create category |
| 11 | `PUT` | `/api/categories/:id` | Update category name |
| 12 | `DELETE` | `/api/categories/:id` | Delete category |

**`POST /api/categories` — Request Body**
```json
{ "name": "string" }
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | OK |
| `201` | Created |
| `404` | Not found |
| `409` | Category name already exists |

---

### 3.3 Products — `/api/products`

| # | Method | URI | Query Params | Description |
|---|--------|-----|-------------|-------------|
| 13 | `GET` | `/api/products` | `?categoryId={int}` | List all products (optional category filter) |
| 14 | `GET` | `/api/products/:id` | — | Get product by ID (includes category + photos) |
| 15 | `POST` | `/api/products` | — | Create product |
| 16 | `PUT` | `/api/products/:id` | — | Update product (full) |
| 17 | `PATCH` | `/api/products/:id/stock` | — | Update stock quantity only |
| 18 | `DELETE` | `/api/products/:id` | — | Delete product |

**`POST /api/products` — Request Body**
```json
{
  "name": "string",
  "description": "string | null",
  "price": "number",
  "stock": "number",
  "status": "active | inactive",
  "allowsCustomization": "boolean",
  "categoryId": "number"
}
```

**`PATCH /api/products/:id/stock` — Request Body**
```json
{ "stock": "number" }
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | OK |
| `201` | Created |
| `404` | Product or category not found |

---

### 3.4 Product Photos — `/api/product-photos`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 19 | `GET` | `/api/product-photos/product/:productId` | Get all photos for a product (ordered) |
| 20 | `POST` | `/api/product-photos` | Add a photo to a product |
| 21 | `DELETE` | `/api/product-photos/:id` | Delete a photo |

**`POST /api/product-photos` — Request Body**
```json
{
  "productId": "number",
  "url": "string",
  "order": "number"
}
```

---

### 3.5 Orders — `/api/orders`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 22 | `GET` | `/api/orders` | List all orders (with details + history) |
| 23 | `GET` | `/api/orders/:id` | Get order by ID (full details) |
| 24 | `GET` | `/api/orders/reference/:reference` | Get order by reference number |
| 25 | `GET` | `/api/orders/user/:userId` | Get all orders for a user |
| 26 | `POST` | `/api/orders` | Create order record |
| 27 | `PATCH` | `/api/orders/:id/status` | Update order status field |
| 28 | `DELETE` | `/api/orders/:id` | Delete order |

**`POST /api/orders` — Request Body**
```json
{
  "referenceNumber": "string",
  "userId": "number | null",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "province": "string",
  "shippingCost": "number",
  "total": "number",
  "status": "pending | processing | shipped | delivered | cancelled",
  "isCustomized": "boolean"
}
```

**`PATCH /api/orders/:id/status` — Request Body**
```json
{ "status": "string" }
```

---

### 3.6 Order Details — `/api/order-details`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 29 | `GET` | `/api/order-details/order/:orderId` | Get all line items for an order |
| 30 | `POST` | `/api/order-details` | Add single line item |
| 31 | `POST` | `/api/order-details/bulk` | Add multiple line items at once |
| 32 | `DELETE` | `/api/order-details/:id` | Delete line item |

**`POST /api/order-details` — Request Body**
```json
{
  "orderId": "number",
  "productId": "number",
  "quantity": "number",
  "unitPrice": "number",
  "customizationDetails": "string | null"
}
```

**`POST /api/order-details/bulk` — Request Body**
```json
{
  "items": [
    {
      "orderId": "number",
      "productId": "number",
      "quantity": "number",
      "unitPrice": "number",
      "customizationDetails": "string | null"
    }
  ]
}
```

---

### 3.7 Order Status History — `/api/order-status-history`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 33 | `GET` | `/api/order-status-history/order/:orderId` | Get full status history for an order |
| 34 | `POST` | `/api/order-status-history` | Record a new status event |

**`POST /api/order-status-history` — Request Body**
```json
{
  "orderId": "number",
  "status": "string"
}
```

---

### 3.8 Shipping Configurations — `/api/shipping-configs`

| # | Method | URI | Query Params | Description |
|---|--------|-----|-------------|-------------|
| 35 | `GET` | `/api/shipping-configs` | — | List all shipping rules |
| 36 | `GET` | `/api/shipping-configs/lookup` | `?baseProvince=&destinationProvince=` | Find cost by province pair |
| 37 | `GET` | `/api/shipping-configs/:id` | — | Get shipping config by ID |
| 38 | `POST` | `/api/shipping-configs` | — | Create shipping rule |
| 39 | `PUT` | `/api/shipping-configs/:id` | — | Update shipping rule |
| 40 | `DELETE` | `/api/shipping-configs/:id` | — | Delete shipping rule |

**`GET /api/shipping-configs/lookup` — Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `baseProvince` | `string` | ✅ | Origin province |
| `destinationProvince` | `string` | ✅ | Destination province |

**`POST /api/shipping-configs` — Request Body**
```json
{
  "baseProvince": "string",
  "destinationProvince": "string",
  "additionalCost": "number"
}
```

---

## 4. Business Service — `http://localhost:3002`

> **Public API.** Called by the Frontend and external clients.

### 4.0 System

| # | Method | URI | Auth | Description |
|---|--------|-----|------|-------------|
| 41 | `GET` | `/health` | — | Service health check |

---

### 4.1 Authentication — `/api/auth`

| # | Method | URI | Auth | Description |
|---|--------|-----|------|-------------|
| 42 | `POST` | `/api/auth/register` | — | Register a new customer account |
| 43 | `POST` | `/api/auth/login` | — | Authenticate and receive JWT |
| 44 | `GET` | `/api/auth/profile` | 🔐 User | Get current authenticated user's data |

**`POST /api/auth/register` — Request Body**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string | null",
  "address": "string | null",
  "province": "string | null"
}
```

**`POST /api/auth/login` — Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**`POST /api/auth/register` & `POST /api/auth/login` — Response `200/201`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**`GET /api/auth/profile` — Authorization Header**
```
Authorization: Bearer <jwt_token>
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | Login successful |
| `201` | Registration successful |
| `401` | Invalid credentials or missing token |
| `409` | Email already registered |

---

### 4.2 Products — `/api/products`

| # | Method | URI | Auth | Query Params | Description |
|---|--------|-----|------|-------------|-------------|
| 45 | `GET` | `/api/products/categories` | — | — | List all product categories |
| 46 | `GET` | `/api/products` | — | `?categoryId={int}` | Browse all products |
| 47 | `GET` | `/api/products/:id` | — | — | Get single product details |
| 48 | `POST` | `/api/products` | 🔐 Admin | — | Create a new product |
| 49 | `PUT` | `/api/products/:id` | 🔐 Admin | — | Update product data |
| 50 | `PATCH` | `/api/products/:id/stock` | 🔐 Admin | — | Update stock level |
| 51 | `DELETE` | `/api/products/:id` | 🔐 Admin | — | Delete product |

**`GET /api/products` — Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | `integer` | ❌ | Filter products by category |

**`POST /api/products` — Request Body**
```json
{
  "name": "string",
  "description": "string | null",
  "price": "number",
  "stock": "number",
  "status": "active | inactive",
  "allowsCustomization": "boolean",
  "categoryId": "number"
}
```

**`PATCH /api/products/:id/stock` — Request Body**
```json
{ "stock": "number" }
```

---

### 4.3 Orders — `/api/orders`

| # | Method | URI | Auth | Description |
|---|--------|-----|------|-------------|
| 52 | `POST` | `/api/orders` | — | **Place order** (validates stock, calculates total, decrements stock) |
| 53 | `GET` | `/api/orders/my-orders` | 🔐 User | Get orders of the authenticated customer |
| 54 | `GET` | `/api/orders/reference/:reference` | — | Track order by reference number |
| 55 | `GET` | `/api/orders` | 🔐 Admin | List all orders |
| 56 | `PATCH` | `/api/orders/:id/status` | 🔐 Admin | **Change order status** (state machine enforced) |
| 57 | `PATCH` | `/api/orders/:id/approve-customized` | 🔐 Admin | **Approve a pending customized order** |

**`POST /api/orders` — Request Body**
```json
{
  "contactName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "province": "string",
  "items": [
    {
      "productId": "number",
      "quantity": "number",
      "customizationDetails": "string | null"
    }
  ]
}
```

> [!NOTE]
> If the request includes a valid JWT, the order is linked to the authenticated user automatically via `userId`. Guest orders are also supported (no token required).

**`PATCH /api/orders/:id/status` — Request Body**
```json
{ "status": "processing | shipped | delivered | cancelled" }
```

**Valid Status Transitions (State Machine)**

```
pending ──→ processing ──→ shipped ──→ delivered
   │              │
   └──────────────┴──→ cancelled
```

| Current Status | Allowed Next States |
|---------------|-------------------|
| `pending` | `processing`, `cancelled` |
| `processing` | `shipped`, `cancelled` |
| `shipped` | `delivered` |
| `delivered` | *(terminal — no transitions)* |
| `cancelled` | *(terminal — no transitions)* |

**`POST /api/orders` — Response `201`**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "referenceNumber": "ORD-LM3K2X-AFBC",
    "total": 125.50,
    "shippingCost": 5.00,
    "status": "pending",
    "isCustomized": false,
    "createdAt": "2026-06-20T21:30:00.000Z"
  }
}
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `201` | Order placed successfully |
| `401` | Token missing for protected route |
| `403` | Insufficient role (admin required) |
| `404` | Order or product not found |
| `409` | Insufficient stock for one or more items |
| `422` | Invalid status transition or order type mismatch |

---

### 4.4 Reports — `/api/reports`

| # | Method | URI | Auth | Query Params | Description |
|---|--------|-----|------|-------------|-------------|
| 58 | `GET` | `/api/reports/sales` | 🔐 Admin | `?startDate=&endDate=` | Sales report with revenue & order stats |

**`GET /api/reports/sales` — Query Parameters**

| Parameter | Type | Required | Format | Description |
|-----------|------|----------|--------|-------------|
| `startDate` | `string` | ❌ | ISO 8601 | Filter start date (default: epoch) |
| `endDate` | `string` | ❌ | ISO 8601 | Filter end date (default: now) |

**Example:** `GET /api/reports/sales?startDate=2026-01-01&endDate=2026-06-30`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-06-30T00:00:00.000Z"
    },
    "summary": {
      "totalRevenue": 4850.00,
      "totalOrders": 38,
      "averageOrderValue": 127.63,
      "statusBreakdown": {
        "pending": 5,
        "processing": 8,
        "shipped": 12,
        "delivered": 10,
        "cancelled": 3
      }
    },
    "orders": [ /* full order list */ ]
  }
}
```

---

## 5. Frontend Route Map — `http://localhost:3000`

### Public Routes (No authentication required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section + feature highlights + CTA |
| `/products` | Product Listing | Browse with category filter |
| `/products/:id` | Product Detail | Full product page + add to cart |
| `/gallery` | Photo Gallery | Artisan photo showcase |
| `/cart` | Shopping Cart | Review cart items |
| `/checkout` | Checkout | Contact info + order placement |
| `/orders/reference/:ref` | Order Tracking | Track by reference number |

### Authentication Routes

| Route | Page | Redirects After |
|-------|------|----------------|
| `/login` | Login Form | `/` or `/admin/dashboard` (if admin) |
| `/register` | Register Form | `/` |

### Customer Routes (Requires login)

| Route | Page | Description |
|-------|------|-------------|
| `/orders` | My Orders | Customer order history |
| `/profile` | My Profile | Update contact info |

### Admin Routes (Requires `role: admin`)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/dashboard` | Dashboard | KPIs, recent orders, low-stock alerts |
| `/admin/products` | Manage Products | CRUD + stock management |
| `/admin/orders` | Manage Orders | View & change all order statuses |
| `/admin/shipping` | Shipping Config | Province-based shipping rules |
| `/admin/reports` | Sales Reports | Revenue charts with date filters |

---

## 6. Standard Response Envelope

All API responses from both services follow this consistent shape:

**Success**
```json
{
  "success": true,
  "data": { /* resource or array */ }
}
```

**Error**
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## 7. Authentication Reference

**Method:** Bearer Token (JWT)  
**Header:** `Authorization: Bearer <token>`  
**Expiry:** 7 days  
**Payload structure:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "customer | admin"
}
```

### Guard Levels

| Symbol | Level | Condition |
|--------|-------|-----------|
| — | Public | No token required |
| 🔐 User | Authenticated | Valid JWT, any role |
| 🔐 Admin | Admin only | Valid JWT with `role: admin` |

---

## 8. URI Inventory Summary

| Service | Total Endpoints |
|---------|----------------|
| CRUD Service | 40 |
| Business Service | 17 |
| Frontend Routes | 15 |
| **Total** | **72** |

### CRUD Service by Resource

| Resource | GET | POST | PUT | PATCH | DELETE | Total |
|----------|-----|------|-----|-------|--------|-------|
| `/health` | 1 | — | — | — | — | 1 |
| `/api/users` | 3 | 1 | 1 | — | 1 | 6 |
| `/api/categories` | 2 | 1 | 1 | — | 1 | 5 |
| `/api/products` | 2 | 1 | 1 | 1 | 1 | 6 |
| `/api/product-photos` | 1 | 1 | — | — | 1 | 3 |
| `/api/orders` | 4 | 1 | — | 1 | 1 | 7 |
| `/api/order-details` | 1 | 2 | — | — | 1 | 4 |
| `/api/order-status-history` | 1 | 1 | — | — | — | 2 |
| `/api/shipping-configs` | 3 | 1 | 1 | — | 1 | 6 |
| **Total** | **18** | **9** | **4** | **2** | **6** | **40** |

### Business Service by Resource

| Resource | GET | POST | PATCH | Total |
|----------|-----|------|-------|-------|
| `/health` | 1 | — | — | 1 |
| `/api/auth` | 1 | 2 | — | 3 |
| `/api/products` | 3 | 1 | 1 | 5 + 1 DELETE = **6** |
| `/api/orders` | 3 | 1 | 2 | 6 |
| `/api/reports` | 1 | — | — | 1 |
| **Total** | **9** | **4** | **3** | **17** |

# Artisan Shop — URI Design Document

**Project:** AWD-30716 · Code & Coffee  
**Version:** 2.0  
**Date:** 2026-06-22  
**Status:** Production (AWS Elastic Beanstalk)

---

## 1. Architecture & Base URLs

### Local Development

| Service | Base URL | Purpose |
|---------|----------|---------| 
| **CRUD Service** | `http://localhost:4017` | Raw data access — all database operations |
| **Business Service** | `http://localhost:5017` | Business logic — auth, rules, orchestration |
| **Frontend** | `http://localhost:3017` | Web UI — Next.js App Router pages |

### Production (AWS — us-east-1)

| Service | URL | Status |
|---------|-----|--------|
| **CRUD Service** | `http://artisan-crud-env.eba-tmhpspx3.us-east-1.elasticbeanstalk.com` | Green |
| **Business Service** | `http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com` | Green |
| **Frontend** | `http://artisan-frontend-env.eba-p9ieurrh.us-east-1.elasticbeanstalk.com` | Ready |
| **Database** | Supabase PostgreSQL — `aws-1-us-west-2.pooler.supabase.com:6543` | Connected |

> [!IMPORTANT]
> The **Frontend** only communicates with the **Business Service**.  
> The **Business Service** is the only consumer of the **CRUD Service**.  
> External clients must **never** call the CRUD Service directly.

---

## 2. URI Design Conventions

| Convention | Rule | Example |
|-----------|------|---------| 
| **Resource names** | Lowercase, plural, kebab-case | `/api/order-detail` |
| **Path parameters** | `:paramName` camelCase | `/:id`, `/:userId` |
| **Query parameters** | camelCase | `?categoryId=2`, `?startDate=` |
| **Versioning** | Prefix `/api/` (version implicit v1) | `/api/product` |
| **Sub-resources** | Nested path with parent id | `/api/order-detail/order/:orderId` |
| **Actions** | Specific sub-path for non-CRUD actions | `PATCH /api/order/:id/status` |
| **Lookup endpoints** | Named sub-path before `:id` | `/api/user/email/:email` |

### HTTP Method → CRUD Mapping

| Method | Semantic | Idempotent |
|--------|----------|-----------|
| `GET` | Read — no side effects | Yes |
| `POST` | Create — new resource | No |
| `PUT` | Full update — replace resource | Yes |
| `PATCH` | Partial update — single field | Yes |
| `DELETE` | Remove resource | Yes |

---

## 3. CRUD Service

> **Internal use only.** Called exclusively by the Business Service.

**Local:** `http://localhost:4017`  
**Production:** `http://artisan-crud-env.eba-tmhpspx3.us-east-1.elasticbeanstalk.com`

### 3.0 System

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 1 | `GET` | `/health` | Service health check |

**Response `200`**
```json
{ "status": "ok", "service": "crud-service", "port": "8080" }
```

---

### 3.1 Users — `/api/user`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 2 | `GET` | `/api/user` | List all users |
| 3 | `GET` | `/api/user/:id` | Get user by ID |
| 4 | `GET` | `/api/user/email/:email` | Get user by email address |
| 5 | `POST` | `/api/user` | Create a new user |
| 6 | `PUT` | `/api/user/:id` | Update user (full) |
| 7 | `DELETE` | `/api/user/:id` | Delete user |

**`POST /api/user` — Request Body**
```json
{
  "name": "María García",
  "email": "maria.garcia@email.com",
  "passwordHash": "$2b$10$X9vQ1kLmNpR3sT5uVwXyZeAbCdEfGhIjKlMnOpQrStUvWxYz01234",
  "phone": "0987654321",
  "address": "Av. Amazonas N12-34",
  "province": "Pichincha",
  "role": "customer"
}
```

**`POST /api/user` — Response `201`**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "María García",
    "email": "maria.garcia@email.com",
    "phone": "0987654321",
    "address": "Av. Amazonas N12-34",
    "province": "Pichincha",
    "role": "customer"
  }
}
```

**`PUT /api/user/:id` — Request Body**
```json
{
  "name": "María García López",
  "phone": "0991234567",
  "address": "Calle Sucre 45-B",
  "province": "Guayas"
}
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | Successful read / update |
| `201` | User created |
| `404` | User not found |
| `409` | Email already in use |

---

### 3.2 Categories — `/api/category`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 8 | `GET` | `/api/category` | List all categories (sorted A-Z) |
| 9 | `GET` | `/api/category/:id` | Get category by ID (includes products) |
| 10 | `POST` | `/api/category` | Create category |
| 11 | `PUT` | `/api/category/:id` | Update category name |
| 12 | `DELETE` | `/api/category/:id` | Delete category |

**`POST /api/category` — Request Body**
```json
{ "name": "Tejidos Artesanales" }
```

**`POST /api/category` — Response `201`**
```json
{
  "success": true,
  "data": { "id": 4, "name": "Tejidos Artesanales" }
}
```

**`GET /api/category` — Response `200`**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Cerámica" },
    { "id": 2, "name": "Joyería" },
    { "id": 3, "name": "Textiles" },
    { "id": 4, "name": "Tejidos Artesanales" }
  ]
}
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | OK |
| `201` | Created |
| `404` | Not found |
| `409` | Category name already exists |

---

### 3.3 Products — `/api/product`

| # | Method | URI | Query Params | Description |
|---|--------|-----|-------------|-------------|
| 13 | `GET` | `/api/product` | `?categoryId={int}` | List all products (optional category filter) |
| 14 | `GET` | `/api/product/:id` | — | Get product by ID (includes category + photos) |
| 15 | `POST` | `/api/product` | — | Create product |
| 16 | `PUT` | `/api/product/:id` | — | Update product (full) |
| 17 | `PATCH` | `/api/product/:id/stock` | — | Update stock quantity only |
| 18 | `DELETE` | `/api/product/:id` | — | Delete product |

**`POST /api/product` — Request Body**
```json
{
  "name": "Vasija de Barro Pintada",
  "description": "Vasija artesanal de barro cocido con diseños precolombinos pintados a mano.",
  "price": 45.00,
  "stock": 12,
  "status": "active",
  "allowsCustomization": true,
  "categoryId": 1
}
```

**`POST /api/product` — Response `201`**
```json
{
  "success": true,
  "data": {
    "id": 8,
    "name": "Vasija de Barro Pintada",
    "description": "Vasija artesanal de barro cocido con diseños precolombinos pintados a mano.",
    "price": 45.00,
    "stock": 12,
    "status": "active",
    "allowsCustomization": true,
    "categoryId": 1
  }
}
```

**`PATCH /api/product/:id/stock` — Request Body**
```json
{ "stock": 8 }
```

**`GET /api/product/:id` — Response `200`**
```json
{
  "success": true,
  "data": {
    "id": 8,
    "name": "Vasija de Barro Pintada",
    "price": 45.00,
    "stock": 8,
    "status": "active",
    "allowsCustomization": true,
    "category": { "id": 1, "name": "Cerámica" },
    "photos": [
      { "id": 3, "url": "https://example.com/vasija-1.jpg", "order": 0 },
      { "id": 4, "url": "https://example.com/vasija-2.jpg", "order": 1 }
    ]
  }
}
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | OK |
| `201` | Created |
| `404` | Product or category not found |

---

### 3.4 Product Photos — `/api/product-photo`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 19 | `GET` | `/api/product-photo/product/:productId` | Get all photos for a product (ordered) |
| 20 | `POST` | `/api/product-photo` | Add a photo to a product |
| 21 | `DELETE` | `/api/product-photo/:id` | Delete a photo |

**`POST /api/product-photo` — Request Body**
```json
{
  "productId": 8,
  "url": "https://example.com/vasija-frontal.jpg",
  "order": 0
}
```

**`POST /api/product-photo` — Response `201`**
```json
{
  "success": true,
  "data": { "id": 5, "productId": 8, "url": "https://example.com/vasija-frontal.jpg", "order": 0 }
}
```

---

### 3.5 Orders — `/api/order`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 22 | `GET` | `/api/order` | List all orders (with details + history) |
| 23 | `GET` | `/api/order/:id` | Get order by ID (full details) |
| 24 | `GET` | `/api/order/reference/:reference` | Get order by reference number |
| 25 | `GET` | `/api/order/user/:userId` | Get all orders for a user |
| 26 | `POST` | `/api/order` | Create order record |
| 27 | `PATCH` | `/api/order/:id/status` | Update order status field |
| 28 | `DELETE` | `/api/order/:id` | Delete order |

**`POST /api/order` — Request Body**
```json
{
  "referenceNumber": "ORD-LM3K2X-AFBC",
  "userId": 5,
  "contactName": "María García",
  "email": "maria.garcia@email.com",
  "phone": "0987654321",
  "address": "Av. Amazonas N12-34",
  "province": "Pichincha",
  "shippingCost": 5.00,
  "total": 95.00,
  "status": "pending",
  "isCustomized": false
}
```

**`POST /api/order` — Response `201`**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "referenceNumber": "ORD-LM3K2X-AFBC",
    "userId": 5,
    "contactName": "María García",
    "email": "maria.garcia@email.com",
    "phone": "0987654321",
    "address": "Av. Amazonas N12-34",
    "province": "Pichincha",
    "shippingCost": 5.00,
    "total": 95.00,
    "status": "pending",
    "isCustomized": false,
    "createdAt": "2026-06-22T10:30:00.000Z"
  }
}
```

**`PATCH /api/order/:id/status` — Request Body**
```json
{ "status": "processing" }
```

---

### 3.6 Order Details — `/api/order-detail`

| # | Method | URI | Description |
|---|--------|-----|-------------|
| 29 | `GET` | `/api/order-detail/order/:orderId` | Get all line items for an order |
| 30 | `POST` | `/api/order-detail` | Add single line item |
| 31 | `POST` | `/api/order-detail/bulk` | Add multiple line items at once |
| 32 | `DELETE` | `/api/order-detail/:id` | Delete line item |

**`POST /api/order-detail` — Request Body**
```json
{
  "orderId": 7,
  "productId": 8,
  "quantity": 2,
  "unitPrice": 45.00,
  "customizationDetails": null
}
```

**`POST /api/order-detail/bulk` — Request Body**
```json
{
  "items": [
    {
      "orderId": 7,
      "productId": 8,
      "quantity": 2,
      "unitPrice": 45.00,
      "customizationDetails": null
    },
    {
      "orderId": 7,
      "productId": 3,
      "quantity": 1,
      "unitPrice": 5.00,
      "customizationDetails": "Grabado con iniciales: MG"
    }
  ]
}
```

**`GET /api/order-detail/order/:orderId` — Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "orderId": 7,
      "productId": 8,
      "quantity": 2,
      "unitPrice": 45.00,
      "customizationDetails": null,
      "product": { "id": 8, "name": "Vasija de Barro Pintada", "price": 45.00 }
    },
    {
      "id": 13,
      "orderId": 7,
      "productId": 3,
      "quantity": 1,
      "unitPrice": 5.00,
      "customizationDetails": "Grabado con iniciales: MG",
      "product": { "id": 3, "name": "Pulsera de Plata", "price": 5.00 }
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
  "orderId": 7,
  "status": "processing"
}
```

**`GET /api/order-status-history/order/7` — Response `200`**
```json
{
  "success": true,
  "data": [
    { "id": 1, "orderId": 7, "status": "pending",    "date": "2026-06-22T10:30:00.000Z" },
    { "id": 2, "orderId": 7, "status": "processing", "date": "2026-06-22T11:00:00.000Z" }
  ]
}
```

---

### 3.8 Shipping Configurations — `/api/shipping-config`

| # | Method | URI | Query Params | Description |
|---|--------|-----|-------------|-------------|
| 35 | `GET` | `/api/shipping-config` | — | List all shipping rules |
| 36 | `GET` | `/api/shipping-config/lookup` | `?baseProvince=&destinationProvince=` | Find cost by province pair |
| 37 | `GET` | `/api/shipping-config/:id` | — | Get shipping config by ID |
| 38 | `POST` | `/api/shipping-config` | — | Create shipping rule |
| 39 | `PUT` | `/api/shipping-config/:id` | — | Update shipping rule |
| 40 | `DELETE` | `/api/shipping-config/:id` | — | Delete shipping rule |

**`GET /api/shipping-config/lookup?baseProvince=Pichincha&destinationProvince=Guayas` — Response `200`**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "baseProvince": "Pichincha",
    "destinationProvince": "Guayas",
    "additionalCost": 3.50
  }
}
```

**`POST /api/shipping-config` — Request Body**
```json
{
  "baseProvince": "Azuay",
  "destinationProvince": "Pichincha",
  "additionalCost": 4.00
}
```

---

## 4. Business Service

> **Public API.** Called by the Frontend and external clients.

**Local:** `http://localhost:5017`  
**Production:** `http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com`

### 4.0 System

| # | Method | URI | Auth | Description |
|---|--------|-----|------|-------------|
| 41 | `GET` | `/health` | — | Service health check |

**Response `200`**
```json
{ "status": "ok", "service": "business-service", "port": "8080" }
```

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
  "name": "María García",
  "email": "maria.garcia@email.com",
  "password": "MiPassword123!",
  "phone": "0987654321",
  "address": "Av. Amazonas N12-34",
  "province": "Pichincha"
}
```

**`POST /api/auth/login` — Request Body**
```json
{
  "email": "maria.garcia@email.com",
  "password": "MiPassword123!"
}
```

**`POST /api/auth/register` & `POST /api/auth/login` — Response `200/201`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "María García",
      "email": "maria.garcia@email.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibWFyaWEuZ2FyY2lhQGVtYWlsLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc1MDU5MDAwMCwiZXhwIjoxNzUxMTk0ODAwfQ.XXXXXXXXXXXXXXXXXXXXX"
  }
}
```

**`GET /api/auth/profile` — Authorization Header**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**`GET /api/auth/profile` — Response `200`**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "María García",
    "email": "maria.garcia@email.com",
    "phone": "0987654321",
    "address": "Av. Amazonas N12-34",
    "province": "Pichincha",
    "role": "customer"
  }
}
```

**Status Codes**

| Code | Scenario |
|------|----------|
| `200` | Login successful |
| `201` | Registration successful |
| `401` | Invalid credentials or missing token |
| `409` | Email already registered |

---

### 4.2 Products — `/api/product`

| # | Method | URI | Auth | Query Params | Description |
|---|--------|-----|------|-------------|-------------|
| 45 | `GET` | `/api/product/categories` | — | — | List all product categories |
| 46 | `GET` | `/api/product` | — | `?categoryId={int}` | Browse all products |
| 47 | `GET` | `/api/product/:id` | — | — | Get single product details |
| 48 | `POST` | `/api/product` | Admin | — | Create a new product |
| 49 | `PUT` | `/api/product/:id` | Admin | — | Update product data |
| 50 | `PATCH` | `/api/product/:id/stock` | Admin | — | Update stock level |
| 51 | `DELETE` | `/api/product/:id` | Admin | — | Delete product |

**`GET /api/product?categoryId=1` — Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "Vasija de Barro Pintada",
      "description": "Vasija artesanal con diseños precolombinos.",
      "price": 45.00,
      "stock": 8,
      "status": "active",
      "allowsCustomization": true,
      "category": { "id": 1, "name": "Cerámica" },
      "photos": [
        { "id": 3, "url": "https://example.com/vasija-1.jpg", "order": 0 }
      ]
    }
  ]
}
```

**`POST /api/product` — Request Body** *(Admin required — include JWT)*
```json
{
  "name": "Collar de Tagua Tallada",
  "description": "Collar artesanal elaborado con tagua natural tallada a mano.",
  "price": 28.50,
  "stock": 20,
  "status": "active",
  "allowsCustomization": false,
  "categoryId": 2
}
```

---

### 4.3 Orders — `/api/order`

| # | Method | URI | Auth | Description |
|---|--------|-----|------|-------------|
| 52 | `POST` | `/api/order` | User | **Place order** (validates stock, calculates total, decrements stock) |
| 53 | `GET` | `/api/order/my-orders` | User | Get orders of the authenticated customer |
| 54 | `GET` | `/api/order/reference/:reference` | — | Track order by reference number |
| 55 | `GET` | `/api/order` | Admin | List all orders |
| 56 | `PATCH` | `/api/order/:id/status` | Admin | **Change order status** (state machine enforced) |
| 57 | `PATCH` | `/api/order/:id/approve-customized` | Admin | **Approve a pending customized order** |

**`POST /api/order` — Request Body** *(User JWT required)*
```json
{
  "contactName": "Carlos Mendoza",
  "email": "carlos.mendoza@gmail.com",
  "phone": "0998877665",
  "address": "Calle Bolívar 23-10, Cuenca",
  "province": "Azuay",
  "items": [
    {
      "productId": 8,
      "quantity": 2,
      "customizationDetails": null
    },
    {
      "productId": 3,
      "quantity": 1,
      "customizationDetails": "Grabado con iniciales: CM"
    }
  ]
}
```

**`POST /api/order` — Response `201`**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "referenceNumber": "ORD-LM3K2X-AFBC",
    "contactName": "Carlos Mendoza",
    "email": "carlos.mendoza@gmail.com",
    "province": "Azuay",
    "shippingCost": 4.00,
    "total": 99.00,
    "status": "pending",
    "isCustomized": true,
    "createdAt": "2026-06-22T10:30:00.000Z"
  }
}
```

> [!NOTE]
> A valid JWT is required to place an order. The order is automatically linked to the authenticated user via `userId`.

**`PATCH /api/order/:id/status` — Request Body** *(Admin JWT required)*
```json
{ "status": "processing" }
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

**`GET /api/order/reference/ORD-LM3K2X-AFBC` — Response `200`**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "referenceNumber": "ORD-LM3K2X-AFBC",
    "contactName": "Carlos Mendoza",
    "status": "processing",
    "total": 99.00,
    "createdAt": "2026-06-22T10:30:00.000Z",
    "details": [
      { "productId": 8, "quantity": 2, "unitPrice": 45.00 },
      { "productId": 3, "quantity": 1, "unitPrice": 5.00 }
    ],
    "statusHistory": [
      { "status": "pending",    "date": "2026-06-22T10:30:00.000Z" },
      { "status": "processing", "date": "2026-06-22T11:00:00.000Z" }
    ]
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

### 4.4 Reports — `/api/report`

| # | Method | URI | Auth | Query Params | Description |
|---|--------|-----|------|-------------|-------------|
| 58 | `GET` | `/api/report/sales` | Admin | `?startDate=&endDate=` | Sales report with revenue & order stats |

**Example:** `GET /api/report/sales?startDate=2026-01-01&endDate=2026-06-30`

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
    "orders": [
      {
        "id": 7,
        "referenceNumber": "ORD-LM3K2X-AFBC",
        "total": 99.00,
        "status": "processing",
        "createdAt": "2026-06-22T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 5. Frontend Route Map

**Local:** `http://localhost:3017`  
**Production:** `http://artisan-frontend-env.eba-p9ieurrh.us-east-1.elasticbeanstalk.com`

### Public Routes (No authentication required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect → `/products` | Home redirect |
| `/products` | Product Listing | Browse with category filter |
| `/login` | Login Form | Authenticate user |
| `/register` | Register Form | Create customer account |
| `/orders` | Order Tracking | Track orders |

### Customer Routes (Requires login)

| Route | Page | Description |
|-------|------|-------------|
| `/orders` | My Orders | Customer order history (JWT required) |

### Admin Routes (Requires `role: admin`)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/dashboard` | Dashboard | KPIs, recent orders, low-stock alerts |

---

## 6. Standard Response Envelope

All API responses from both services follow this consistent shape:

**Success**
```json
{
  "success": true,
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Product with id 99 not found"
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
  "userId": 5,
  "email": "maria.garcia@email.com",
  "role": "customer"
}
```

### Guard Levels

| Symbol | Level | Condition |
|--------|-------|-----------| 
| — | Public | No token required |
| User | Authenticated | Valid JWT, any role |
| Admin | Admin only | Valid JWT with `role: admin` |

### Admin Test Credentials (Development only)

> [!CAUTION]
> These are development-only credentials. Do not use in production.

```json
{
  "email": "admin@artisanshop.com",
  "password": "Admin2026!"
}
```

---

## 8. Quick Test Examples (cURL)

### Health Checks — Production
```bash
# CRUD Service
curl http://artisan-crud-env.eba-tmhpspx3.us-east-1.elasticbeanstalk.com/health

# Business Service
curl http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/health

# Frontend
curl http://artisan-frontend-env.eba-p9ieurrh.us-east-1.elasticbeanstalk.com
```

### Register & Login
```bash
# Register
curl -X POST http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"María García","email":"maria@test.com","password":"Test1234!"}'

# Login
curl -X POST http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"Test1234!"}'
```

### Place an Order (Guest)
```bash
curl -X POST http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Carlos Mendoza",
    "email": "carlos@test.com",
    "phone": "0998877665",
    "address": "Calle Bolívar 23-10",
    "province": "Azuay",
    "items": [{"productId": 1, "quantity": 1, "customizationDetails": null}]
  }'
```

### Admin — Change Order Status
```bash
# First get token via login as admin, then:
curl -X PATCH http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/order/7/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"status": "processing"}'
```

### Sales Report
```bash
curl http://artisan-business-env.eba-qmrdkji7.us-east-1.elasticbeanstalk.com/api/report/sales?startDate=2026-01-01&endDate=2026-12-31 \
  -H "Authorization: Bearer <admin_token>"
```

---

## 9. URI Inventory Summary

| Service | Total Endpoints |
|---------|----------------|
| CRUD Service | 40 |
| Business Service | 17 |
| Frontend Routes | 5 |
| **Total** | **62** |

### CRUD Service by Resource

| Resource | GET | POST | PUT | PATCH | DELETE | Total |
|----------|-----|------|-----|-------|--------|-------|
| `/health` | 1 | — | — | — | — | 1 |
| `/api/user` | 3 | 1 | 1 | — | 1 | 6 |
| `/api/category` | 2 | 1 | 1 | — | 1 | 5 |
| `/api/product` | 2 | 1 | 1 | 1 | 1 | 6 |
| `/api/product-photo` | 1 | 1 | — | — | 1 | 3 |
| `/api/order` | 4 | 1 | — | 1 | 1 | 7 |
| `/api/order-detail` | 1 | 2 | — | — | 1 | 4 |
| `/api/order-status-history` | 1 | 1 | — | — | — | 2 |
| `/api/shipping-config` | 3 | 1 | 1 | — | 1 | 6 |
| **Total** | **18** | **9** | **4** | **2** | **6** | **40** |

### Business Service by Resource

| Resource | GET | POST | PATCH | DELETE | Total |
|----------|-----|------|-------|--------|-------|
| `/health` | 1 | — | — | — | 1 |
| `/api/auth` | 1 | 2 | — | — | 3 |
| `/api/product` | 3 | 1 | 1 | 1 | 6 |
| `/api/order` | 3 | 1 | 2 | — | 6 |
| `/api/report` | 1 | — | — | — | 1 |
| **Total** | **9** | **4** | **3** | **1** | **17** |

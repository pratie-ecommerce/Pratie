# Backend REST API Reference (`pratie-backend`)

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Customer
- **Method / Path**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "customer@pratie.com",
    "password": "Customer@123",
    "fullName": "Meera Kapoor",
    "phone": "+91 9123456780"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "user": { "id": "usr_...", "email": "customer@pratie.com", "fullName": "Meera Kapoor", "role": "customer" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

### 1.2 Login
- **Method / Path**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "customer@pratie.com",
    "password": "Customer@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "user": { "id": "...", "email": "customer@pratie.com", "role": "customer" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

### 1.3 Get Current Session
- **Method / Path**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: User profile object without password hash.

---

## 2. Product Catalog Endpoints (`/api/products`)

### 2.1 Get Products (Filtered & Paginated)
- **Method / Path**: `GET /api/products`
- **Query Parameters**:
  - `clothingType`: Filter by garment silhouette: `'Saree'` (or `'sarees'`) | `'Suit'` (or `'suits'`)
  - `state`: Filter by Indian State / UT of origin (e.g., `'Uttar Pradesh'`, `'Bihar'`, `'Jammu & Kashmir'`, `'Tamil Nadu'`)
  - `craftTechnique`: Filter by traditional craft (e.g., `'Banarasi Kadwa'`, `'Mithila Handpainted'`, `'Kashmiri Tilla'`)
  - `fabric`: Filter by silk purity or weave (e.g., `'Pure Mulberry Silk'`, `'Bhagalpuri Tussar'`)
  - `category`: Filter by category name or UUID
  - `brand`: Filter by brand name or UUID
  - `search`: Keyword string matching title, description, state, craft, or tags
  - `minPrice` / `maxPrice`: Filter by price range in Paise
  - `featured`: `true` | `false`
  - `newArrival`: `true` | `false`
  - `sort`: `'newest'` | `'price_asc'` | `'price_desc'` | `'rating'`
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `12`, up to `60`)

### 2.2 Get Product by Slug / ID
- **Method / Path**: `GET /api/products/:slug`
- **Response (200 OK)**: Product record with all multi-angle photography, variants, approved reviews, and related creations.

### 2.3 Get Taxonomies
- **Method / Path**: `GET /api/products/taxonomies`
- **Response (200 OK)**: List of all 33 States, Categories, Clothing Types (`Saree` and `Suit`), and Craft Techniques.

---

## 3. Shopping Bag & Cart Endpoints (`/api/cart`)

### 3.1 Get Cart
- **Method / Path**: `GET /api/cart`
- **Headers**: Optional `Authorization: Bearer <token>`
- **Query Parameters**: Optional `sessionId` (for unauthenticated guests)

### 3.2 Add to Cart
- **Method / Path**: `POST /api/cart/add`
- **Request Body**:
  ```json
  {
    "productId": "p0000001-0000-0000-0000-000000000001",
    "variantId": "v1",
    "quantity": 1,
    "sessionId": "guest_session_123"
  }
  ```

### 3.3 Update Cart Item Quantity
- **Method / Path**: `PUT /api/cart/items/:id`
- **Request Body**: `{ "quantity": 2 }`

### 3.4 Remove Item from Cart
- **Method / Path**: `DELETE /api/cart/items/:id`

### 3.5 Synchronize Guest Cart on Login
- **Method / Path**: `POST /api/cart/sync`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ "sessionId": "guest_session_123" }`

---

## 4. Checkout & Orders Endpoints (`/api/orders`)

### 4.1 Calculate Order Breakdown & Apply Coupon
- **Method / Path**: `POST /api/orders/calculate`
- **Request Body**:
  ```json
  {
    "items": [{ "productId": "p1", "variantId": "v1", "quantity": 1 }],
    "couponCode": "WELCOME10"
  }
  ```
- **Response (200 OK)**: Returns subtotal, discount, 18% GST tax, shipping, and grand total in integer Paise.

### 4.2 Create Order
- **Method / Path**: `POST /api/orders/create`
- **Request Body**:
  ```json
  {
    "shippingAddress": {
      "fullName": "Aarav Singhania",
      "phone": "+91 9876543210",
      "streetLine1": "Penthouse 4B, The Imperial",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400034",
      "country": "India"
    },
    "couponCode": "WELCOME10",
    "paymentMethod": "razorpay",
    "guestEmail": "aarav.singhania@pratie.com",
    "items": [{ "productId": "p1", "variantId": "v1", "quantity": 1 }]
  }
  ```

### 4.3 Get Order by ID or Number
- **Method / Path**: `GET /api/orders/:id`

### 4.4 Get User's Order History
- **Method / Path**: `GET /api/orders/my-orders`
- **Headers**: `Authorization: Bearer <token>`

---

## 5. Payments Endpoints (`/api/payments`)

### 5.1 Verify Razorpay Payment Signature
- **Method / Path**: `POST /api/payments/razorpay/verify`
- **Request Body**:
  ```json
  {
    "orderId": "ord_1741180000",
    "razorpayOrderId": "order_prt_1741180000",
    "razorpayPaymentId": "pay_rzp_1741180000",
    "razorpaySignature": "simulated_sig_1741180000"
  }
  ```

### 5.2 Razorpay Webhook Handler
- **Method / Path**: `POST /api/payments/razorpay/webhook`

---

## 6. Admin Endpoints (`/api/admin`)
*(Protected by JWT + `role: ['admin', 'superadmin']`)*

- `GET /api/admin/analytics`: Real-time KPI revenue metrics, active orders, low stock counters, recent transactions.
- `GET /api/admin/products`: Full product catalog for administration.
- `POST /api/admin/products`: Create single product with variants and image media.
- `PUT /api/admin/products/:id`: Update product specifications.
- `DELETE /api/admin/products/:id`: Delete product from catalog.
- `POST /api/admin/products/import-csv`: Bulk import products via CSV string using PapaParse.
- `GET /api/admin/orders`: List all orders across all customers.
- `PUT /api/admin/orders/:id/status`: Update fulfillment state (`confirmed` -> `processing` -> `shipped` -> `delivered`) & tracking ID.
- `GET /api/admin/customers`: List VIP customers, order counts, and lifetime spending.

# Luxury Jewelry Backend

Node.js, Express, and MongoDB API for the jewelry frontend.

## Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file from `.env.example` if you want to change the port, MongoDB URL, or frontend URL.

The server seeds starter products and categories when those collections are empty.
The first registered user becomes an admin automatically. You can also set
`ADMIN_EMAILS=owner@example.com,team@example.com` in `.env` so those emails become
admin accounts when they register.

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/summary`
- `POST /api/admin/upload`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/offers`
- `POST /api/admin/offers`
- `PATCH /api/admin/offers/:id`
- `DELETE /api/admin/offers/:id`
- `GET /api/products`
- `GET /api/products?featured=true`
- `GET /api/products?category=Rings&search=diamond`
- `GET /api/categories`
- `GET /api/favorites`
- `POST /api/favorites/:productId`
- `DELETE /api/favorites/:productId`
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders/mine`
- `POST /api/newsletter`
- `POST /api/contact`

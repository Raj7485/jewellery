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

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
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
- `POST /api/newsletter`
- `POST /api/contact`

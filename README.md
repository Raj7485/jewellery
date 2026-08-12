# Luxury Jewelry Shop

A modern, responsive jewelry shop built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Folder Structure

```text
backend/
  src/
    config/
    data/
    models/
    routes/
src/
  api/
  components/
  hooks/
  pages/
  data.js
  App.jsx
  main.jsx
  index.css
```

## Run Locally

Start MongoDB first. The backend defaults to:

```text
mongodb://127.0.0.1:27017/jewellry
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

Run the frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend proxies `/api` requests to `http://127.0.0.1:5000`.

## Build

```bash
npm run build
```

## Backend API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products?featured=true`
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

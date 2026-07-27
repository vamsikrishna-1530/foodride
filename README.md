# FoodRide

A full-stack, Swiggy-style food delivery platform built to be **owner and delivery-partner
friendly** — low platform fees, three role-based experiences (Customer, Restaurant Owner,
Delivery Partner), and Razorpay payments.

## Stack

- **Frontend**: React (Vite) + Material UI, React Router, Axios
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT
- **Payments**: Razorpay (test mode by default)

## Why it's "friendly" by design

- Restaurant commission defaults to **8%** (`RESTAURANT_COMMISSION_PERCENT`), well below the
  20-30% typical aggregator cut.
- Delivery partners keep almost all of the delivery fee — FoodRide only takes a small flat cut
  (`DELIVERY_PLATFORM_FEE`, default ₹10) per delivery.
- Customers only pay a small flat platform fee (`CUSTOMER_PLATFORM_FEE`, default ₹3).

All of these are environment variables in `backend/.env`, so pricing policy can be tuned without
touching code.

## Project structure

```
foodride/
  backend/    Express API, MongoDB models, Razorpay integration
  frontend/   React app with Customer / Owner / Delivery experiences
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, Razorpay test keys
npm install
npm run dev             # starts on http://localhost:5000
```

You need a running MongoDB instance (local `mongod`, Docker, or MongoDB Atlas) and a
[Razorpay test-mode key pair](https://dashboard.razorpay.com/app/keys) for payments to work.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173, proxies /api to :5000
```

Open http://localhost:5173, register as a **Customer**, **Owner**, or **Delivery Partner**, and
explore the corresponding dashboard.

## Core flows

- **Customer**: browse restaurants → view menu → add to cart → checkout → pay via Razorpay →
  track order status.
- **Owner**: create a restaurant → manage its menu → view incoming orders → advance order status
  (accepted → preparing → ready for pickup).
- **Delivery partner**: see orders ready for pickup → accept one → mark delivered → track
  earnings.

## Payment flow

1. Customer places an order (`POST /api/orders`) — created with `paymentStatus: pending`.
2. Frontend calls `POST /api/payment/create-order`, which creates a Razorpay order for the exact
   order total and returns the Razorpay `key_id` + `order_id`.
3. Razorpay Checkout collects payment (cards/UPI/netbanking/wallets in test mode).
4. On success, the frontend calls `POST /api/payment/verify`, which recomputes the HMAC-SHA256
   signature server-side and only marks the order `paid` if it matches.

## Notes / next steps for production

- Add restaurant/delivery-partner KYC/approval workflow (`isApproved` field already exists on
  `User`).
- Add real-time order tracking (WebSockets) instead of polling.
- Add refunds via Razorpay's Refunds API for cancelled orders.
- Add image uploads (currently menu/restaurant images are URLs).

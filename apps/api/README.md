# 🍽️ Restaurant System — API

A backend REST API for a restaurant management system, built with Node.js + TypeScript, Sequelize, BullMQ, and Socket.IO. Designed with clean architecture, asynchronous order processing via a FIFO queue, and real-time WebSocket notifications.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture Concepts](#architecture-concepts)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Async Order Flow](#async-order-flow)
- [WebSocket Integration](#websocket-integration)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

This API serves as the backend for a restaurant system. Its main responsibilities are:

- Exposing REST endpoints for **clients**, **products**, and **orders**
- **Verifying ingredient stock** before accepting an order
- Processing orders **asynchronously via a FIFO queue** to prevent race conditions in a concurrent environment
- Notifying the frontend of the **order result in real-time via WebSocket**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| HTTP Framework | Express 5 |
| ORM | Sequelize (SQLite for dev) |
| Queue | BullMQ |
| Queue Broker | Redis |
| WebSocket | Socket.IO |
| Package Manager | pnpm |

---

## Architecture Concepts

The project follows a **Clean Architecture** pattern, where the code is organized in layers with strict dependency rules:

```
@application  ←  Core business logic. No framework dependencies.
@infra        ←  External adapters: Express, Sequelize, Redis, Socket.IO
```

**The golden rule**: `@application` never imports from `@infra`. The infra layer is the one that "plugs into" the application.

### Layers

#### `@application`

Contains everything that represents the **business rules** of the restaurant domain. It has no knowledge of HTTP, databases, or sockets.

- **`entities/`** — TypeScript interfaces that represent domain objects (`IClient`, `IProduct`, `IOrder`, `IInput`, etc.)
- **`repositories/`** — Abstract classes (interfaces) declaring what operations are available on each entity, plus their Sequelize implementations
- **`usecases/`** — Application logic orchestrators (e.g. `CreateOrderUseCase`, `ReadAvailableProductsUseCase`). Each use case has a single responsibility.
- **`services/`** — Reusable business logic that isn't tied to a single use case
  - `VerifyIngredients.service.ts` — Checks whether there's enough stock to fulfill an order
  - `queue/` — BullMQ queue producer and worker that process orders sequentially

#### `@infra`

Adapts the application to the outside world.

- **`controllers/`** — HTTP request handlers. They read the request, call a use case or service, and return an `IHttpResponse`
- **`database/sequelize/`** — Sequelize connection, schema definitions (models), migrations, and seeders
- **`http/express/`** — Express app setup, route definitions, CORS, route adapter
- **`http/socket/`** — Socket.IO server initialization and singleton accessor
- **`queue/`** — Redis connection options (shared with `@application/services/queue/`)

---

## Project Structure

```
src/
├── index.ts                          # Entrypoint: HTTP server, Socket.IO, Worker, DB sync
│
├── @application/
│   ├── entities/                     # Domain interfaces
│   │   ├── Client.ts
│   │   ├── Input.ts
│   │   ├── Order.ts
│   │   ├── OrderProduct.ts
│   │   ├── Product.ts
│   │   └── ProductInput.ts
│   │
│   ├── repositories/                 # Abstract + Sequelize implementations
│   │   ├── Client.abstract.ts / Client.sequelize.ts
│   │   ├── Order.abstract.ts  / Order.sequelize.ts
│   │   ├── OrderProduct.abstract.ts  / OrderProduct.sequelize.ts
│   │   ├── Input.abstract.ts  / Input.sequelize.ts
│   │   ├── Product.abstract.ts / Product.sequelize.ts
│   │   └── ProductInput.abstract.ts  / ProductInput.sequelize.ts
│   │
│   ├── usecases/
│   │   ├── client/ReadClient.usecase.ts
│   │   ├── order/CreateOrder.usecase.ts
│   │   └── product/ReadAvailableProducts.usecase.ts
│   │
│   └── services/
│       ├── VerifyIngredients.service.ts
│       └── queue/
│           ├── orderQueue.ts         # BullMQ Queue + enqueueOrder()
│           └── OrderWorker.ts        # BullMQ Worker (concurrency: 1)
│
└── @infra/
    ├── controllers/
    │   ├── index.ts                  # IController base class + IHttpResponse
    │   ├── CreateOrder.controller.ts
    │   ├── ReadAvailableProducts.controller.ts
    │   └── ReadClient.controller.ts
    │
    ├── database/sequelize/
    │   ├── connection.ts             # Sequelize instance
    │   ├── config.json               # DB config per environment
    │   ├── schemas/                  # Sequelize model definitions + associations
    │   ├── migrations/               # Table creation migrations
    │   └── seeders/                  # Demo data seeders
    │
    ├── http/express/
    │   ├── app.ts                    # Express application factory
    │   ├── adapters/expressRouteAdapter.ts   # Bridges IController ↔ Express
    │   ├── cors/                     # CORS setup
    │   └── routes/
    │       ├── index.ts              # Route registration (/v1/*)
    │       ├── client/               # GET /v1/client
    │       ├── product/              # GET /v1/product/available
    │       └── order/                # POST /v1/order
    │
    ├── http/socket/
    │   └── socketServer.ts           # Socket.IO server (singleton)
    │
    └── queue/
        └── redisConnection.ts        # Shared Redis config options
```

---

## Database Schema

> Development uses **SQLite**. The schema is managed via Sequelize migrations.

```
clients
  id (UUID PK), name, address, createdAt, updatedAt

products
  id (UUID PK), name, imgUrl, available (bool), createdAt, updatedAt

inputs                         ← Ingredients / raw materials
  id (UUID PK), name, stock_quantity (float), quantity_unit, createdAt, updatedAt

products_inputs                ← How much of each ingredient a product requires
  id (UUID PK), product_id (FK), input_id (FK), input_quantity (float)

orders
  id (UUID PK), client_id (FK → clients), status, createdAt, updatedAt

order_products                 ← Items inside an order
  id (UUID PK), order_id (FK), product_id (FK), quantity (int), observation
```

---

## API Reference

### `GET /v1/client`
Returns all clients.

**Response `200`**
```json
{ "clients": [ { "id": "...", "name": "...", "address": "..." } ] }
```

---

### `GET /v1/product/available`
Returns all products where `available = true`.

**Response `200`**
```json
{ "products": [ { "id": "...", "name": "...", "imgUrl": "...", "available": true } ] }
```

---

### `POST /v1/order`
Places an order in the processing queue.

**Request body**
```json
{
  "client_id": "uuid",
  "order_products": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "observation": "No onions"
    }
  ]
}
```

**Response `202 Accepted`**
```json
{
  "job_id": "1",
  "message": "Order queued for processing. It will be confirmed shortly."
}
```

> The order is **not created immediately**. Use the `job_id` to subscribe via WebSocket and receive the final result.

---

## Async Order Flow

The order creation flow is intentionally asynchronous to prevent **race conditions** on ingredient stock. The problem this solves:

Without a queue, two simultaneous requests could both check stock, both see "enough ingredients", and both succeed — even if there's only enough stock for one order.

### Solution: FIFO Queue with a single worker

```
Client A ──► POST /order ──► enqueue job #1 ──► 202 { job_id: "1" }
Client B ──► POST /order ──► enqueue job #2 ──► 202 { job_id: "2" }

                         BullMQ Queue (Redis)
                         ┌─────────────────────┐
                         │  job #1  │  job #2  │  FIFO
                         └─────────────────────┘
                                    ↓
                      Worker (concurrency: 1)
                      1. Verify ingredients against live stock
                      2. If sufficient: create order + order_products in DB
                      3. If not: reject
                      4. Emit result via Socket.IO to the client's room
```

**`concurrency: 1`** on the worker is the key. Only one order is processed at a time, making the check + write operation effectively atomic.

---

## WebSocket Integration

Socket.IO is attached to the same HTTP server and runs on the same port as the REST API.

### Client-side usage

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3031");

// 1. POST the order, get job_id
const res = await fetch("/v1/order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id, order_products }),
});
const { job_id } = await res.json();

// 2. Subscribe to updates for this specific job
socket.emit("subscribe-order", { job_id });

// 3. Listen for the result
socket.on("order-result", (data) => {
  if (data.status === "confirmed") {
    console.log("Order created!", data.order);
    console.log("Ingredients used:", data.ingredient_verification);
  } else {
    console.error("Order rejected:", data.reason);
    // e.g. "Insufficient ingredients to fulfill the order."
  }
});
```

### Events reference

| Direction | Event | Payload |
|---|---|---|
| Client → Server | `subscribe-order` | `{ job_id: string }` |
| Server → Client | `order-result` | `{ status: "confirmed" \| "rejected", order?, order_products?, ingredient_verification?, reason? }` |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm
- Docker (for Redis)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Redis

```bash
docker compose up redis -d
```

### 3. Run migrations and seed demo data

```bash
pnpm run migrate
pnpm run seed
```

### 4. Start the development server

```bash
pnpm run dev
```

The server will start on `http://localhost:3031` by default (or the `PORT` from `.env`).

---

## Environment Variables

Create a `.env` file at `apps/api/.env`:

```env
PORT=3031
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

---

## Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start with hot-reload (nodemon + ts-node) |
| `pnpm run build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run the compiled build |
| `pnpm run migrate` | Run Sequelize migrations |
| `pnpm run seed` | Run Sequelize seeders |

# Production:

- **API**: [https://tgssc48g4o0sk0wk0ww4cs4s.178.156.146.224.sslip.io](https://tgssc48g4o0sk0wk0ww4cs4s.178.156.146.224.sslip.io)

  > deployed backend, database and redis on coolify

- **Web Client**: [https://restaurant-system-web-client.vercel.app](https://restaurant-system-web-client.vercel.app)
- **Web Admin**: [https://restaurant-system-web-admin.vercel.app](https://restaurant-system-web-admin.vercel.app)
  > deployed both frontends on vercel

# Restaurant System Ecosystem

A robust, real-time restaurant management ecosystem built with a modern monorepo architecture. This system streamlines the journey from customer ordering to kitchen management and administrative oversight.

## 🌟 Project Vision

The Restaurant System is designed to provide a seamless, high-performance experience for both customers and restaurant staff. By leveraging asynchronous job processing and real-time communication, the platform ensures that even during high-traffic periods, orders are managed reliably and status updates are delivered instantly.

## 🏗️ System Architecture

The project is structured as a **Turborepo monorepo**, ensuring consistency and shared tooling across multiple applications:

- **`apps/api`**: The central nervous system. A Node.js API that handles data persistence, manages the order queue, and facilitates real-time communication via WebSockets.
- **`apps/web-client`**: The customer-facing interface. A sleek, responsive web application for browsing products, managing a cart, and tracking order progress in real-time. It includes an offline-first queue to ensure orders are never lost during connectivity drops.
- **`apps/web-admin`**: The administrative dashboard. A specialized view for restaurant staff to monitor incoming orders, manage inventory, and update order statuses.

## 🚀 Key Features

- **Asynchronous Order Processing**: High-reliability ordering system using **BullMQ** and **Redis** to prevent data loss and handle background processing.
- **Real-time Synchronization**: Instant updates across all clients (Admin and Customers) using **Socket.IO**.
- **Ingredient Verification**: Intelligent inventory management that automatically verifies stock levels before confirming an order.
- **Offline Reliability**: The web client buffers failed orders in `localStorage` and automatically retries them when connectivity returns.
- **Modular Design**: Clean Architecture principles applied to the backend for high maintainability.

## 🛠️ Tech Stack

### Backend (`apps/api`)

- **Core**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Queue**: BullMQ, Redis
- **Real-time**: Socket.IO
- **Language**: TypeScript

### Frontend (`apps/web-client` & `apps/web-admin`)

- **Core**: React, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: React Hooks, Context API
- **Real-time**: Socket.IO Client
- **Language**: TypeScript

## 💻 Local Development

### Prerequisites

Ensure you have the following installed:

- **Node.js**: >= 18
- **pnpm**: `npm install -g pnpm`
- **Docker**: For running Postgres and Redis easily.

### Setup Instructions

1.  **Clone and Install Dependencies**:

    ```bash
    pnpm install
    ```

2.  **Infrastructure Setup**:
    Start the required databases using Docker Compose:

    ```bash
    cd apps/api
    docker-compose up -d
    ```

3.  **Environment Configuration**:
    Configure the `.env` files in each application. You can refer to `.env.example` where available.
    - `apps/api/.env`: Set DB and Redis credentials.
    - `apps/web-client/.env`: Set `VITE_API_URL`.
    - `apps/web-admin/.env`: Set `VITE_API_URL`.

4.  **Database Migrations**:
    Prepare the database schema:

    ```bash
    cd apps/api
    pnpm migrate
    pnpm seed
    ```

5.  **Run the System**:
    From the **root directory**, start all applications in development mode:
    ```bash
    pnpm dev
    ```

- **API**: [http://localhost:3031](http://localhost:3031)
- **Web Client**: [http://localhost:5173](http://localhost:5173)
- **Web Admin**: [http://localhost:5174](http://localhost:5174)

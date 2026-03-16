# Architecture Overview

GymPro is built with a modern, scalable architecture designed to support web and mobile users while maintaining a single source of truth for business logic and types.

## High-Level Design

The system follows a **Monorepo** pattern, facilitating tight integration between the API and its consumers.

```mermaid
graph TD
    subgraph Clients
        Web[React Web App]
        Mobile[Capacitor Native App]
    end

    subgraph Core
        SDK[@ahmedrioueche/gympro-client]
    end

    subgraph Server
        API[NestJS API]
        DB[(MongoDB)]
    end

    Web --> SDK
    Mobile --> SDK
    SDK --> API
    API --> DB
```

## Technology Stack

- **Backend:** NestJS (Node.js Framework), MongoDB (Mongoose ODM).
- **Frontend:** React, Vite, Tailwind CSS, TanStack (Query & Router).
- **Mobile:** Capacitor (Wraps the web build into native iOS/Android).
- **Shared:** TypeScript (End-to-end type safety).

## Key Design Decisions

1. **Shared Client Package:** All API interactions are handled by a dedicated package (`@ahmedrioueche/gympro-client`). This ensures that changes in the backend DTOs (Data Transfer Objects) are immediately reflected in the frontend, preventing runtime errors.
2. **Modular NestJS:** The backend is divided into domain-specific modules (e.g., `Gym`, `Member`, `Training`), making the codebase easy to navigate and test.
3. **Single Codebase for Web/Mobile:** By using Capacitor, we maintain a single React codebase that renders perfectly on the web and as a native application, reducing maintenance overhead.

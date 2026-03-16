# Backend Documentation

The GymPro backend is a robust REST API built using the **NestJS** framework, prioritizing modularity and maintainability.

## Core Architecture

### Modular Design
The API is split into over 30 domain-driven modules. Each module (located in `src/modules`) typically contains:
- **Controller:** Handlers for incoming HTTP requests.
- **Service:** Core business logic.
- **Schema:** Mongoose definitions for MongoDB.
- **DTOs:** Transition objects for data validation.

### Database
- **Provider:** MongoDB.
- **ORM:** Mongoose.
- **Design:** Uses a flexible document-based schema to handle diverse data types like training programs, exercise logs, and subscription histories.

## Key Integrations

- **Payments:** Integrated with both **Paddle** and **Chargily** for global and local subscription management.
- **AI:** Custom AI module for workout generation and analytics.
- **Real-time:** Socket.io integration for instant notifications and attendance tracking.
- **Security:** Standardized Auth module with JWT and role-based access control (Admin, Manager, Coach, Member).

## Middleware & Interceptors
The system uses custom middleware (e.g., `PlatformMiddleware`) to identify whether requests originate from the web or native mobile apps, enabling customized responses or logging.

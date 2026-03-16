# Client SDK Documentation

The `@ahmedrioueche/gympro-client` package is the glue that connects the GymPro ecosystem.

## Purpose

The SDK serves as a unified interface for all API interactions. It is used by:
1. The **Web Dashboard**.
2. The **Mobile Application**.
3. Potential future integrations (e.g., Desktop or Public API).

## Key Features

### 1. End-to-End Type Safety
By sharing the same DTO (Data Transfer Object) types between the backend and the client SDK, we achieve full type safety. If an API field changes in the backend, the frontend build will fail, ensuring errors are caught at compile-time rather than run-time.

### 2. Centralized Configuration
The SDK handles API base URLs, authentication headers, and interceptors in one place.
```typescript
configureApi({
  baseURL: 'https://api.gympro.com',
  isDev: false
});
```

### 3. Consistency
Whether fetching a member's progress or updating a coach's profile, the calling pattern is consistent across the entire frontend application.

## Structure
- `/src/api`: Axios instances and endpoint definitions.
- `/src/dto`: Shared interfaces for requests and responses.
- `/src/types`: Core domain types (e.g., `UserRoles`, `SubscriptionStatus`).

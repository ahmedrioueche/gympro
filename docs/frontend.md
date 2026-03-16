# Frontend Documentation

The GymPro frontend is a high-performance, responsive application built with **React** and **Vite**.

## Core Stack

- **Framework:** React 18+.
- **Build Tool:** Vite (for fast development and optimized production builds).
- **Routing:** TanStack Router (Type-safe routing).
- **State Management:** TanStack Query (Server state) and Zustand (Local UI state).
- **Styling:** Tailwind CSS (consistent design system).

## Mobile Integration (Capacitor)

The frontend is designed to be **Store-Ready**. Using **Capacitor**, the web application is wrapped into native shells for iOS and Android.

### Key Mobile Features:
- **Splash Screens:** Native boot sequence.
- **Safe Area Handling:** CSS adjustments for notches and status bars.
- **Native APIs:** Access to camera for QR code scanning and biometrics for faster login.

## Application Structure

- `/app/pages`: Domain-specific pages (Landing, Dashboard, Member, etc.).
- `/components/ui`: Reusable, atomic UI components.
- `/hooks`: Custom hooks for shared logic, primarily leveraging TanStack Query.
- `/locales`: Internationalization supports (English, French, Arabic).

# Development Rules & Guidelines

## Overview

You are a Senior Full-Stack Developer specializing in TypeScript, React, NestJS, and modern UI/UX frameworks. This is a **multi-platform application** (web + mobile) with a NestJS backend and DynamoDB database.

**Current Focus**: Web application development only. Ignore mobile and backend unless specifically requested.

## Core Principles

- Write **ultra-performant, blazingly fast** code
- Follow **React best practices** to maximize performance and minimize loading times
- Create **readable, maintainable, and DRY** (Don't Repeat Yourself) code
- Implement **immediate reactivity** - avoid page refreshes, reflect state changes instantly
- Use **early returns** whenever possible for better readability
- Write **complete, fully functional code** - NO todos, placeholders, or missing pieces
- If uncertain about correctness, explicitly state so

## Project Structure

### Technology Stack

**Frontend (Web)**

- React.js with TypeScript
- TailwindCSS for styling
- i18next for internationalization
- Zustand for state management

**Backend**

- NestJS with TypeScript
- DynamoDB for database

**Mobile**

- React Native (not in current scope)

## Code Implementation Rules

### 1. Component Architecture

**Component Structure**

- **Always split complex components** into smaller, reusable ones
- Use components from `src/components/ui` for consistency
- If a custom component doesn't exist (e.g., custom checkbox), **create it first, then use it**
- Avoid using default HTML elements directly
- Store feature-specific components in `./components` subdirectories

**Required Components**
Always use these custom components for consistent UX:

- `Loading` - for loading states
- `Error` - for error states
- `NotFound` - for 404 states
- `NoData` - for empty states
- `PageHeader` - for page titles and actions

If they don't exist, create them before using.

### 2. Styling & UI

**TailwindCSS Rules**

- **Always use Tailwind utility classes** - NO CSS files or style tags
- **Never use arbitrary colors** - only use colors defined in `index.css` and `tailwind.config`
- Use `className` with conditional logic: `cn()` helper for complex conditions
- Match UI **exactly** to existing pages and design system
- Ensure **pixel-perfect** implementation when provided with Figma designs

**Accessibility**

- Add `tabIndex="0"` for interactive elements
- Include `aria-label` attributes
- Implement keyboard handlers: `onKeyDown`, etc.
- Ensure semantic HTML structure

### 3. Internationalization (i18n)

**Translation Rules**

- **ALWAYS use i18n translations** - NO hard-coded text anywhere
- Add all text to `en.json` (or appropriate locale file)
- **Do NOT add fallback text** - missing translations should be apparent
- Use translation keys that describe the content: `"memberProfile.subscription.active"`

**Format**

```typescript
const { t } = useTranslation();
// Usage
{
  t("common.goBack");
}
```

### 4. State Management

**Zustand for Persistence**

- Use Zustand stores for global state
- Implement state persistence where needed
- Keep stores focused and modular

**Local State**

- Use React hooks (`useState`, `useReducer`) for component-local state
- Extract complex logic into custom hooks in `./hooks` directory

### 5. Data Fetching & API Calls

**Service Layer Pattern**

- **Never use `fetch` directly in components**
- Create API service classes in `src/services` folder
- Name service files by resource: `members.ts`, `coaches.ts`, `subscriptions.ts`

**Placeholder Data**

- Store mock data in `src/services/placeholders/`
- Name files: `members.json`, `coaches.json`, etc.
- Service classes should use placeholder data initially
- **Goal**: Switch from placeholders to real backend by only changing service classes

**API Response Format**

```typescript
// All API functions must return ApiResponse
export interface ApiResponse<T = any> {
  success: boolean;
  errorCode?: string;
  data?: T;
  message?: string;
}
```

### 6. Type Safety

**Type Definitions**

- Define types in dedicated files: `types/user.ts`, `types/subscription.ts`
- **Check if types exist before creating new ones** - avoid duplication
- **Never create types inside components**
- Share types between client and server using a shared package

**Client Package Types**

- Store shared types in `client/types` package
- Backend endpoints must use and return these types
- Keep type definitions synchronized across packages

### 7. Error Handling

**Error Codes**

- Define error codes in `client/types/error.ts`
- Map error codes to user messages in `web/utils/statusMessage.ts`

**User Feedback**

- Use `getMessage()` to get localized error messages
- Use `ShowStatusToast()` for user notifications
- Handle all error states gracefully with `Error` component

### 8. Backend Development (When Required)

**NestJS Structure**
When creating new endpoints:

1. **Types** (in client package)

   - Create/update interfaces in `client/types`
   - Ensure no duplication

2. **Module**

   - Create NestJS module if needed
   - Register in appropriate parent module

3. **Schema** (if needed)

   - Define DynamoDB schema
   - Include proper indexes

4. **Controller**

   - Return `ApiResponse` format
   - Include appropriate error codes
   - Use proper HTTP status codes

5. **Service**

   - Implement business logic
   - Handle errors gracefully
   - Return structured responses

6. **Error Handling**
   - Add error codes to `client/types/error.ts`
   - Add messages to `web/utils/statusMessage.ts`

### 9. Performance Optimization

**Critical Rules**

- **Do NOT install unnecessary dependencies**
- **Avoid performance killers** like Framer Motion (use CSS transitions instead)
- Only install dependencies when absolutely necessary
- **Check for existing similar dependencies** before adding new ones
- Implement code splitting and lazy loading where appropriate
- Optimize images and assets
- Use React.memo() and useMemo() judiciously

**Best Practices**

- Minimize re-renders with proper dependency arrays
- Use useCallback for function props
- Implement virtualization for long lists
- Debounce/throttle expensive operations

### 10. File Organization

**Helper Functions**

- **Never create helper functions in components**
- Add utilities to `utils/helper.ts`
- Keep helpers pure and reusable

**Constants**

- Define constants in `src/constants` folder
- **Never use arbitrary values** in components
- Group related constants together

**Queries & Data Hooks**

- Create data fetching hooks in `./hooks` directory
- Name hooks descriptively: `useMembers`, `useSubscription`
- Separate data fetching logic from UI logic

### 11. Page Creation Checklist

When creating a new page:

- [ ] Use `PageHeader` component
- [ ] Match colors from `index.css`
- [ ] Use components from `src/components/ui`
- [ ] Add all text to `en.json` (no fallback text)
- [ ] Split into smaller components in `./components`
- [ ] Extract logic into hooks in `./hooks`
- [ ] Create queries for data fetching
- [ ] Use `getMessage` and `ShowStatusToast` for feedback
- [ ] Create necessary API endpoints in client package
- [ ] Avoid duplication - check existing types/endpoints
- [ ] Create module, controller, service (if backend needed)
- [ ] Return `ApiResponse` from all endpoints
- [ ] Add error codes to `client/types/error.ts`
- [ ] Add messages to `web/utils/statusMessage.ts`

### 12. Code Quality Standards

**Naming Conventions**

- Use descriptive variable and function names
- Event handlers: prefix with `handle` → `handleClick`, `handleSubmit`
- Boolean variables: prefix with `is`, `has`, `should` → `isLoading`, `hasError`
- Use `const` for functions: `const fetchData = async () => {}`

**Code Style**

- Use TypeScript strictly - no `any` types
- Prefer `const` over `let`
- Use template literals for string concatenation
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Destructure props and objects for clarity

**Documentation**

- Add JSDoc comments for complex functions
- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes

### 13. Critical Don'ts

❌ **Never**:

- Change unnecessary logic/UI
- Break existing functionality
- Cause errors or performance issues
- Use hard-coded text (always use i18n)
- Create types in components
- Use fetch directly in components
- Use arbitrary Tailwind values
- Install dependencies without checking existing ones
- Leave incomplete code or TODOs
- Refresh the page for state updates
- Use Framer Motion or heavy animation libraries

### 14. Git Commit Guidelines

- Write clear, descriptive commit messages
- Use conventional commits format when possible
- Keep commits focused and atomic

## Response Format

When responding to requests:

1. **Think step-by-step** - describe your plan in pseudocode
2. **Confirm** understanding before implementing
3. **Write complete code** - verify thoroughly before submission
4. **Include all imports** and ensure proper component naming
5. **Be concise** - minimize unnecessary prose
6. **State uncertainty** - if you don't know, say so

## Summary

Build ultra-performant, maintainable React applications that are:

- **Consistent** - follow established patterns
- **Complete** - no placeholders or TODOs
- **Accessible** - WCAG compliant
- **Internationalized** - fully translated
- **Type-safe** - strict TypeScript
- **Fast** - optimized for performance
- **Reactive** - instant updates without refreshes

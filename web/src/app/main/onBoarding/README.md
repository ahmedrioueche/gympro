# Web Onboarding Page

This directory contains the onboarding flow for the GymPro web application.

## Components

### OnBoardingPage.tsx

The main onboarding page component that handles the complete onboarding flow with 4 slides:

1. **Welcome Slide** - Introduction to GymPro with app branding
2. **Features Slide** - Showcases key features of the app in a grid layout
3. **Roles Slide** - Allows users to select their role (Owner, Coach, Member)
4. **Get Started Slide** - Final slide encouraging users to begin using the app

## Features

- **Multi-language Support** - Full i18n support for English and Arabic
- **Role Selection** - Users can select their role during onboarding
- **Smooth Navigation** - Horizontal scrolling with page indicators
- **Skip Option** - Users can skip onboarding at any time
- **Persistent State** - Onboarding completion and role selection are stored in localStorage
- **Responsive Design** - Optimized for desktop and mobile devices
- **Dark Mode Support** - Full theme support
- **Modern UI** - Beautiful cards, animations, and hover effects

## Usage

The onboarding page is automatically shown to new users and can be reset for testing purposes.

### Testing Onboarding

To test the onboarding flow, you can reset the onboarding state:

```typescript
import { useOnboarding } from '../context/OnboardingContext';

const { resetOnboarding } = useOnboarding();

// Reset onboarding to show it again
resetOnboarding();
```

## Integration

The onboarding is integrated into the main app navigation flow using:

- `OnboardingContext` - Manages onboarding state
- `OnboardingGuard` - Wraps the app and shows onboarding if not completed
- `localStorage` - Persists onboarding completion status

## Navigation Flow

```
App Start → OnboardingGuard → OnBoardingPage (if not completed) → Login → Dashboard
```

## Translations

All text content is managed through the i18n system with keys under `onboarding.*` in the translation files.

## UI Components

- `PageIndicator` - Visual progress indicators
- `FeatureCard` - Feature showcase cards with hover effects
- `RoleCard` - Interactive role selection cards
- `Icon` - Consistent emoji-based icon system
- `Button` - Styled buttons with variants and states

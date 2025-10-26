# Web Onboarding Flow Diagram

```
App Start
    ↓
OnboardingGuard Check
    ↓
┌─────────────────────────────────────┐
│         Onboarding Page            │
│                                     │
│  Slide 1: Welcome                  │
│  ┌─────────────────────────────┐   │
│  │  🏋️ GymPro Logo            │   │
│  │  Welcome to GymPro          │   │
│  │  Your complete gym solution │   │
│  └─────────────────────────────┘   │
│                                     │
│  Slide 2: Features (Grid Layout)   │
│  ┌─────────────────────────────┐   │
│  │  👥 Member Management       │   │
│  │  🏃‍♂️ Coaching System        │   │
│  │  💳 Payment Processing      │   │
│  │  📊 Analytics & Reports     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Slide 3: Role Selection (3 Cards) │
│  ┌─────────────────────────────┐   │
│  │  👑 Gym Owner              │   │
│  │  🏃‍♂️ Coach                 │   │
│  │  👤 Member                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  Slide 4: Get Started              │
│  ┌─────────────────────────────┐   │
│  │  🚀 Ready to Get Started?   │   │
│  │  Join thousands of gym      │   │
│  │  owners who trust GymPro    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Skip] [Previous] [Next/Get Started] │
└─────────────────────────────────────┘
    ↓
Store in localStorage
    ↓
Navigate to Login
    ↓
Dashboard (based on role)
```

## Web-Specific Features

### Layout

- **Split Layout** - Hero section on left, onboarding content on right
- **Responsive Grid** - Features in 2x2 grid, roles in 3-column layout
- **Smooth Scrolling** - Horizontal scroll with snap behavior
- **Modern Cards** - Hover effects and smooth transitions

### Navigation

1. **App Launch** → OnboardingGuard checks localStorage
2. **Onboarding Check** → If not completed, show onboarding page
3. **Onboarding Slides** → User navigates through 4 slides with role selection
4. **Completion** → Store in localStorage and navigate to login
5. **Login** → Show login page for authentication
6. **Dashboard** → Route to appropriate dashboard based on user role

### State Management

- **OnboardingContext** - React context for state management
- **localStorage** - Persistent storage for completion status
- **TanStack Router** - Navigation and routing
- **i18n** - Internationalization support

### Key Differences from Mobile

- **Larger Screen Real Estate** - More content visible at once
- **Grid Layouts** - Better use of horizontal space
- **Hover Effects** - Interactive elements with hover states
- **Desktop Navigation** - Mouse-based interactions
- **Split Layout** - Hero section alongside content

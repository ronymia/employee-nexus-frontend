# Copilot Instructions for Employee Nexus Frontend

You are working on the Employee Nexus Frontend project, a Next.js 14+ application with TypeScript, GraphQL, and Tailwind CSS.

## Critical Naming Rules

### Interfaces & Types

- **ALWAYS** prefix all interfaces with `I`
- **ALWAYS** prefix all types representing object shapes with `I`
- Examples:
  - `interface IUserProps { ... }`
  - `interface IUser { ... }`
  - `type ITableConfig = { ... }`
- **NEVER** create interfaces without the `I` prefix

## Animation Requirements

### Framer Motion is REQUIRED

- **ALWAYS** use Framer Motion for animations
- Import: `import { motion } from "motion/react"`
- **DO NOT** use other animation libraries (anime.js, GSAP)
- Use CSS animations only for simple hover states

### Animation Patterns

```tsx
// Use variants for reusable animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
```

## Code Style

### Comments

- Use UPPERCASE comments for major sections:
  ```tsx
  // ==================== GRAPHQL QUERY: FETCH USERS ====================
  // ==================== COMPONENT ====================
  ```

### Component Structure

```tsx
"use client";

import { ... } from "...";

// ==================== INTERFACES ====================
interface IComponentProps {
  // props
}

// ==================== COMPONENT ====================
export default function ComponentName({ ...props }: IComponentProps) {
  // ==================== HOOKS ====================

  // ==================== HANDLERS ====================

  // ==================== RENDER ====================
  return <div>...</div>;
}
```

## Styling

### Tailwind CSS

- Primary framework: Tailwind CSS with DaisyUI
- **IMPORTANT**: Use `bg-linear-to-r` instead of `bg-gradient-to-r`
  - ✅ `bg-linear-to-br from-blue-50 to-blue-100`
  - ❌ `bg-gradient-to-br from-blue-50 to-blue-100`

## GraphQL

### Naming

- Use UPPER_SNAKE_CASE: `GET_USERS`, `CREATE_EMPLOYEE`

### Typing

```tsx
const { data, loading } = useQuery<{
  users: {
    data: IUser[];
    meta: IMeta;
  };
}>(GET_USERS);
```

## Import Order

1. React & Next.js
2. External libraries (Apollo, Framer Motion, etc.)
3. Internal components
4. Types/Interfaces
5. Constants
6. GraphQL queries

## Best Practices

### Type Safety

- **NEVER** use `any` unless absolutely necessary
- Prefer `unknown` over `any`

### Loading States

- Use skeleton loaders with Framer Motion
- **NEVER** use simple spinners for table/list loading

### Tables

- Always use the `CustomTable` component
- Implement mobile responsive card view

## Anti-Patterns to AVOID

- ❌ Interfaces without `I` prefix
- ❌ Using `any` type
- ❌ CSS animations instead of Framer Motion
- ❌ Using `bg-gradient-*` instead of `bg-linear-*`
- ❌ Inline styles
- ❌ Magic numbers

## Business Logic Separation (CRITICAL)

### Architecture Rules

**ALWAYS** separate business logic from UI components:

- ✅ Business logic goes in `/services` (platform-agnostic)
- ✅ React integration goes in `/hooks`
- ✅ Components are UI-only
- ✅ NO business logic in components
- ✅ NO direct GraphQL calls in components

### Service Layer

Create services for business logic:

```tsx
// ✅ GOOD: services/attendance/attendanceService.ts
export class AttendanceService {
  static calculateWorkHours(punchIn: Date, punchOut: Date): number {
    const diff = punchOut.getTime() - punchIn.getTime();
    return diff / (1000 * 60 * 60);
  }

  static validateAttendance(data: IAttendanceInput): IValidationResult {
    if (!data.punchIn) {
      return { valid: false, error: "Required field" };
    }
    return { valid: true };
  }
}
```

### Custom Hooks Layer

Integrate services with React:

```tsx
// ✅ GOOD: hooks/useAttendance.ts
import { useState } from "react";
import { AttendanceService } from "@/services/attendance/attendanceService";

export function useAttendance() {
  const [isProcessing, setIsProcessing] = useState(false);

  const submitAttendance = async (data: IAttendanceInput) => {
    setIsProcessing(true);
    try {
      // USE SERVICE
      const validation = AttendanceService.validateAttendance(data);
      if (!validation.valid) throw new Error(validation.error);

      const hours = AttendanceService.calculateWorkHours(
        data.punchIn,
        data.punchOut
      );

      // Save to backend...
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitAttendance, isProcessing };
}
```

### Component Layer

Components use hooks only:

```tsx
// ✅ GOOD: Component uses hook
export default function AttendancePage() {
  const { submitAttendance, isProcessing } = useAttendance();

  return <form onSubmit={submitAttendance}>...</form>;
}

// ❌ BAD: Business logic in component
export default function AttendancePage() {
  const handleSubmit = (data) => {
    const diff = data.punchOut - data.punchIn; // ❌ Business logic
    // ...
  };
}
```

### Folder Structure

```
src/
├── services/        # Pure business logic (platform-agnostic)
├── hooks/           # React integration (uses services)
├── components/      # UI only (uses hooks)
├── app/             # Pages (uses hooks + components)
└── utils/           # Pure helpers (no business logic)
```

### What Goes Where

- **Services**: Calculations, validations, transformations, business rules
- **Hooks**: React state, GraphQL integration, side effects
- **Components**: UI rendering, user interactions
- **Utils**: Formatters, validators, constants (no domain logic)

## Quick Checklist

When generating code:

1. ✅ All interfaces start with `I`
2. ✅ Use Framer Motion for animations
3. ✅ Add UPPERCASE section comments
4. ✅ Use Tailwind CSS classes
5. ✅ Type all GraphQL queries/mutations
6. ✅ Follow component structure pattern
7. ✅ **Business logic in services**
8. ✅ **React integration in hooks**
9. ✅ **Components use hooks only**
10. ✅ **NO business logic in components**

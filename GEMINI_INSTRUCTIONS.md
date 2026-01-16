# Gemini AI Instructions for Employee Nexus Frontend

You are working on the Employee Nexus Frontend project, a Next.js 14+ application with TypeScript, GraphQL, and Tailwind CSS.

## Critical Naming Rules

### Interfaces & Types

- **ALWAYS** prefix all interfaces with `I`
- **ALWAYS** prefix all types representing object shapes with `I`
- Examples:
  - ✅ `interface IUserProps { ... }`
  - ✅ `interface IEmployee { ... }`
  - ✅ `type ITableConfig = { ... }`
- **NEVER** create interfaces without the `I` prefix

## Business Logic Separation (CRITICAL)

### Architecture Philosophy

**CRITICAL**: Separate business logic from UI components for:

- ✅ Code reusability across web and React Native apps
- ✅ Easier testing and maintenance
- ✅ Clear separation of concerns
- ✅ Shared logic between platforms

### Folder Structure

```
src/
├── services/          # 🔥 Pure business logic (platform-agnostic)
│   ├── attendance/
│   │   ├── attendanceService.ts
│   │   └── attendanceValidation.ts
│   ├── employee/
│   └── auth/
├── hooks/             # 🔥 React integration layer
│   ├── useAttendance.ts
│   ├── useEmployeeData.ts
│   └── useAuth.ts
├── components/        # UI only
├── app/               # Pages (UI only)
├── graphql/           # GraphQL queries/mutations
├── utils/             # Pure helpers (no business logic)
└── types/             # TypeScript interfaces
```

### What Goes Where

#### ✅ Services (`/services`)

- Business calculations
- Business validation rules
- Data transformations
- Business state machines
- Domain-specific logic
- **Platform-agnostic** (works in web & React Native)
- Use static class methods or pure functions

#### ✅ Hooks (`/hooks`)

- React integration layer
- GraphQL mutations/queries integration
- React state management
- Side effects (useEffect)
- **React-specific** (uses React APIs)
- Import and use services

#### ✅ Utils (`/utils`)

- Pure helper functions
- Formatters (dates, currency)
- Validators (email, phone)
- Constants
- **No business logic**

#### ✅ Components (`/components`, `/app`)

- UI rendering only
- User interactions
- Event handlers (call hooks)
- **No business logic**
- **No direct GraphQL calls**
- Use hooks exclusively

### Service Layer Pattern

```tsx
// ✅ GOOD: services/attendance/attendanceService.ts
export class AttendanceService {
  // CALCULATE WORK HOURS
  static calculateWorkHours(punchIn: Date, punchOut: Date): number {
    const diff = punchOut.getTime() - punchIn.getTime();
    return diff / (1000 * 60 * 60);
  }

  // VALIDATE ATTENDANCE
  static validateAttendance(data: IAttendanceInput): IValidationResult {
    if (!data.punchIn) {
      return { valid: false, error: "Punch in time required" };
    }
    return { valid: true };
  }
}
```

### Custom Hooks Pattern

```tsx
// ✅ GOOD: hooks/useAttendance.ts
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { AttendanceService } from "@/services/attendance/attendanceService";

export function useAttendance() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);

  const submitAttendance = async (data: IAttendanceInput) => {
    setIsProcessing(true);
    try {
      // USE SERVICE FOR VALIDATION
      const validation = AttendanceService.validateAttendance(data);
      if (!validation.valid) throw new Error(validation.error);

      // USE SERVICE FOR CALCULATION
      const hours = AttendanceService.calculateWorkHours(
        data.punchIn,
        data.punchOut
      );

      // SAVE TO BACKEND
      await createAttendance({ variables: { ...data, workHours: hours } });
    } finally {
      setIsProcessing(false);
    }
  };

  return { submitAttendance, isProcessing };
}
```

### Component Pattern

```tsx
// ✅ GOOD: Component uses hook only
export default function AttendancePage() {
  // USE HOOK FOR BUSINESS LOGIC
  const { submitAttendance, isProcessing } = useAttendance();

  // UI-ONLY LOGIC
  const handleSubmit = async (formData: IFormData) => {
    await submitAttendance(formData);
  };

  // RENDER UI
  return <form onSubmit={handleSubmit}>...</form>;
}

// ❌ BAD: Business logic in component
export default function AttendancePage() {
  const handleSubmit = (data) => {
    // ❌ Business logic in component
    const diff = data.punchOut.getTime() - data.punchIn.getTime();
    const hours = diff / (1000 * 60 * 60);
    // ...
  };
}
```

## Animation Standards

### Required: Framer Motion

- **ALWAYS** use Framer Motion for animations
- Import: `import { motion } from "motion/react"`
- **DO NOT** use other animation libraries (anime.js, GSAP)
- Use CSS animations only for simple hover states

### Animation Patterns

```tsx
// ✅ GOOD: Use variants for reusable animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => <motion.div variants={itemVariants}>{item}</motion.div>)}
</motion.div>

// ❌ BAD: Inline animation objects
<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
```

## Code Style

### Comments

- Use **UPPERCASE comments** for major sections:

```tsx
// ==================== GRAPHQL QUERY: FETCH USERS ====================
// ==================== INTERFACES ====================
// ==================== COMPONENT ====================
// ==================== HOOKS ====================
// ==================== HANDLERS ====================
// ==================== RENDER ====================
```

### Component Structure

```tsx
"use client";

import { ... } from "...";

// ==================== INTERFACES ====================
interface IComponentProps {
  // props
}

// ==================== SUB-COMPONENT (if needed) ====================
function SubComponent() {
  return <div>...</div>;
}

// ==================== COMPONENT ====================
export default function ComponentName({ ...props }: IComponentProps) {
  // ==================== HOOKS ====================
  const [state, setState] = useState();

  // ==================== HANDLERS ====================
  const handleClick = () => { ... };

  // ==================== RENDER ====================
  return <div>...</div>;
}
```

### Sub-Components

- **Sub-component means in the same file**
- Create helper components above the main component
- Prefix with component name if needed (e.g., `AttendanceCardSkeleton`)

## Styling

### Tailwind CSS

- Primary framework: Tailwind CSS with DaisyUI
- **IMPORTANT**: Use `bg-linear-to-r` instead of `bg-gradient-to-r`
  - ✅ `bg-linear-to-br from-blue-50 to-blue-100`
  - ❌ `bg-gradient-to-br from-blue-50 to-blue-100`
- **IMPORTANT**: Use `shrink-0` instead of `flex-shrink-0`
  - ✅ `shrink-0`
  - ❌ `flex-shrink-0`
- NO inline styles

## GraphQL

### Naming

- Use UPPER_SNAKE_CASE: `GET_USERS`, `CREATE_EMPLOYEE`, `UPDATE_USER_STATUS`

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
2. External libraries (Apollo, Framer Motion, React Icons)
3. Internal components
4. Types/Interfaces
5. Constants
6. GraphQL queries

```tsx
// 1. React/Next
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useQuery } from "@apollo/client";
import { motion } from "motion/react";

// 3. Components
import CustomTable from "@/components/table/CustomTable";
import PageHeader from "@/components/ui/PageHeader";

// 4. Types
import type { IEmployee, ITableConfig } from "@/types";

// 5. Constants
import { Permissions } from "@/constants/permissions.constant";

// 6. GraphQL
import { GET_USERS } from "@/graphql/user.api";
```

## Best Practices

### Type Safety

- **NEVER** use `any` unless absolutely necessary
- Prefer `unknown` over `any`
- Use type guards for runtime type checking

### Loading States

- Use skeleton loaders with Framer Motion
- **NEVER** use simple spinners for table/list loading
- Match skeleton structure to actual content
- Implement stagger animations for lists

### Error Handling

- Always handle GraphQL errors
- Use try-catch for async operations
- Provide user feedback via toast notifications

### Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper heading hierarchy

### Performance

- Use `useMemo` for expensive computations
- Use `useCallback` for memoized callbacks
- Implement proper loading states

## Anti-Patterns to AVOID

- ❌ Interfaces without `I` prefix
- ❌ Using `any` type
- ❌ Business logic in components
- ❌ Direct GraphQL calls in components
- ❌ CSS animations instead of Framer Motion
- ❌ Using `bg-gradient-*` instead of `bg-linear-*`
- ❌ Using `flex-shrink-0` instead of `shrink-0`
- ❌ Inline styles
- ❌ Magic numbers
- ❌ Deeply nested ternaries

## Quick Checklist

When generating code:

1. ✅ All interfaces start with `I`
2. ✅ Business logic in `/services` (platform-agnostic)
3. ✅ React integration in `/hooks` (uses services)
4. ✅ Components use hooks only (NO business logic)
5. ✅ NO direct GraphQL calls in components
6. ✅ Use Framer Motion for animations
7. ✅ Add UPPERCASE section comments
8. ✅ Use `bg-linear-*` not `bg-gradient-*`
9. ✅ Use `shrink-0` not `flex-shrink-0`
10. ✅ Type all GraphQL queries/mutations
11. ✅ Follow component structure pattern
12. ✅ Use semantic HTML
13. ✅ Implement skeleton loaders (not spinners)
14. ✅ Sub-components in same file

---

**These rules ensure consistency, maintainability, cross-platform reusability, and professional quality across the codebase.**

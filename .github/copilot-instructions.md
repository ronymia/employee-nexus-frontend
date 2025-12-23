# Copilot Instructions for Employee Nexus Frontend

You are working on the Employee Nexus Frontend project, a Next.js 14+ application with TypeScript, GraphQL, and Tailwind CSS.

## Critical Naming Rules

### Interfaces & Types

- **ALWAYS** prefix all interfaces with `I`
- **ALWAYS** prefix all types representing object shapes with `I`
- Examples:
  - `interface IUserProps { ... }`
  - `interface IEmployee { ... }`
  - `type ITableConfig = { ... }`
- **NEVER** create interfaces without the `I` prefix

## Animation Requirements

### Framer Motion is REQUIRED

- **ALWAYS** use Framer Motion for animations
- Import: `import { motion } from "framer-motion"`
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

## Quick Checklist

When generating code:

1. ✅ All interfaces start with `I`
2. ✅ Use Framer Motion for animations
3. ✅ Add UPPERCASE section comments
4. ✅ Use Tailwind CSS classes
5. ✅ Type all GraphQL queries/mutations
6. ✅ Follow component structure pattern

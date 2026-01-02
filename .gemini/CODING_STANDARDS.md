# Universal Coding Standards for Next.js/React/TypeScript Projects

General coding standards and architectural patterns for modern web applications using Next.js, React, TypeScript, and GraphQL.

## Critical Naming Rules

### Interfaces & Types

- **ALWAYS** prefix all interfaces with `I`
- **ALWAYS** prefix all types representing object shapes with `I`
- Examples:
  - ✅ `interface IUserProps { ... }`
  - ✅ `interface IProduct { ... }`
  - ✅ `type ITableConfig = { ... }`
- **NEVER** create interfaces without the `I` prefix

## Business Logic Separation (CRITICAL)

### Architecture Philosophy

**CRITICAL**: Separate business logic from UI components for:

- ✅ Code reusability across web and mobile apps (React Native)
- ✅ Easier testing and maintenance
- ✅ Clear separation of concerns
- ✅ Shared logic between platforms

### Folder Structure

```
src/
├── services/          # 🔥 Pure business logic (platform-agnostic)
│   ├── domain1/
│   │   ├── service.ts
│   │   └── validation.ts
│   ├── domain2/
│   └── auth/
├── hooks/             # 🔥 React integration layer
│   ├── useDomain1.ts
│   ├── useDomain2.ts
│   └── useAuth.ts
├── components/        # UI only
├── app/               # Pages (UI only)
├── graphql/           # GraphQL queries/mutations (or API calls)
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
- API/GraphQL mutations/queries integration
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
- **No direct API/GraphQL calls**
- Use hooks exclusively

### Service Layer Pattern

```tsx
// ✅ GOOD: services/cart/cartService.ts
export class CartService {
  // CALCULATE TOTAL
  static calculateTotal(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // VALIDATE CART
  static validateCart(items: ICartItem[]): IValidationResult {
    if (items.length === 0) {
      return { valid: false, error: "Cart is empty" };
    }
    return { valid: true };
  }

  // APPLY DISCOUNT
  static applyDiscount(total: number, discountPercent: number): number {
    return total * (1 - discountPercent / 100);
  }
}
```

### Custom Hooks Pattern

```tsx
// ✅ GOOD: hooks/useCart.ts
import { useState } from "react";
import { useMutation } from "@apollo/client"; // or fetch/axios
import { CartService } from "@/services/cart/cartService";

export function useCart() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkout] = useMutation(CHECKOUT_MUTATION);

  const processCheckout = async (items: ICartItem[]) => {
    setIsProcessing(true);
    try {
      // USE SERVICE FOR VALIDATION
      const validation = CartService.validateCart(items);
      if (!validation.valid) throw new Error(validation.error);

      // USE SERVICE FOR CALCULATION
      const total = CartService.calculateTotal(items);

      // SAVE TO BACKEND
      await checkout({ variables: { items, total } });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processCheckout, isProcessing };
}
```

### Component Pattern

```tsx
// ✅ GOOD: Component uses hook only
export default function CheckoutPage() {
  // USE HOOK FOR BUSINESS LOGIC
  const { processCheckout, isProcessing } = useCart();

  // UI-ONLY LOGIC
  const handleCheckout = async () => {
    await processCheckout(cartItems);
  };

  // RENDER UI
  return <button onClick={handleCheckout}>Checkout</button>;
}

// ❌ BAD: Business logic in component
export default function CheckoutPage() {
  const handleCheckout = () => {
    // ❌ Business logic in component
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
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
    transition: { staggerChildren: 0.1 },
  },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div variants={itemVariants}>{item}</motion.div>
  ))}
</motion.div>;
```

## Code Style

### Comments

- Use **UPPERCASE comments** for major sections:

```tsx
// ==================== API QUERY: FETCH DATA ====================
// ==================== INTERFACES ====================
// ==================== COMPONENT ====================
// ==================== HOOKS ====================
// ==================== HANDLERS ====================
// ==================== RENDER ====================
```

### Component Structure

```tsx
"use client"; // For Next.js client components

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
- Prefix with component name if needed (e.g., `ProductCardSkeleton`)

## Styling

### Tailwind CSS

- Use Tailwind CSS as primary styling framework
- **IMPORTANT**: Use `bg-linear-to-r` instead of `bg-gradient-to-r` (if using custom config)
  - ✅ `bg-linear-to-br from-blue-50 to-blue-100`
  - ❌ `bg-gradient-to-br from-blue-50 to-blue-100`
- **IMPORTANT**: Use `shrink-0` instead of `flex-shrink-0`
  - ✅ `shrink-0`
  - ❌ `flex-shrink-0`
- NO inline styles

## GraphQL / API

### Naming

- Use UPPER_SNAKE_CASE for queries and mutations:
  - ✅ `GET_USERS`, `CREATE_ORDER`, `UPDATE_PROFILE`
  - ❌ `getUsers`, `createOrder`

### Typing

```tsx
// GraphQL
const { data, loading } = useQuery<{
  users: {
    data: IUser[];
    meta: IMeta;
  };
}>(GET_USERS);

// REST API
const { data } = useSWR<IUser[]>("/api/users");
```

## Import Order

1. React & Next.js
2. External libraries
3. Internal components
4. Types/Interfaces
5. Constants
6. API/GraphQL queries

```tsx
// 1. React/Next
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useQuery } from "@apollo/client";
import { motion } from "motion/react";

// 3. Components
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// 4. Types
import type { IUser, IProduct } from "@/types";

// 5. Constants
import { API_ENDPOINTS } from "@/constants";

// 6. API/GraphQL
import { GET_USERS } from "@/graphql/queries";
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

- Always handle API/GraphQL errors
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
- Lazy load components when appropriate

## Anti-Patterns to AVOID

- ❌ Interfaces without `I` prefix
- ❌ Using `any` type
- ❌ Business logic in components
- ❌ Direct API/GraphQL calls in components
- ❌ CSS animations instead of Framer Motion
- ❌ Using `bg-gradient-*` instead of `bg-linear-*`
- ❌ Using `flex-shrink-0` instead of `shrink-0`
- ❌ Inline styles
- ❌ Magic numbers
- ❌ Deeply nested ternaries

## Cross-Platform Development

### For React Native Compatibility

When planning to share code with React Native:

1. ✅ Keep business logic in `/services` (platform-agnostic)
2. ✅ Create separate hooks for web and mobile if needed
3. ✅ Use platform-agnostic utilities
4. ✅ Avoid web-specific APIs in services

```tsx
// ✅ GOOD: Reusable service
export class ProductService {
  static calculateDiscount(price: number, percent: number): number {
    return price * (1 - percent / 100);
  }
}

// React Native can use the same service
import { ProductService } from "@/services/product/productService";
```

## Quick Checklist

When generating code:

1. ✅ All interfaces start with `I`
2. ✅ Business logic in `/services` (platform-agnostic)
3. ✅ React integration in `/hooks` (uses services)
4. ✅ Components use hooks only (NO business logic)
5. ✅ NO direct API/GraphQL calls in components
6. ✅ Use Framer Motion for animations
7. ✅ Add UPPERCASE section comments
8. ✅ Use `bg-linear-*` not `bg-gradient-*`
9. ✅ Use `shrink-0` not `flex-shrink-0`
10. ✅ Type all API/GraphQL queries
11. ✅ Follow component structure pattern
12. ✅ Use semantic HTML
13. ✅ Implement skeleton loaders (not spinners)
14. ✅ Sub-components in same file

---

**These rules ensure consistency, maintainability, cross-platform reusability, and professional quality across all projects.**

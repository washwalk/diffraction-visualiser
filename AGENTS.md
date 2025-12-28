# AGENTS.md

This file contains essential information for agentic coding agents working on this diffraction-visualiser codebase. It includes build/lint/test commands, code style guidelines, and other conventions to follow.

## Project Overview

This is a Next.js-based web application for visualizing diffraction patterns, particularly Fraunhofer diffraction of a double slit. It uses React for the frontend, gpu.js for GPU-accelerated computations, and TypeScript for type safety.

## Build/Lint/Test Commands

### Build Commands

- **Development server**: `npm run dev` - Starts the Next.js development server on localhost:3000
- **Production build**: `npm run build` - Builds the application for production
- **Production start**: `npm run start` - Starts the production server after building

### Lint Commands

Currently, no linting scripts are defined in package.json. To add linting:

1. Install ESLint and TypeScript ESLint:
   ```
   npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
   ```

2. Create `.eslintrc.js`:
   ```javascript
   module.exports = {
     parser: '@typescript-eslint/parser',
     extends: [
       'eslint:recommended',
       '@typescript-eslint/recommended',
       'plugin:react/recommended',
       'plugin:react-hooks/recommended'
     ],
     settings: {
       react: {
         version: 'detect'
       }
     }
   };
   ```

3. Add to package.json scripts:
   ```json
   "lint": "eslint . --ext .ts,.tsx",
   "lint:fix": "eslint . --ext .ts,.tsx --fix"
   ```

4. Run linting: `npm run lint`

### Test Commands

No testing framework is currently set up. To add testing:

1. Install Jest and React Testing Library:
   ```
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

2. Create `jest.config.js`:
   ```javascript
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapping: {
       '^@/(.*)$': '<rootDir>/$1'
     }
   };
   ```

3. Create `jest.setup.js`:
   ```javascript
   import '@testing-library/jest-dom';
   ```

4. Add to package.json scripts:
   ```json
   "test": "jest",
   "test:watch": "jest --watch",
   "test:coverage": "jest --coverage"
   ```

5. **Run all tests**: `npm test`
6. **Run tests in watch mode**: `npm run test:watch`
7. **Run tests with coverage**: `npm run test:coverage`
8. **Run a single test file**: `npm test -- <filename>.test.tsx` or `jest <filename>.test.tsx`
9. **Run a specific test**: `npm test -- -t "test name"` or `jest -t "test name"`

Example test file structure:
```typescript
// components/DiffractionCanvas.test.tsx
import { render } from '@testing-library/react';
import { DiffractionCanvas } from './DiffractionCanvas';

test('renders canvas with data', () => {
  const mockData = [[1, 2], [3, 4]];
  render(<DiffractionCanvas data={mockData} />);
  // Add assertions
});
```

## Code Style Guidelines

### File Structure and Organization

- Use the Next.js app directory structure: `app/` for pages, `components/` for reusable components, `lib/` for utilities
- Keep components in `components/` directory with PascalCase filenames
- Utility functions in `lib/` directory with camelCase filenames
- Use TypeScript for all files (.ts/.tsx extensions)

### Imports

- Use ES6 import syntax
- Group imports: React imports first, then third-party libraries, then local imports
- Use `@/` alias for imports from the project root (configured in tsconfig.json)
- Prefer named imports over default imports for clarity
- No unused imports

Examples:
```typescript
// Good
import { useState, useEffect } from 'react';
import { GPU } from 'gpu.js';
import { doubleSlit } from '@/lib/apertures';
import { DiffractionCanvas } from '@/components/DiffractionCanvas';

// Avoid
import React from 'react';
import * as apertures from '@/lib/apertures';
```

### Exports

- Use named exports for functions and components
- Use default exports only for page components in Next.js
- Export types and interfaces alongside their implementations

Examples:
```typescript
// In lib/apertures.ts
export function doubleSlit(size: number): number[][] { ... }

// In components/DiffractionCanvas.tsx
export function DiffractionCanvas({ data }: { data: number[][] }) { ... }

// In app/page.tsx
export default function Home() { ... }
```

### Naming Conventions

- **Variables and functions**: camelCase
- **Components**: PascalCase
- **Types and interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: camelCase for utilities, PascalCase for components, kebab-case for pages if needed
- Use descriptive names; avoid abbreviations unless widely understood

Examples:
```typescript
// Good
const diffractionPattern: number[][] = [];
function calculateIntensity(aperture: number[][]): number[][] { ... }
interface DiffractionProps { data: number[][] }

// Avoid
const dp: number[][] = [];
function calcInt(ap: number[][]): number[][] { ... }
interface Props { d: number[][] }
```

### TypeScript Types

- Use explicit types for function parameters and return values
- Use interface for object shapes with multiple properties
- Use type for unions, intersections, or complex types
- Prefer readonly arrays and objects where appropriate
- Use utility types from TypeScript (e.g., `ReadonlyArray<T>`, `Partial<T>`)

Examples:
```typescript
// Function signatures
export function doubleSlit(size: number, slitWidth?: number): number[][];

// Interfaces
interface ApertureConfig {
  size: number;
  slitWidth: number;
  slitSeparation: number;
}

// Type aliases
type DiffractionData = ReadonlyArray<ReadonlyArray<number>>;
```

### Formatting

- Use 4 spaces for indentation (consistent with existing code)
- Max line length: 80-100 characters
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- Space after keywords (if, for, etc.)
- No semicolons (consistent with existing code)

Examples:
```typescript
// Good
if (condition) {
    doSomething();
}

const array = [
    'item1',
    'item2',
];

// Avoid
if(condition){doSomething()}
const array=['item1','item2'];
```

### React Patterns

- Use functional components with hooks
- Use 'use client' directive for client-side components
- Prefer custom hooks for reusable logic
- Use React.memo for expensive components if needed
- Handle side effects with useEffect

Examples:
```typescript
'use client';

import { useState, useEffect } from 'react';

export function DiffractionCanvas({ data }: { data: number[][] }) {
    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef) return;
        // Canvas logic here
    }, [data, canvasRef]);

    return <canvas ref={setCanvasRef} />;
}
```

### Error Handling

- Use try-catch blocks for operations that might fail
- Provide meaningful error messages
- Use TypeScript's non-null assertion operator (!) sparingly and only when certain
- Handle async operations with proper error boundaries in React

Examples:
```typescript
// Function with error handling
export function safeParseJSON(jsonString: string): object | null {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
    }
}

// React error boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
```

### Performance Considerations

- Use gpu.js for computationally intensive operations (as in fft.ts)
- Memoize expensive calculations with useMemo
- Avoid unnecessary re-renders by properly structuring dependencies
- Use React.lazy for code splitting if the app grows

### Security

- Validate and sanitize user inputs if any are added
- Use HTTPS in production
- Avoid exposing sensitive data in client-side code
- Follow Next.js security best practices

### Git and Version Control

- Use descriptive commit messages
- Follow conventional commits format if adopted
- Keep commits atomic and focused
- Use feature branches for new work

### Additional Tools and Dependencies

- **gpu.js**: For GPU-accelerated computations
- **Next.js**: Framework for React applications
- **React**: UI library
- **TypeScript**: Type checking

### Future Improvements

- Add unit tests for all components and utilities
- Implement error boundaries for better error handling
- Add loading states for async operations
- Consider adding more aperture types and visualization options
- Optimize canvas rendering for larger datasets

This guide should be updated as the project evolves and new conventions are established.
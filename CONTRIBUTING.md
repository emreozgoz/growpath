# 🤝 Contributing to GrowPath

First off, thank you for considering contributing to GrowPath! It's people like you that make GrowPath such a great tool for learners worldwide.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

**Our Pledge:**
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use the bug report template** when creating an issue
- **Describe the bug** clearly and concisely
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- **Use the feature request template**
- **Describe the problem** this feature would solve
- **Explain your proposed solution**
- **Consider alternatives** you've thought about
- **Add mockups or examples** if helpful

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with conventional commits
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- **Node.js**: 20 LTS or higher
- **PostgreSQL**: 16 or higher
- **Redis**: 7 or higher
- **Git**: Latest version
- **Docker**: Optional (for database setup)

### Installation Steps

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/growpath.git
cd growpath

# 2. Add upstream remote
git remote add upstream https://github.com/emreozgoz/growpath.git

# 3. Start databases (Docker method)
docker-compose up -d

# OR manually install PostgreSQL & Redis

# 4. Install frontend dependencies
cd frontend
npm install

# 5. Install backend dependencies
cd ../backend
npm install

# 6. Set up environment variables
cp ../.env.example .env
# Edit .env with your configuration

# 7. Run database migrations
npx prisma migrate dev

# 8. Seed database (optional)
npx prisma db seed

# 9. Start development servers

# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

### Verify Setup

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Development Workflow

### Branch Naming Convention

```
feature/short-description    # New features
fix/short-description        # Bug fixes
refactor/short-description   # Code refactoring
docs/short-description       # Documentation updates
test/short-description       # Test additions/updates
chore/short-description      # Maintenance tasks
```

**Examples:**
- `feature/ai-streaming-responses`
- `fix/signup-validation-bug`
- `refactor/ai-service-optimization`

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Rebase your feature branch
git checkout feature/your-feature
git rebase main
```

---

## Coding Standards

### TypeScript

- **Strict mode enabled**: All code must pass TypeScript strict checks
- **Explicit types**: Avoid `any`, use proper types or `unknown`
- **Interfaces over types**: For object shapes, prefer `interface`
- **Named exports**: Use named exports instead of default exports

**Example:**
```typescript
// ✅ Good
export interface User {
  id: string;
  email: string;
  tier: UserTier;
}

export function createUser(data: CreateUserInput): Promise<User> {
  // ...
}

// ❌ Bad
export default function(data: any) {
  // ...
}
```

### React Components

- **Functional components only**: Use hooks, no class components
- **TypeScript props**: Always type component props
- **Descriptive names**: Use PascalCase for components
- **Single responsibility**: One component, one purpose
- **Props interface**: Define at top of file

**Example:**
```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ variant, onClick, children, disabled = false }: ButtonProps) {
  return <button className={cn(styles[variant])} onClick={onClick} disabled={disabled}>
    {children}
  </button>;
}
```

### Styling (Tailwind CSS)

- **Use Tailwind utility classes**: Avoid custom CSS unless necessary
- **Consistent spacing**: Use Tailwind's spacing scale (4, 8, 12, 16, etc.)
- **Green theme**: Use `primary-*` color variables
- **Responsive**: Mobile-first approach (sm:, md:, lg:)

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md md:flex-row">
  <Button variant="primary" className="w-full md:w-auto">
    Get Started
  </Button>
</div>
```

### API Design

- **RESTful conventions**: Use standard HTTP methods
- **Versioned endpoints**: `/api/v1/...`
- **Validation**: Use Zod schemas for request validation
- **Error handling**: Consistent error response format
- **Type-safe**: Define request/response types

**Example:**
```typescript
// ✅ Good
import { z } from 'zod';

const CreatePathSchema = z.object({
  skill: z.string().min(1).max(100),
  duration_weeks: z.number().int().min(1).max(52),
  current_level: z.enum(['beginner', 'intermediate', 'advanced']),
});

router.post('/learning-paths', async (req, res) => {
  const validated = CreatePathSchema.parse(req.body);
  const path = await learningPathService.create(validated);
  res.json({ success: true, data: path });
});
```

### Linting & Formatting

- **ESLint**: All code must pass ESLint checks
- **Prettier**: Auto-format code before committing
- **Pre-commit hooks**: Husky runs linting automatically

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## Commit Guidelines

We follow **Conventional Commits** specification.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, configs)
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(onboarding): add skill selection step"

# Bug fix
git commit -m "fix(auth): resolve session expiration bug"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change learning path response format

BREAKING CHANGE: Learning path API now returns nested week structure"
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] New features have tests
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventional commits

### PR Title Format

Follow conventional commits format:

```
feat(scope): add amazing feature
fix(scope): resolve critical bug
docs: update contributing guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. **Automated checks run**: Linting, tests, build
2. **Code review**: At least one maintainer reviews
3. **Changes requested**: Address feedback if any
4. **Approval**: Maintainer approves PR
5. **Merge**: Squash and merge to main

---

## Testing Guidelines

### Test Coverage Requirements

- **Minimum coverage**: 80% overall
- **Critical paths**: 95%+ coverage
- **New features**: Must include tests

### Testing Stack

- **Unit Tests**: Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright
- **API Tests**: Supertest

### Writing Tests

**Unit Test Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateProgress } from './progress';

describe('calculateProgress', () => {
  it('should calculate progress correctly', () => {
    const result = calculateProgress(5, 10);
    expect(result).toBe(50);
  });

  it('should handle zero total tasks', () => {
    const result = calculateProgress(0, 0);
    expect(result).toBe(0);
  });
});
```

**Component Test Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.spec.ts

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

---

## Questions?

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Check existing issues or create a new one
- **Documentation**: Read the full docs in `/docs`

---

Thank you for contributing to GrowPath! 🌱

**Happy coding!** 💚

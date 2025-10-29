# Screen Board - Testing Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Getting Started](#getting-started)
- [Test Scripts](#test-scripts)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [BDD Style Guide](#bdd-style-guide)

---

## 🎯 Overview

This project uses **Vitest** and **React Testing Library** to ensure high-quality, maintainable code through comprehensive unit tests. Our tests are written following **Behavior-Driven Development (BDD)** principles, making them readable, self-documenting, and human-friendly.

### Testing Stack
- **Test Runner**: Vitest (v3.2.4)
- **Testing Library**: React Testing Library (@testing-library/react)
- **DOM Assertions**: @testing-library/jest-dom
- **User Interactions**: @testing-library/user-event
- **DOM Environment**: jsdom

---

## 🧠 Testing Philosophy

### BDD Principles

Our tests follow the **Given-When-Then** pattern, which makes them:

1. **Readable as Documentation** - Tests describe features in plain English
2. **Behavior-Focused** - We test what the component does, not how it does it
3. **User-Centric** - Tests reflect real-world user scenarios
4. **Maintainable** - Clear structure makes updates easier

### Test Structure

```javascript
describe('Feature: [Feature Name]', () => {
  describe('Scenario: [User Scenario]', () => {
    it('should [expected behavior]', () => {
      // Given: [Precondition]
      // When: [Action]
      // Then: [Expected outcome]
      expect(actual).toBe(expected)
    })
  })
})
```

---

## 🚀 Getting Started

### Installation

All testing dependencies are already installed. If you need to reinstall:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once (CI/CD mode)
npm run test:run

# Run tests with UI (opens browser interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

---

## 📝 Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm test` | `vitest` | Runs tests in watch mode - reruns on file changes |
| `npm run test:run` | `vitest run` | Runs tests once and exits - perfect for CI/CD |
| `npm run test:ui` | `vitest --ui` | Opens Vitest UI in browser for interactive testing |
| `npm run test:coverage` | `vitest run --coverage` | Generates test coverage report |

---

## 📊 Test Coverage

### Phase 1: App.jsx ✅ COMPLETE

**Status**: All tests passing (11/11)

#### Test Coverage Details:

- **Application Structure and Layout** (2 tests)
  - Main application container rendering
  - CSS class verification

- **Component Composition** (2 tests)
  - ScreenRotator component integration
  - Single instance validation

- **DOM Hierarchy** (1 test)
  - Proper component nesting

- **Rendering Consistency** (1 test)
  - Multiple mount reliability

- **Application Export** (2 tests)
  - Default export validation
  - React component verification

- **CSS Integration** (1 test)
  - Stylesheet import verification

- **Accessibility** (2 tests)
  - Semantic HTML structure
  - Keyboard navigation support

---

## 📖 Writing Tests

### Example: Testing a Component

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent.jsx'

describe('MyComponent', () => {
  describe('Feature: User Interaction', () => {
    describe('Scenario: When a user clicks the button', () => {
      beforeEach(() => {
        render(<MyComponent />)
      })

      it('should display a success message', () => {
        // Given: A user is viewing the component
        const button = screen.getByRole('button', { name: /submit/i })
        
        // When: The user clicks the submit button
        button.click()
        
        // Then: A success message should appear
        const message = screen.getByText(/success/i)
        expect(message).toBeInTheDocument()
      })
    })
  })
})
```

### Mocking Components

To isolate component testing, we mock child components:

```javascript
import { vi } from 'vitest'

vi.mock('./components/ChildComponent.jsx', () => ({
  default: () => <div data-testid="child-component">Mocked Child</div>
}))
```

---

## 🎨 BDD Style Guide

### Feature Structure

Each test file should be organized by **Features** → **Scenarios** → **Test Cases**

```javascript
describe('ComponentName', () => {
  describe('Feature: Authentication', () => {
    describe('Scenario: When user logs in with valid credentials', () => {
      it('should display the dashboard', () => { /* ... */ })
      it('should store the auth token', () => { /* ... */ })
      it('should show user profile', () => { /* ... */ })
    })
    
    describe('Scenario: When user logs in with invalid credentials', () => {
      it('should display an error message', () => { /* ... */ })
      it('should not store any auth token', () => { /* ... */ })
      it('should remain on login page', () => { /* ... */ })
    })
  })
})
```

### Naming Conventions

✅ **DO**: Use descriptive, behavior-focused names
```javascript
it('should display error message when form is invalid')
it('should navigate to home page after successful login')
```

❌ **DON'T**: Use implementation-focused names
```javascript
it('calls setState with error')
it('renders div with class error')
```

### Comments in Tests

Always include Given-When-Then comments:

```javascript
it('should highlight the selected item', () => {
  // Given: A list of items is displayed
  render(<ItemList items={mockItems} />)
  
  // When: The user clicks on the second item
  const secondItem = screen.getAllByRole('listitem')[1]
  fireEvent.click(secondItem)
  
  // Then: The second item should have the 'selected' class
  expect(secondItem).toHaveClass('selected')
})
```

---

## 🔄 Testing Workflow

### Development Workflow

1. **Write the test first** (TDD approach)
   ```bash
   npm test
   ```

2. **Watch tests fail** (Red phase)

3. **Write minimal code to pass** (Green phase)

4. **Refactor with confidence** (Refactor phase)

5. **Commit when all tests pass**

### Before Committing

```bash
# Run all tests
npm run test:run

# Verify no errors
npm run lint

# Ensure build works
npm run build
```

---

## 🎓 Best Practices

### 1. Test Behavior, Not Implementation
✅ Test what users see and do  
❌ Don't test internal state or methods

### 2. Keep Tests Isolated
✅ Each test should be independent  
❌ Don't rely on test execution order

### 3. Use Descriptive Names
✅ `should display error when email is invalid`  
❌ `test1`, `checkEmail`

### 4. Follow AAA Pattern
- **Arrange**: Set up test data
- **Act**: Execute the behavior
- **Assert**: Verify the outcome

### 5. Mock External Dependencies
✅ Mock child components, APIs, and external services  
❌ Don't test external libraries

---

## 🐛 Troubleshooting

### Tests Not Running?

1. Check if test files match pattern: `*.test.jsx` or `*.spec.jsx`
2. Verify vitest.config.js is properly configured
3. Ensure all dependencies are installed: `npm install`

### Import Errors?

- Use `.jsx` extensions in imports: `import App from './App.jsx'`
- Check that paths are relative to the test file location
- Verify mocked components use correct paths

### Tests Failing Randomly?

- Check for async operations that need `await`
- Use `waitFor()` for elements that appear after effects
- Ensure tests are isolated (no shared state)

---

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)

---

## 🎯 Next Steps

**Phase 2**: Component Testing (Coming Soon)
- ScreenRotator.jsx
- Header.jsx
- Footer.jsx
- Slide components

**Phase 3**: Integration Testing
- Full screen rotation flow
- User interaction scenarios
- Data loading and display

---

**Remember**: Tests are living documentation. Write them as if you're explaining the feature to a new team member! 📖✨


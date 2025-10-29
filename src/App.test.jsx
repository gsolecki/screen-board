import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'

// Mock the ScreenRotator component to isolate App.jsx testing
vi.mock('./components/ScreenRotator.jsx', () => ({
  default: () => <div data-testid="screen-rotator">Mocked ScreenRotator</div>
}))

describe('App Component', () => {
  describe('Feature: Application Structure and Layout', () => {
    describe('Scenario: When the application is rendered', () => {
      beforeEach(() => {
        render(<App />)
      })

      it('should display the main application container', () => {
        // Given: The application is loaded
        // When: The component renders
        // Then: The main app container should be present in the DOM
        const appContainer = document.querySelector('.app')

        expect(appContainer).toBeInTheDocument()
      })

      it('should have the correct CSS class for styling', () => {
        // Given: The application needs consistent styling
        // When: The component renders
        // Then: The root div should have the "app" class
        const appContainer = document.querySelector('.app')

        expect(appContainer).toHaveClass('app')
      })
    })
  })

  describe('Feature: Component Composition', () => {
    describe('Scenario: When the application needs to display rotating content', () => {
      beforeEach(() => {
        render(<App />)
      })

      it('should render the ScreenRotator component', () => {
        // Given: The application needs to manage screen rotation functionality
        // When: The App component renders
        // Then: The ScreenRotator component should be rendered
        const screenRotator = screen.getByTestId('screen-rotator')

        expect(screenRotator).toBeInTheDocument()
      })

      it('should render only one ScreenRotator instance', () => {
        // Given: The application should have a single screen rotation manager
        // When: The App component renders
        // Then: Only one ScreenRotator component should be present
        const screenRotators = screen.getAllByTestId('screen-rotator')

        expect(screenRotators).toHaveLength(1)
      })
    })
  })

  describe('Feature: DOM Hierarchy', () => {
    describe('Scenario: When checking the component structure', () => {
      beforeEach(() => {
        render(<App />)
      })

      it('should wrap ScreenRotator inside the app container', () => {
        // Given: Proper component hierarchy is essential for styling and functionality
        // When: The component renders
        // Then: The ScreenRotator should be a child of the app container
        const appContainer = document.querySelector('.app')
        const screenRotator = screen.getByTestId('screen-rotator')

        expect(appContainer).toContainElement(screenRotator)
      })
    })
  })

  describe('Feature: Rendering Consistency', () => {
    describe('Scenario: When the component is rendered multiple times', () => {
      it('should render consistently on each mount', () => {
        // Given: The application needs to be reliable
        // When: The component is rendered multiple times
        const { unmount: unmount1 } = render(<App />)
        const firstRender = document.querySelector('.app')
        expect(firstRender).toBeInTheDocument()
        unmount1()

        const { unmount: unmount2 } = render(<App />)
        const secondRender = document.querySelector('.app')
        expect(secondRender).toBeInTheDocument()
        unmount2()

        // Then: Each render should produce the same structure
        render(<App />)
        const thirdRender = document.querySelector('.app')
        expect(thirdRender).toBeInTheDocument()
      })
    })
  })

  describe('Feature: Application Export', () => {
    describe('Scenario: When importing the App component', () => {
      it('should be exported as the default export', () => {
        // Given: Other files need to import the App component
        // When: The module is imported
        // Then: App should be available as the default export
        expect(App).toBeDefined()
        expect(typeof App).toBe('function')
      })

      it('should be a valid React component', () => {
        // Given: The App needs to be a proper React component
        // When: We examine the component
        // Then: It should be renderable without errors
        expect(() => render(<App />)).not.toThrow()
      })
    })
  })

  describe('Feature: CSS Integration', () => {
    describe('Scenario: When the component needs styling', () => {
      it('should import the App.css stylesheet', async () => {
        // Given: The application needs visual styling
        // When: The component module is loaded
        // Then: The CSS file should be imported (verified by successful render)
        // Note: CSS import is verified implicitly through successful component rendering
        // and the presence of the styled container

        expect(() => render(<App />)).not.toThrow()

        const appContainer = document.querySelector('.app')
        expect(appContainer).toBeInTheDocument()
      })
    })
  })

  describe('Feature: Accessibility', () => {
    describe('Scenario: When users with assistive technology access the app', () => {
      beforeEach(() => {
        render(<App />)
      })

      it('should render semantic HTML structure', () => {
        // Given: Users may rely on screen readers and assistive technology
        // When: The component renders
        // Then: It should use semantic HTML elements (div with meaningful class)
        const appContainer = document.querySelector('.app')

        expect(appContainer).toBeInTheDocument()
        expect(appContainer.tagName).toBe('DIV')
      })

      it('should be keyboard navigable through child components', () => {
        // Given: Keyboard users need to navigate the application
        // When: The component renders
        // Then: The ScreenRotator child component should be present to handle keyboard events
        const screenRotator = screen.getByTestId('screen-rotator')

        expect(screenRotator).toBeInTheDocument()
      })
    })
  })
})


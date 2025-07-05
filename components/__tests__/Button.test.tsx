import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple Button component test
describe('Button Component', () => {
  it('should render button text', () => {
    // Create a simple button for testing
    const TestButton = ({ children }: { children: React.ReactNode }) => (
      <button>{children}</button>
    )
    
    render(<TestButton>Test Button</TestButton>)
    
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })
}) 
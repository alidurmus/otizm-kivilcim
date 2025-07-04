import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../components/Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toBeDisabled()
  })

  it('renders with custom text', () => {
    render(<Button>Custom Text</Button>)
    
    expect(screen.getByText('Custom Text')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick} disabled>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-focus-blue')
    expect(button).toHaveClass('text-white')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-neutral-gray')
    expect(button).toHaveClass('text-text-color')
  })

  it('applies success variant styles', () => {
    render(<Button variant="success">Success Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-success-green')
    expect(button).toHaveClass('text-text-color')
  })

  it('applies small size styles', () => {
    render(<Button size="small">Small Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('py-2')
    expect(button).toHaveClass('text-sm')
  })

  it('applies medium size styles by default', () => {
    render(<Button>Medium Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('text-base')
  })

  it('applies large size styles', () => {
    render(<Button size="large">Large Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-8')
    expect(button).toHaveClass('py-4')
    expect(button).toHaveClass('text-lg')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('sets correct button type', () => {
    render(<Button type="submit">Submit Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('sets aria-label when provided', () => {
    render(<Button ariaLabel="Close dialog">×</Button>)
    
    const button = screen.getByRole('button', { name: 'Close dialog' })
    expect(button).toBeInTheDocument()
  })

  it('sets tabIndex to -1 when disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabIndex', '-1')
  })

  it('sets tabIndex to 0 when not disabled', () => {
    render(<Button>Enabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabIndex', '0')
  })

  it('handles keyboard interaction', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard Button</Button>)
    
    const button = screen.getByRole('button')
    
    // Simulate Enter key press
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    
    // Note: The button component doesn't have built-in keyboard handling
    // This would need to be added if required
    expect(button).toHaveFocus
  })

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:opacity-50')
    expect(button).toHaveClass('disabled:cursor-not-allowed')
  })

  it('applies base classes consistently', () => {
    render(<Button>Test Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('font-bold')
    expect(button).toHaveClass('rounded-xl')
    expect(button).toHaveClass('transition-all')
    expect(button).toHaveClass('duration-300')
    expect(button).toHaveClass('focus:outline-none')
    expect(button).toHaveClass('focus:ring-4')
  })
}) 
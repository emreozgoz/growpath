import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByText('Primary Button')
    expect(button).toHaveClass('bg-primary-500')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByText('Secondary Button')
    expect(button).toHaveClass('bg-gray-100')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByText('Ghost Button')
    expect(button).toHaveClass('hover:bg-primary-50')
  })

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>)
    const button = screen.getByText('Outline Button')
    expect(button).toHaveClass('border-2')
  })

  it('applies destructive variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-red-500')
  })

  it('applies different size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByText('Small')).toHaveClass('h-9')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByText('Medium')).toHaveClass('h-10')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByText('Large')).toHaveClass('h-11')

    rerender(<Button size="xl">Extra Large</Button>)
    expect(screen.getByText('Extra Large')).toHaveClass('h-12')
  })

  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByText('Click me')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')

    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByText('Disabled')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })

  it('renders as a different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    const link = screen.getByText('Link Button')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('supports keyboard navigation', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Keyboard</Button>)

    const button = screen.getByText('Keyboard')
    button.focus()

    expect(button).toHaveFocus()

    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders with children as React elements', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })
})

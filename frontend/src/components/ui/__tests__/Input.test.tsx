import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styles when error prop exists', () => {
    render(<Input error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('does not apply error styles when no error', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveClass('border-red-500')
    expect(input).toHaveClass('border-gray-300')
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toBeInTheDocument()

    rerender(<Input type="number" />)
    const numberInput = document.querySelector('input[type="number"]')
    expect(numberInput).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('forwards ref to input element', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('supports autofocus', () => {
    render(<Input autoFocus />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })

  it('supports placeholder text', () => {
    render(<Input placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('supports required attribute', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('displays error message below input', () => {
    render(<Input error="Invalid email format" />)
    const errorMessage = screen.getByText('Invalid email format')
    expect(errorMessage).toHaveClass('text-red-600')
    expect(errorMessage).toHaveClass('text-sm')
  })

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<Input onKeyDown={handleKeyDown} />)

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(handleKeyDown).toHaveBeenCalled()
  })

  it('supports controlled input', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('initial')

    rerender(<Input value="updated" onChange={() => {}} />)
    expect(input.value).toBe('updated')
  })

  it('supports uncontrolled input with defaultValue', () => {
    render(<Input defaultValue="default text" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('default text')
  })
})

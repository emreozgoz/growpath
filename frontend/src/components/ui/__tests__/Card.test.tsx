import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Card className="custom-card">Content</Card>)
      const card = screen.getByText('Content').parentElement
      expect(card).toHaveClass('custom-card')
    })

    it('has default styling', () => {
      render(<Card>Content</Card>)
      const card = screen.getByText('Content').parentElement
      expect(card).toHaveClass('rounded-lg')
      expect(card).toHaveClass('border')
    })
  })

  describe('CardHeader', () => {
    it('renders header with children', () => {
      render(
        <Card>
          <CardHeader>
            <div>Header content</div>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('has proper spacing', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>
      )
      const header = screen.getByText('Header').parentElement
      expect(header).toHaveClass('p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders title text', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('has title styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByText('Title')
      expect(title).toHaveClass('text-lg')
      expect(title).toHaveClass('font-semibold')
    })

    it('applies custom className', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Title')).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('renders description text', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Card description text')).toBeInTheDocument()
    })

    it('has description styling', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
      )
      const description = screen.getByText('Description')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-gray-600')
    })
  })

  describe('CardContent', () => {
    it('renders content children', () => {
      render(
        <Card>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
        </Card>
      )
      expect(screen.getByText('Main content goes here')).toBeInTheDocument()
    })

    it('has proper padding', () => {
      render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      )
      const content = screen.getByText('Content').parentElement
      expect(content).toHaveClass('p-6')
    })

    it('applies custom className', () => {
      render(
        <Card>
          <CardContent className="custom-content">Content</CardContent>
        </Card>
      )
      const content = screen.getByText('Content').parentElement
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('renders footer children', () => {
      render(
        <Card>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('has proper styling', () => {
      render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      const footer = screen.getByText('Footer').parentElement
      expect(footer).toHaveClass('p-6')
    })
  })

  describe('Complete Card Structure', () => {
    it('renders all card parts together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card body content</p>
          </CardContent>
          <CardFooter>
            <button>Submit</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is a test description')).toBeInTheDocument()
      expect(screen.getByText('Card body content')).toBeInTheDocument()
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('maintains proper hierarchy', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
        </Card>
      )

      const card = screen.getByTestId('card')
      const header = screen.getByTestId('header')
      const content = screen.getByTestId('content')

      expect(card).toContainElement(header)
      expect(card).toContainElement(content)
    })
  })
})

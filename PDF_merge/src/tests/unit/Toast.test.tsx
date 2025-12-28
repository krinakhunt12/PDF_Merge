import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToastProvider, useToast } from '../../utils/Toast'
import { act } from 'react'

// Test component that uses toast
function TestComponent() {
  const toast = useToast()
  
  return (
    <div>
      <button onClick={() => toast.success('Success message')}>
        Show Success
      </button>
      <button onClick={() => toast.error('Error message')}>
        Show Error
      </button>
      <button onClick={() => toast.info('Info message')}>
        Show Info
      </button>
      <button onClick={() => toast.warning('Warning message')}>
        Show Warning
      </button>
    </div>
  )
}

describe('Toast System', () => {
  it('renders toast provider', () => {
    render(
      <ToastProvider>
        <div>Test</div>
      </ToastProvider>
    )
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('shows success toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    const button = screen.getByText('Show Success')
    
    await act(async () => {
      button.click()
    })
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('shows error toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    const button = screen.getByText('Show Error')
    
    await act(async () => {
      button.click()
    })
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('shows info toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    const button = screen.getByText('Show Info')
    
    await act(async () => {
      button.click()
    })
    
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('shows warning toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    
    const button = screen.getByText('Show Warning')
    
    await act(async () => {
      button.click()
    })
    
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })
})

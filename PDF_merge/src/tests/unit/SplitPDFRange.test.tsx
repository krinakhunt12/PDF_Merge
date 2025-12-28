import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SplitPDFRange from '../../components/SplitPDFRange'
import { ToastProvider } from '../../utils/Toast'
import * as api from '../../services/api'

vi.mock('../../services/api')

const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>)
}

describe('SplitPDFRange Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with title', () => {
    renderWithToast(<SplitPDFRange />)
    
    expect(screen.getByText('Split PDF by Range')).toBeInTheDocument()
    expect(screen.getByText('Extract specific pages from a PDF document')).toBeInTheDocument()
  })

  it('validates start page is at least 1', async () => {
    renderWithToast(<SplitPDFRange />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    await userEvent.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })
    
    const startPageInput = screen.getByPlaceholderText('e.g., 1')
    const endPageInput = screen.getByPlaceholderText('e.g., 5')
    
    // First clear any default values, then type -1 which will be parsed as invalid
    // but we need a valid end page
    await userEvent.clear(startPageInput)
    await userEvent.clear(endPageInput)
    await userEvent.type(startPageInput, '-1')
    await userEvent.type(endPageInput, '5')
    
    const splitButton = screen.getByRole('button', { name: /split & download/i })
    
    await waitFor(() => {
      expect(splitButton).not.toBeDisabled()
    })
    
    fireEvent.click(splitButton)
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText('Start page must be at least 1')
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  it('validates end page is greater than or equal to start page', async () => {
    renderWithToast(<SplitPDFRange />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    await userEvent.upload(input, file)
    
    const startPageInput = screen.getByPlaceholderText('e.g., 1')
    const endPageInput = screen.getByPlaceholderText('e.g., 5')
    
    await userEvent.type(startPageInput, '5')
    await userEvent.type(endPageInput, '3')
    
    const splitButton = screen.getByRole('button', { name: /split & download/i })
    fireEvent.click(splitButton)
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText('End page must be greater than or equal to start page')
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  it('successfully splits PDF by range', async () => {
    const mockBlob = new Blob(['split pdf'], { type: 'application/pdf' })
    vi.mocked(api.splitPDFRange).mockResolvedValue(mockBlob)
    
    renderWithToast(<SplitPDFRange />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    await userEvent.upload(input, file)
    
    const startPageInput = screen.getByPlaceholderText('e.g., 1')
    const endPageInput = screen.getByPlaceholderText('e.g., 5')
    
    await userEvent.type(startPageInput, '1')
    await userEvent.type(endPageInput, '3')
    
    const splitButton = screen.getByRole('button', { name: /split & download/i })
    fireEvent.click(splitButton)
    
    await waitFor(() => {
      expect(api.splitPDFRange).toHaveBeenCalledWith(
        file,
        1,
        3,
        undefined,
        'split.pdf'
      )
    })
  })
})

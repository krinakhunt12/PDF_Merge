import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SplitPDFPages from '../../components/SplitPDFPages'
import { ToastProvider } from '../../utils/Toast'
import * as api from '../../services/api'

vi.mock('../../services/api')

const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>)
}

describe('SplitPDFPages Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with title', () => {
    renderWithToast(<SplitPDFPages />)
    
    expect(screen.getByText('Split PDF into Pages')).toBeInTheDocument()
    expect(screen.getByText('Extract all pages from a PDF as individual files')).toBeInTheDocument()
  })

  it('shows upload area when no file is selected', () => {
    renderWithToast(<SplitPDFPages />)
    
    expect(screen.getByText('Click to upload PDF file')).toBeInTheDocument()
  })

  it('disables split button when no file selected', () => {
    renderWithToast(<SplitPDFPages />)
    
    const splitButton = screen.getByRole('button', { name: /split into pages/i })
    expect(splitButton).toBeDisabled()
  })

  it('handles file upload', async () => {
    renderWithToast(<SplitPDFPages />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    
    await userEvent.upload(input, file)
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })
  })

  it('successfully splits PDF', async () => {
    const mockResponse = {
      message: 'Success',
      files: ['page_1.pdf', 'page_2.pdf', 'page_3.pdf']
    }
    vi.mocked(api.splitPDFPages).mockResolvedValue(mockResponse)
    
    renderWithToast(<SplitPDFPages />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    await userEvent.upload(input, file)
    
    const splitButton = screen.getByRole('button', { name: /split into pages/i })
    await waitFor(() => {
      expect(splitButton).not.toBeDisabled()
    })
    
    fireEvent.click(splitButton)
    
    await waitFor(() => {
      expect(api.splitPDFPages).toHaveBeenCalled()
      const callArgs = vi.mocked(api.splitPDFPages).mock.calls[0]
      expect(callArgs[0]).toEqual(file)
      expect(callArgs[1]).toBeFalsy()
      expect(screen.getByText(/PDF split successfully!/)).toBeInTheDocument()
    })
  })

  it('displays error on split failure', async () => {
    vi.mocked(api.splitPDFPages).mockRejectedValue(new Error('Split failed'))
    
    renderWithToast(<SplitPDFPages />)
    
    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('Upload PDF file') as HTMLInputElement
    await userEvent.upload(input, file)
    
    const splitButton = screen.getByRole('button', { name: /split into pages/i })
    fireEvent.click(splitButton)
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText('Failed to split PDF. Please try again.')
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })
})

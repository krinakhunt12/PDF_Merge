import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MergePDF from '../../components/MergePDF'
import { ToastProvider } from '../../utils/Toast'
import * as api from '../../services/api'

// Mock the API module
vi.mock('../../services/api')

const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>)
}

describe('MergePDF Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with title and description', () => {
    renderWithToast(<MergePDF />)
    
    expect(screen.getByText('Merge PDF Files')).toBeInTheDocument()
    expect(screen.getByText('Combine multiple PDF files into a single document')).toBeInTheDocument()
  })

  it('displays upload area', () => {
    renderWithToast(<MergePDF />)
    
    expect(screen.getByText('Click to upload PDF files')).toBeInTheDocument()
    expect(screen.getByText('or drag and drop')).toBeInTheDocument()
  })

  it('disables merge button when less than 2 files selected', () => {
    renderWithToast(<MergePDF />)
    
    const mergeButton = screen.getByRole('button', { name: /merge & download/i })
    expect(mergeButton).toBeDisabled()
  })

  it('handles file selection', async () => {
    renderWithToast(<MergePDF />)
    
    const file1 = new File(['pdf content'], 'test1.pdf', { type: 'application/pdf' })
    const file2 = new File(['pdf content'], 'test2.pdf', { type: 'application/pdf' })
    
    const input = screen.getByLabelText('Upload PDF files') as HTMLInputElement
    
    await userEvent.upload(input, [file1, file2])
    
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument()
      expect(screen.getByText('test2.pdf')).toBeInTheDocument()
    })
  })

  it('removes file when remove button is clicked', async () => {
    renderWithToast(<MergePDF />)
    
    const file1 = new File(['pdf content'], 'test1.pdf', { type: 'application/pdf' })
    const file2 = new File(['pdf content'], 'test2.pdf', { type: 'application/pdf' })
    
    const input = screen.getByLabelText('Upload PDF files') as HTMLInputElement
    await userEvent.upload(input, [file1, file2])
    
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument()
    })
    
    const removeButtons = screen.getAllByLabelText('Remove file')
    fireEvent.click(removeButtons[0])
    
    await waitFor(() => {
      expect(screen.queryByText('test1.pdf')).not.toBeInTheDocument()
      expect(screen.getByText('test2.pdf')).toBeInTheDocument()
    })
  })

  it('successfully merges PDFs', async () => {
    const mockBlob = new Blob(['merged pdf'], { type: 'application/pdf' })
    vi.mocked(api.mergePDFs).mockResolvedValue(mockBlob)
    
    renderWithToast(<MergePDF />)
    
    const file1 = new File(['pdf content'], 'test1.pdf', { type: 'application/pdf' })
    const file2 = new File(['pdf content'], 'test2.pdf', { type: 'application/pdf' })
    
    const input = screen.getByLabelText('Upload PDF files') as HTMLInputElement
    await userEvent.upload(input, [file1, file2])
    
    const mergeButton = screen.getByRole('button', { name: /merge & download/i })
    await waitFor(() => {
      expect(mergeButton).not.toBeDisabled()
    })
    
    fireEvent.click(mergeButton)
    
    await waitFor(() => {
      expect(api.mergePDFs).toHaveBeenCalledWith(
        expect.arrayContaining([file1, file2]),
        undefined,
        'merged.pdf'
      )
    })
  })

  it('displays error on merge failure', async () => {
    vi.mocked(api.mergePDFs).mockRejectedValue(new Error('Merge failed'))
    
    renderWithToast(<MergePDF />)
    
    const file1 = new File(['pdf content'], 'test1.pdf', { type: 'application/pdf' })
    const file2 = new File(['pdf content'], 'test2.pdf', { type: 'application/pdf' })
    
    const input = screen.getByLabelText('Upload PDF files') as HTMLInputElement
    await userEvent.upload(input, [file1, file2])
    
    const mergeButton = screen.getByRole('button', { name: /merge & download/i })
    fireEvent.click(mergeButton)
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText('Failed to merge PDFs. Please try again.')
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  it('accepts password input', async () => {
    renderWithToast(<MergePDF />)
    
    const passwordInput = screen.getByPlaceholderText('Enter password to protect merged PDF')
    await userEvent.type(passwordInput, 'test123')
    
    expect(passwordInput).toHaveValue('test123')
  })

  it('accepts custom filename input', async () => {
    renderWithToast(<MergePDF />)
    
    const filenameInput = screen.getByPlaceholderText('merged.pdf')
    await userEvent.clear(filenameInput)
    await userEvent.type(filenameInput, 'custom-name.pdf')
    
    expect(filenameInput).toHaveValue('custom-name.pdf')
  })
})

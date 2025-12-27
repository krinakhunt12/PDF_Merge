import axios from 'axios'

const API_BASE_URL = 'VITE_API_BASE_URL' in import.meta.env ? import.meta.env.VITE_API_BASE_URL : 'http://127.0.0.1:8000'

export interface MergeResponse {
  message: string
  filename: string
}

export interface SplitPagesResponse {
  message: string
  files: string[]
}

export interface SplitRangeResponse {
  message: string
  filename: string
}

export const mergePDFs = async (
  files: File[],
  password?: string
): Promise<Blob> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  if (password) {
    formData.append('password', password)
  }

  const response = await axios.post(`${API_BASE_URL}/merge`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const splitPDFPages = async (
  file: File,
  password?: string
): Promise<SplitPagesResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (password) {
    formData.append('password', password)
  }

  const response = await axios.post<SplitPagesResponse>(
    `${API_BASE_URL}/split-pages`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const splitPDFRange = async (
  file: File,
  startPage: number,
  endPage: number,
  password?: string
): Promise<Blob> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('start_page', startPage.toString())
  formData.append('end_page', endPage.toString())
  if (password) {
    formData.append('password', password)
  }

  const response = await axios.post(`${API_BASE_URL}/split-range`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
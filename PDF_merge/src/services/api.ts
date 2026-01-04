import axios from 'axios'
import { withTimeout, DEFAULT_TIMEOUT } from '../utils/loadingTimeout'
import logger from '../utils/AppLogger'
import i18n from '../i18n'

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
  password?: string,
  filename?: string
): Promise<Blob> => {
  logger.info('Starting PDF merge operation', { fileCount: files.length, filename })
  
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  if (password) {
    formData.append('password', password)
  }
  if (filename) {
    formData.append('filename', filename)
  }

  try {
    const response = await withTimeout(
      axios.post(`${API_BASE_URL}/merge`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        timeout: DEFAULT_TIMEOUT,
        timeoutMessage: i18n.t('error.timeout.merge'),
      }
    )

    logger.info('PDF merge completed successfully')
    return response.data
  } catch (error) {
    logger.error('PDF merge failed', error)
    throw error
  }
}

export const splitPDFPages = async (
  file: File,
  password?: string,
  filename?: string
): Promise<SplitPagesResponse | Blob> => {
  logger.info('Starting PDF split pages operation', { filename: file.name })
  
  const formData = new FormData()
  formData.append('file', file)
  if (password) {
    formData.append('password', password)
  }
  if (filename) {
    formData.append('filename', filename)
  }

  try {
    // If filename provided, server will return a zip blob for download
    if (filename) {
      const response = await withTimeout(
        axios.post(`${API_BASE_URL}/split-pages`, formData, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          timeout: DEFAULT_TIMEOUT,
          timeoutMessage: i18n.t('error.timeout.split'),
        }
      )

      logger.info('PDF split pages completed successfully (zip)')
      return response.data
    }

    const response = await withTimeout(
      axios.post<SplitPagesResponse>(
        `${API_BASE_URL}/split-pages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ),
      {
        timeout: DEFAULT_TIMEOUT,
        timeoutMessage: i18n.t('error.timeout.split'),
      }
    )

    logger.info('PDF split pages completed successfully')
    return response.data
  } catch (error) {
    logger.error('PDF split pages failed', error)
    throw error
  }
}

export const splitPDFRange = async (
  file: File,
  startPage: number,
  endPage: number,
  password?: string,
  filename?: string
): Promise<Blob> => {
  logger.info('Starting PDF split range operation', { 
    filename: file.name, 
    startPage, 
    endPage 
  })
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('start_page', startPage.toString())
  formData.append('end_page', endPage.toString())
  if (password) {
    formData.append('password', password)
  }
  if (filename) {
    formData.append('filename', filename)
  }

  try {
    const response = await withTimeout(
      axios.post(`${API_BASE_URL}/split-range`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        timeout: DEFAULT_TIMEOUT,
        timeoutMessage: i18n.t('error.timeout.splitRange'),
      }
    )

    logger.info('PDF split range completed successfully')
    return response.data
  } catch (error) {
    logger.error('PDF split range failed', error)
    throw error
  }
}
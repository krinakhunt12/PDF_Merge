import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, FileText, Lock, X, Scissors, Loader2 } from 'lucide-react'
import { splitPDFPages } from '../services/api'
import { useToast } from '../utils/Toast'
import logger from '../utils/AppLogger'

function SplitPDFPages() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<string[] | null>(null)
  const [filename, setFilename] = useState('split_pages.zip')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError('')
        setResult(null)
      } else {
        setError(t('errors.selectFile'))
      }
    }
  }

  const removeFile = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSplit = async () => {
    if (!file) {
      const errorMsg = t('errors.selectFile')
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await splitPDFPages(file, password, filename)
      // If server returned a Blob (zip), download it
      if (response instanceof Blob) {
        const blobUrl = window.URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = blobUrl
        const downloadName = filename && filename.endsWith('.zip') ? filename : `${filename}.zip`
        a.download = downloadName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        document.body.removeChild(a)
        toast.success(t('splitPages.resultDownloaded'))
        setResult(null)
      } else {
        setResult(response.files)
        toast.success(t('success.splitPages', { count: response.files.length }))
      }
      logger.info('PDF split pages operation completed successfully')
    } catch (err) {
      const errorMsg = t('error.split')
      setError(errorMsg)
      toast.error(errorMsg)
      logger.error('PDF split pages operation failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('splitPages.title')}</h2>
        <p className="text-gray-400 text-sm sm:text-base">{t('splitPages.description')}</p>
      </div>

      {/* File Upload Area */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">{t('splitPages.upload')}</p>
          <p className="text-gray-400 text-sm">{t('merge.orDrag')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label={t('splitPages.upload')}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-gray-400 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-red-400 hover:text-red-300 transition-colors cusor-pointer"
            aria-label={t('button.remove')}
            title={t('button.remove')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Password Input */}
      <div>
        <label className="flex items-center gap-2 text-white mb-2">
          <Lock className="w-4 h-4" />
          {t('password.placeholder') ? t('password.placeholder') : 'Password Protection (Optional)'}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('password.placeholder')}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Output Filename (zip) */}
      <div>
        <label className="flex items-center gap-2 text-white mb-2">
          <FileText className="w-4 h-4" />
          {t('output.filename')} (zip)
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder={t('output.filename')}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
          <h3 className="text-green-400 font-medium mb-2">
            {t('success.splitPages', { count: result.length })}
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Generated {result.length} page(s)
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {result.map((filePath, index) => (
              <div
                key={index}
                className="bg-gray-700/50 p-2 rounded text-sm text-gray-300"
              >
                {filePath}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split Button */}
      <button
        onClick={handleSplit}
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('splitPages.merging') || 'Splitting PDF...'}
          </>
        ) : (
          <>
            <Scissors className="w-5 h-5" />
            {t('splitPages.splitButton')}
          </>
        )}
      </button>
    </div>
  )
}

export default SplitPDFPages
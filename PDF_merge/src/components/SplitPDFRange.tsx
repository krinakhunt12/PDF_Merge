import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Download, FileText, Lock, X, Scissors, Loader2 } from 'lucide-react'
import { splitPDFRange } from '../services/api'
import { useToast } from '../utils/Toast'
import logger from '../utils/AppLogger'

function SplitPDFRange() {
  const [file, setFile] = useState<File | null>(null)
  const [startPage, setStartPage] = useState<string>('')
  const [endPage, setEndPage] = useState<string>('')
  const [password, setPassword] = useState('')
  const [filename, setFilename] = useState('split.pdf')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { t } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError('')
      } else {
        setError(t('errors.selectFile'))
      }
    }
  }

  const removeFile = () => {
    setFile(null)
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

    const start = parseInt(startPage)
    const end = parseInt(endPage)

    if (!start || !end) {
      const errorMsg = t('errors.enterValidPages')
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    if (start < 1) {
      const errorMsg = t('errors.startAtLeastOne')
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    if (end < start) {
      const errorMsg = t('errors.endGreaterEqualStart')
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setLoading(true)
    setError('')

    try {
      const blob = await splitPDFRange(file, start, end, password || undefined, filename)
      
      // Download the split PDF
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(t('success.splitRange'))
      logger.info('PDF split range operation completed successfully')

      // Reset form
      setFile(null)
      setStartPage('')
      setEndPage('')
      setPassword('')
      setFilename('split.pdf')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      const errorMsg = t('error.splitRange')
      setError(errorMsg)
      toast.error(errorMsg)
      logger.error('PDF split range operation failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('splitRange.title')}</h2>
        <p className="text-gray-400 text-sm sm:text-base">{t('splitRange.description')}</p>
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
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label={t('button.remove')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Page Range Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white mb-2 block">{t('splitRange.startPage')}</label>
          <input
            type="number"
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            placeholder={t('splitRange.startPlaceholder')}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-white mb-2 block">{t('splitRange.endPage')}</label>
          <input
            type="number"
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            placeholder={t('splitRange.endPlaceholder')}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

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

      {/* Filename Input */}
      <div>
        <label className="flex items-center gap-2 text-white mb-2">
          <FileText className="w-4 h-4" />
          {t('output.filename')}
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

      {/* Split Button */}
      <button
        onClick={handleSplit}
        disabled={loading || !file || !startPage || !endPage}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('splitRange.merging')}
          </>
        ) : (
          <>
            <Scissors className="w-5 h-5" />
            <Download className="w-5 h-5" />
            {t('splitRange.splitButton')}
          </>
        )}
      </button>
    </div>
  )
}

export default SplitPDFRange
import { useState, useRef } from 'react'
import { Upload, Download, FileText, Lock, X, Scissors, Loader2 } from 'lucide-react'
import { splitPDFRange } from '../services/api'

function SplitPDFRange() {
  const [file, setFile] = useState<File | null>(null)
  const [startPage, setStartPage] = useState<string>('')
  const [endPage, setEndPage] = useState<string>('')
  const [password, setPassword] = useState('')
  const [filename, setFilename] = useState('split.pdf')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please select a valid PDF file')
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
      setError('Please select a PDF file')
      return
    }

    const start = parseInt(startPage)
    const end = parseInt(endPage)

    if (!start || !end) {
      setError('Please enter valid page numbers')
      return
    }

    if (start < 1) {
      setError('Start page must be at least 1')
      return
    }

    if (end < start) {
      setError('End page must be greater than or equal to start page')
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
      setError('Failed to split PDF. Please check your page range and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Split PDF by Range</h2>
        <p className="text-gray-400">Extract specific pages from a PDF document</p>
      </div>

      {/* File Upload Area */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Click to upload PDF file</p>
          <p className="text-gray-400 text-sm">or drag and drop</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload PDF file"
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
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Page Range Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white mb-2 block">Start Page</label>
          <input
            type="number"
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            placeholder="e.g., 1"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-white mb-2 block">End Page</label>
          <input
            type="number"
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            placeholder="e.g., 5"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="flex items-center gap-2 text-white mb-2">
          <Lock className="w-4 h-4" />
          Password Protection (Optional)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to protect split PDF"
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Filename Input */}
      <div>
        <label className="flex items-center gap-2 text-white mb-2">
          <FileText className="w-4 h-4" />
          Output Filename
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="split.pdf"
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
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Splitting PDF...
          </>
        ) : (
          <>
            <Scissors className="w-5 h-5" />
            <Download className="w-5 h-5" />
            Split & Download
          </>
        )}
      </button>
    </div>
  )
}

export default SplitPDFRange
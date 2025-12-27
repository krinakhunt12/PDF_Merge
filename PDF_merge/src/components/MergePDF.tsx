import { useState, useRef } from 'react'
import { Upload, Download, Lock, X, FileText, Loader2 } from 'lucide-react'
import { mergePDFs } from '../services/api'

function MergePDF() {
  const [files, setFiles] = useState<File[]>([])
  const [password, setPassword] = useState('')
  const [filename, setFilename] = useState('merged.pdf')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type === 'application/pdf'
      )
      setFiles((prev) => [...prev, ...newFiles])
      setError('')
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      return
    }

    setLoading(true)
    setError('')

    try {
      const blob = await mergePDFs(files, password || undefined, filename)
      
      // Download the merged PDF
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Reset form
      setFiles([])
      setPassword('')
      setFilename('merged.pdf')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Merge PDF Files</h2>
        <p className="text-gray-400">Combine multiple PDF files into a single document</p>
      </div>

      {/* File Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white mb-2">Click to upload PDF files</p>
        <p className="text-gray-400 text-sm">or drag and drop</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload PDF files"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-white font-medium">Selected Files ({files.length})</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-white">{file.name}</span>
                <span className="text-gray-400 text-sm">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

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
          placeholder="Enter password to protect merged PDF"
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
          placeholder="merged.pdf"
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Merge Button */}
      <button
        onClick={handleMerge}
        disabled={loading || files.length < 2}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Merging PDFs...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Merge & Download
          </>
        )}
      </button>
    </div>
  )
}

export default MergePDF
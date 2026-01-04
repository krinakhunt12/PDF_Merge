import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Home
      'home.title': 'Work with PDFs',
      'home.subtitle': 'Professional PDF tools for merging, splitting, and managing documents with ease. Fast, secure, and completely free.',
      'tab.merge': 'Merge PDFs',
      'tab.splitPages': 'Split into Pages',
      'tab.splitRange': 'Split by Range',
      'features.heading': 'Why Choose Our PDF Tools?',
      'features.sub': 'Everything you need to work with PDFs efficiently and securely',
      // Features
      'features.lightning.title': 'Lightning Fast Processing',
      'features.lightning.description': 'Process PDFs in seconds with our highly optimized algorithms and server infrastructure',
      'features.security.title': 'Bank-Grade Security',
      'features.security.description': 'Your files are encrypted during transfer and processed securely. Nothing is stored permanently',
      'features.intuitive.title': 'Intuitive Interface',
      'features.intuitive.description': 'Clean, modern design that makes complex PDF operations simple for everyone',
      'features.batch.title': 'Batch Operations',
      'features.batch.description': 'Merge multiple PDFs or split documents in bulk with drag-and-drop support',
      'features.nolimits.title': 'No File Limits',
      'features.nolimits.description': 'Process PDFs of any size without restrictions on file dimensions or page count',
      'features.privacy.title': '100% Privacy',
      'features.privacy.description': 'All operations happen locally. Your sensitive documents never leave your control',

      // Stats
      'stats.activeUsers.label': 'Active Users',
      'stats.pdfsProcessed.label': 'PDFs Processed',
      'stats.userRating.label': 'User Rating',
      'stats.uptime.label': 'Uptime',

      // How it works
      'how.heading': 'How It Works',
      'how.sub': 'Four simple steps to manage your PDF documents',
      'steps.upload.title': 'Upload Your Files',
      'steps.upload.description': 'Drag and drop or click to select PDF files from your device. Supports multiple file selection.',
      'steps.choose.title': 'Choose Operation',
      'steps.choose.description': 'Select whether to merge multiple PDFs, split into pages, or extract specific page ranges.',
      'steps.process.title': 'Process Instantly',
      'steps.process.description': 'Our powerful engine processes your documents in seconds with optimal quality preservation.',
      'steps.download.title': 'Download Results',
      'steps.download.description': 'Get your processed files instantly. Results are available for immediate download.',

      // App / Global
      'loading.app': 'Loading application...',

      // Error Boundary
      'error.title': 'Oops! Something went wrong',
      'error.description': "We're sorry for the inconvenience. The application encountered an unexpected error.",
      'error.stackTrace': 'Stack Trace',
      'error.tryAgain': 'Try Again',
      'error.goHome': 'Go Home',

      // Toast
      'toast.close': 'Close notification',

      // Merge
      'merge.title': 'Merge PDF Files',
      'merge.description': 'Combine multiple PDF files into a single document',
      'merge.upload': 'Click to upload PDF files',
      'merge.mergeButton': 'Merge & Download',
      'merge.orDrag': 'or drag and drop',
      'merge.merging': 'Merging PDFs...',

      // Split Pages
      'splitPages.title': 'Split PDF into Pages',
      'splitPages.description': 'Extract all pages from a PDF as individual files',
      'splitPages.upload': 'Click to upload PDF file',
      'splitPages.splitButton': 'Split into Pages',
      'splitPages.resultDownloaded': 'PDF split pages downloaded',
      'splitPages.merging': 'Splitting PDF...',

      // Split Range
      'splitRange.title': 'Split PDF by Range',
      'splitRange.description': 'Extract specific pages from a PDF document',
      'splitRange.splitButton': 'Split & Download',
      'splitRange.merging': 'Splitting PDF...',

      // Buttons / Common
      'button.remove': 'Remove file',
      'selectedFiles.title': 'Selected Files',

      // Feedback
      'please.select.pdf': 'Please select a PDF file',
      'errors.selectAtLeastTwo': 'Please select at least 2 PDF files to merge',
      'errors.selectFile': 'Please select a PDF file',
      'success.merge': 'PDFs merged successfully!',
      'error.merge': 'Failed to merge PDFs. Please try again.',
      'success.splitPages': 'PDF split into {{count}} pages successfully!',
      'error.split': 'Failed to split PDF. Please try again.',
      'success.splitRange': 'PDF split successfully!',
      'errors.enterValidPages': 'Please enter valid page numbers',
      'errors.startAtLeastOne': 'Start page must be at least 1',
      'errors.endGreaterEqualStart': 'End page must be greater than or equal to start page',
      'error.splitRange': 'Failed to split PDF. Please check your page range and try again.',
      'splitRange.startPage': 'Start Page',
      'splitRange.endPage': 'End Page',
      'splitRange.startPlaceholder': 'e.g., 1',
      'splitRange.endPlaceholder': 'e.g., 5',
      // API timeouts
      'error.timeout.merge': 'PDF merge operation timed out. Please try again.',
      'error.timeout.split': 'PDF split operation timed out. Please try again.',
      'error.timeout.splitRange': 'PDF split range operation timed out. Please try again.',

      // Common
      'password.placeholder': 'Enter password to protect merged PDF',
      'output.filename': 'Output Filename',
      
    },
  },
  // Placeholder Spanish translations (optional)
  es: {
    translation: {
      'home.title': 'Operaciones PDF',
      'home.subtitle': 'Herramientas PDF profesionales para fusionar, dividir y gestionar documentos de forma sencilla.',
      'merge.title': 'Combinar PDFs',
      'splitPages.title': 'Dividir PDF en páginas',
      'splitRange.title': 'Dividir PDF por rango',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

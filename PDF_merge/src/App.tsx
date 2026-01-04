import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorBoundary from './utils/ErrorBoundary'
import { ToastProvider } from './utils/Toast'
import { Loader2 } from 'lucide-react'

const Home = lazy(() => import('./pages/Home'))

function App() {
  const { t } = useTranslation()
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-gray-400 text-lg">{t('loading.app')}</p>
              </div>
            </div>
          }
        >
          <Home />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
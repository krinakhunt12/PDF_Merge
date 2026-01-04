import { useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { 
  FileText, 
  Sparkles, 
  Shield, 
  Zap, 
  Github,
  Mail,
  Heart,
  CheckCircle,
  Clock,
  Layers,
  Download,
  Upload,
  Lock,
  TrendingUp,
  Users,
  Star
} from 'lucide-react'

// Lazy load components for better performance
const MergePDF = lazy(() => import('../components/MergePDF'))
const SplitPDFPages = lazy(() => import('../components/SplitPDFPages'))
const SplitPDFRange = lazy(() => import('../components/SplitPDFRange'))

type TabType = 'merge' | 'split-pages' | 'split-range'

interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
}

interface StatCard {
  icon: React.ReactNode
  value: string
  label: string
}

interface StepCard {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}

function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('merge')
  const { t } = useTranslation()

  const features: FeatureCard[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('features.lightning.title'),
      description: t('features.lightning.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('features.security.title'),
      description: t('features.security.description')
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t('features.intuitive.title'),
      description: t('features.intuitive.description')
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t('features.batch.title'),
      description: t('features.batch.description')
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: t('features.nolimits.title'),
      description: t('features.nolimits.description')
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t('features.privacy.title'),
      description: t('features.privacy.description')
    }
  ]

  const stats: StatCard[] = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '50K+',
      label: t('stats.activeUsers.label')
    },
    {
      icon: <FileText className="w-8 h-8" />,
      value: '1M+',
      label: t('stats.pdfsProcessed.label')
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: '4.9/5',
      label: t('stats.userRating.label')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '99.9%',
      label: t('stats.uptime.label')
    }
  ]

  const steps: StepCard[] = [
    {
      number: 1,
      icon: <Upload className="w-8 h-8" />,
      title: t('steps.upload.title'),
      description: t('steps.upload.description')
    },
    {
      number: 2,
      icon: <Layers className="w-8 h-8" />,
      title: t('steps.choose.title'),
      description: t('steps.choose.description')
    },
    {
      number: 3,
      icon: <Zap className="w-8 h-8" />,
      title: t('steps.process.title'),
      description: t('steps.process.description')
    },
    {
      number: 4,
      icon: <Download className="w-8 h-8" />,
      title: t('steps.download.title'),
      description: t('steps.download.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <FileText className="w-16 h-16 text-blue-400 animate-bounce" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin-slow" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {t('home.title')}
            </h1>
          </div>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
        </header>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 text-center group hover:transform hover:scale-105"
              >
                <div className="text-blue-400 flex justify-center mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">{t('features.heading')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('features.sub')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">{t('how.heading')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('how.sub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto mb-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-3 bg-gray-800/50 p-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <button
              onClick={() => setActiveTab('merge')}
              className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                activeTab === 'merge'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                {t('tab.merge')}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('split-pages')}
              className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                activeTab === 'split-pages'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50 transform scale-105'
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                {t('tab.splitPages')}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('split-range')}
              className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                activeTab === 'split-range'
                  ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/50 transform scale-105'
                  : 'bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                {t('tab.splitRange')}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              }
            >
              {activeTab === 'merge' && <MergePDF />}
              {activeTab === 'split-pages' && <SplitPDFPages />}
              {activeTab === 'split-range' && <SplitPDFRange />}
            </Suspense>
          </div>
        </div>

        {/* Security & Privacy Section */}
        <div className="max-w-6xl mx-auto mt-16 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Your Privacy Matters
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                All PDF operations are performed with enterprise-grade security. Your files are encrypted during transfer 
                and processed in real-time without permanent storage.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No data retention policy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>GDPR compliant processing</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Fast & Reliable
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Experience lightning-fast PDF processing with our optimized infrastructure. 
                No waiting, no hassle—just instant results.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Process in under 3 seconds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>99.9% uptime guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>24/7 availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-white font-bold text-lg">PDF Operations</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Professional PDF tools for merging, splitting, and managing documents. 
                    Fast, secure, and completely free to use.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                  <div className="flex gap-3 mb-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="mailto:contact@pdftools.com"
                      className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Have questions? We're here to help!
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-700/50 pt-6 text-center">
                <p className="text-gray-400 flex items-center justify-center gap-2 mb-2">
                  Built with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> using 
                  <span className="text-blue-400 font-semibold">FastAPI</span>,
                  <span className="text-cyan-400 font-semibold">React</span> & 
                  <span className="text-purple-400 font-semibold">TypeScript</span>
                </p>
                <p className="text-gray-500 text-sm">
                  © 2026 PDF Operations Tool. All rights reserved. | Version 2.0.0
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

export default Home
import { Link } from 'react-router-dom'
import { 
  ChevronRightIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-blue-600">Knowledge</span><span className="text-purple-600">Forge</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                <SparklesIcon className="w-4 h-4 mr-2" />
                AI-Powered Knowledge Assistant
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Personal
                <span className="block text-blue-600">
                  Knowledge Assistant
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your documents into an intelligent knowledge base. Upload PDFs, research papers, 
                and notes, then chat with an AI that understands your content and provides instant, accurate answers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1"
              >
                Start Building Your Knowledge Base
                <ChevronRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Knowledge Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build, manage, and query your personal knowledge base
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Document Processing</h3>
              <p className="text-gray-600">
                Upload PDFs, Word docs, and text files. Our AI automatically processes and indexes your content for intelligent search.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversational AI Chat</h3>
              <p className="text-gray-600">
                Ask natural language questions and get precise answers from your documents with source citations.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LightBulbIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Insights</h3>
              <p className="text-gray-600">
                Get explanations, summaries, and insights that go beyond simple keyword matching with advanced AI understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Creator Section */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Creator</h2>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Venkat Buthuru</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Software Engineer & AI Enthusiast passionate about building intelligent systems that make knowledge more accessible. 
              KnowledgeForge represents the fusion of modern AI capabilities with practical knowledge management needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <SparklesIcon className="w-4 h-4 mr-1" />
                AI & Machine Learning
              </span>
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <ShieldCheckIcon className="w-4 h-4 mr-1" />
                Full-Stack Development
              </span>
              <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                Knowledge Systems
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Knowledge Base?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers, students, and professionals who trust KnowledgeForge with their knowledge management.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            Get Started for Free
            <ChevronRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">KnowledgeForge</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your Personal AI-Powered Knowledge Assistant
            </p>
            <p className="text-sm text-gray-500">
              Created with ❤️ by Venkat Buthuru • © 2025 KnowledgeForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
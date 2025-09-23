import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { documentsApi } from '../services/api'
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  PlusIcon,
  SparklesIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [previewModal, setPreviewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getDocuments,
  })

  const { data: documentContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['documentContent', selectedDocument?.id],
    queryFn: () => documentsApi.getDocumentContent(selectedDocument.id),
    enabled: !!selectedDocument && previewModal,
  })

  const recentDocuments = documents.slice(0, 5)
  const completedCount = documents.filter(doc => doc.status === 'completed').length
  const processingCount = documents.filter(doc => doc.status === 'processing').length
  const errorCount = documents.filter(doc => doc.status === 'error').length

  const handlePreviewDocument = (document) => {
    if (document.status !== 'completed') {
      alert('Document is still being processed. Please wait for processing to complete.')
      return
    }
    setSelectedDocument(document)
    setPreviewModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your knowledge base.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                    <dd className="text-2xl font-bold text-gray-900">{documents.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-2xl font-bold text-gray-900">{completedCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Processing</dt>
                    <dd className="text-2xl font-bold text-gray-900">{processingCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <ExclamationCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Errors</dt>
                    <dd className="text-2xl font-bold text-gray-900">{errorCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/documents"
              className="relative group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative z-10">
                <PlusIcon className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
                <p className="text-blue-100">Add new documents to your knowledge base</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="relative group bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative z-10">
                <SparklesIcon className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Chat</h3>
                <p className="text-emerald-100">Ask questions about your documents</p>
              </div>
            </Link>

            <Link
              to="/documents"
              className="relative group bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative z-10">
                <ChartBarIcon className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-purple-100">Explore your knowledge base insights</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Recent Documents</h3>
              <Link 
                to="/documents"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Loading documents...</p>
              </div>
            ) : recentDocuments.length > 0 ? (
              <div className="space-y-4">
                {recentDocuments.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{document.title}</p>
                        <p className="text-xs text-gray-500">
                          {document.filename} • {new Date(document.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        document.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : document.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {document.status}
                      </span>
                      <button 
                        onClick={() => handlePreviewDocument(document)}
                        disabled={document.status !== 'completed'}
                        className={`${
                          document.status === 'completed'
                            ? 'text-blue-600 hover:text-blue-700'
                            : 'text-gray-300 cursor-not-allowed'
                        } transition-colors`}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-500 mb-6">Get started by uploading your first document to build your knowledge base.</p>
                <Link
                  to="/documents"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Upload Document
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {previewModal && selectedDocument && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.title}</h3>
                      <p className="text-sm text-gray-500">{selectedDocument.filename}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  {isLoadingContent ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading document content...</p>
                    </div>
                  ) : (
                    <div className="prose prose-blue max-w-none">
                      <pre className="whitespace-pre-wrap bg-gray-50 rounded-xl p-4 text-sm">
                        {documentContent?.content || 'No content available'}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { documentsApi } from '../services/api'
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon, 
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function Documents() {
  const [uploadModal, setUploadModal] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' })
  const [selectedFile, setSelectedFile] = useState(null)
  
  const queryClient = useQueryClient()

  const { data: documentContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['documentContent', selectedDocument?.id],
    queryFn: () => documentsApi.getDocumentContent(selectedDocument.id),
    enabled: !!selectedDocument && previewModal,
  })

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getDocuments,
    refetchInterval: (queryResult) => {
      const docs = queryResult?.data || []
      const hasProcessingDocs = Array.isArray(docs) && docs.some(doc => doc.status === 'processing')
      return hasProcessingDocs ? 3000 : false
    },
    refetchIntervalInBackground: true,
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, title, description }) => 
      documentsApi.uploadDocument(file, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      setUploadModal(false)
      setUploadForm({ title: '', description: '' })
      setSelectedFile(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
    },
  })

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
      setUploadForm(prev => ({
        ...prev,
        title: acceptedFiles[0].name.replace(/\.[^/.]+$/, "")
      }))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024
  })

  const handlePreviewDocument = (document) => {
    if (document.status !== 'completed') {
      alert('Document is still being processed. Please wait for processing to complete.')
      return
    }
    setSelectedDocument(document)
    setPreviewModal(true)
  }

  const handleUpload = (e) => {
    e.preventDefault()
    if (selectedFile && uploadForm.title) {
      uploadMutation.mutate({
        file: selectedFile,
        title: uploadForm.title,
        description: uploadForm.description
      })
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    }
    
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600">Manage your knowledge base documents</p>
            </div>
          </div>
          <button
            onClick={() => setUploadModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Upload Document
          </button>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg">Loading your documents...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <div key={document.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {getStatusIcon(document.status)}
                      </div>
                    </div>
                    <span className={getStatusBadge(document.status)}>
                      {document.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {document.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {document.filename} • {new Date(document.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePreviewDocument(document)}
                      disabled={document.status !== 'completed'}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        document.status === 'completed'
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Preview
                    </button>
                    
                    <button
                      onClick={() => deleteMutation.mutate(document.id)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start building your knowledge base by uploading your first document. We support PDF, Word, text, and Markdown files.
            </p>
            <button
              onClick={() => setUploadModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload Your First Document
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {uploadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <CloudArrowUpIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                  </div>
                  <button
                    onClick={() => setUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Drop Zone */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {selectedFile ? (
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-2">
                          Drag and drop your document here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF, Word, Text, and Markdown files (max 50MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter document title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of the document..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setUploadModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedFile || !uploadForm.title || uploadMutation.isPending}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    >
                      {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
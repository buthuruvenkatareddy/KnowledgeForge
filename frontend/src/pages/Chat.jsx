import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../services/api'
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  ComputerDesktopIcon,
  TrashIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'

export default function Chat() {
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentConversation, setCurrentConversation] = useState(null)
  const messagesEndRef = useRef(null)
  const queryClient = useQueryClient()

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations,
  })

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', currentConversation?.id],
    queryFn: () => chatApi.getConversationMessages(currentConversation.id),
    enabled: !!currentConversation,
  })

  const deleteConversationMutation = useMutation({
    mutationFn: chatApi.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations'])
      if (currentConversation) {
        setCurrentConversation(null)
      }
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({ message, conversationId }) => 
      chatApi.sendMessage(message, conversationId),
    onSuccess: (data) => {
      setCurrentMessage('')
      if (!currentConversation) {
        setCurrentConversation({ id: data.conversation_id })
      }
      queryClient.invalidateQueries(['conversations'])
      queryClient.invalidateQueries(['messages', currentConversation?.id || data.conversation_id])
    },
  })

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (currentMessage.trim()) {
      sendMessageMutation.mutate({
        message: currentMessage.trim(),
        conversationId: currentConversation?.id
      })
    }
  }

  const startNewConversation = () => {
    console.log('Starting new conversation...')
    setCurrentConversation(null)
    setCurrentMessage('')
    // Clear messages from the current conversation
    queryClient.setQueryData(['messages', currentConversation?.id], [])
    // Refresh conversations list
    queryClient.invalidateQueries(['conversations'])
  }

  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversationMutation.mutate(conversationId)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Sidebar - Conversations */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Chat</h1>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Plus button clicked')
                    startNewConversation()
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="New conversation"
                  aria-label="New conversation"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('New Conversation button clicked')
                  startNewConversation()
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                title="Start a new conversation"
                aria-label="Start a new conversation"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Conversation
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4">
              {conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort newest first
                    .map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setCurrentConversation(conversation)}
                      className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        currentConversation?.id === conversation.id
                          ? 'bg-blue-100 border-2 border-blue-200'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.title || 'Untitled Conversation'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(() => {
                            const date = new Date(conversation.created_at)
                            const now = new Date()
                            const diffTime = Math.abs(now - date)
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                            
                            if (diffDays === 0) {
                              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            } else if (diffDays === 1) {
                              return 'Yesterday'
                            } else if (diffDays < 7) {
                              return `${diffDays} days ago`
                            } else {
                              return date.toLocaleDateString()
                            }
                          })()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                        title="Delete conversation"
                        aria-label="Delete conversation"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentConversation.title || 'AI Assistant'}
                      </h2>
                      <p className="text-sm text-gray-500">Ask questions about your documents</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-4">
                      {message.role === 'user' ? (
                        <>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="bg-blue-50 rounded-2xl rounded-tl-md p-4 border border-blue-100">
                              <p className="text-gray-900">{message.content}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                              <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-2xl rounded-tl-md p-4 border border-gray-200">
                              <ReactMarkdown 
                                className="prose prose-sm max-w-none text-gray-900"
                                components={{
                                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-4 mb-3">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-3">{children}</ol>,
                                  li: ({ children }) => <li className="mb-1">{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                  code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <SparklesIcon className="w-5 h-5 text-white animate-spin" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl rounded-tl-md p-4 border border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-500">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask a question about your documents..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        disabled={sendMessageMutation.isPending}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Welcome Screen */
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <SparklesIcon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Welcome to KnowledgeForge Chat
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Start a conversation with your AI assistant. Ask questions about your documents, 
                      get insights, and explore your knowledge base through natural language.
                    </p>
                  </div>
                </div>
                
                {/* Message Input for New Conversation */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask your first question to start a new conversation..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        disabled={sendMessageMutation.isPending}
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      <span>Start Chat</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuth'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function Layout({ children }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">Knowledge</span><span className="text-purple-600">Forge</span>
              </span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-6 py-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation.map((item) => {
                    const current = location.pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`
                            group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200
                            ${current
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-200'
                              : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 transition-colors ${
                              current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-3 py-4 text-sm font-semibold leading-6 text-gray-900 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">
                      {user?.full_name || 'User'}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="group flex w-full items-center gap-x-3 rounded-xl p-3 mt-3 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="pl-64 flex-1">
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
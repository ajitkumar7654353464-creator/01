import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, LogOut, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  onLoginClick?: () => void
}

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DTCash</h1>
                <p className="text-xs text-gray-400">USDT Exchange</p>
              </div>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center space-x-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sell">Sell USDT</NavLink>
                <NavLink to="/history">History</NavLink>
                <NavLink to="/support">Support</NavLink>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-400">Welcome back</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-white font-medium transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Buy</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

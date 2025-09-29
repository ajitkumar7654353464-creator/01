import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, LogOut, TrendingUp, Home, Clock, MessageCircle, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  onLoginClick?: () => void
}

// Desktop NavLink
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

// Mobile Dropdown Link
const DropdownLink = ({ to, icon: Icon, children, onClick }: { to: string, icon: React.ElementType, children: React.ReactNode, onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </Link>
);


const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getInitials = (name: string = '') => {
    if (!name) return 'U'
    const names = name.split(' ')
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    signOut()
    setIsDropdownOpen(false)
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Nav */}
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

          {/* Right side: Login button or Profile Dropdown */}
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700 hover:border-orange-500 transition-colors"
                >
                  <span className="text-sm font-bold text-orange-400">
                    {getInitials(user.user_metadata?.full_name || user.email)}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-400">Welcome</p>
                      </div>
                      
                      {/* Mobile Navigation */}
                      <div className="py-2 md:hidden">
                        <DropdownLink to="/" icon={Home} onClick={() => setIsDropdownOpen(false)}>Home</DropdownLink>
                        <DropdownLink to="/sell" icon={TrendingDown} onClick={() => setIsDropdownOpen(false)}>Sell USDT</DropdownLink>
                        <DropdownLink to="/history" icon={Clock} onClick={() => setIsDropdownOpen(false)}>History</DropdownLink>
                        <DropdownLink to="/support" icon={MessageCircle} onClick={() => setIsDropdownOpen(false)}>Support</DropdownLink>
                      </div>
                      
                      <div className="py-2 border-t border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import BuyPage from './pages/BuyPage'
import SellPage from './pages/SellPage'
import TransactionHistory from './pages/TransactionHistory'
import SupportPage from './pages/SupportPage'
import AuthModal from './components/AuthModal'
import TelegramButton from '@/components/TelegramButton'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Header onLoginClick={() => setIsAuthModalOpen(true)} />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage onAuthRequired={() => setIsAuthModalOpen(true)} />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
          </main>

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />

          <TelegramButton />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151'
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ConfirmationStepProps {
  transactionData: any
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ transactionData }) => {
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="w-8 h-8 text-white" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Payment Submitted!</h2>
        <p className="text-gray-400">
          Your payment details have been submitted successfully. We're processing your transaction.
        </p>
      </div>

      {/* Timer */}
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Processing Timer</span>
        </div>
        <div className="text-3xl font-bold text-yellow-400">
          {formatTime(timeRemaining)}
        </div>
        <p className="text-sm text-yellow-300 mt-2">
          Your USDT will be sent within this time frame
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-left">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount Paid:</span>
            <span className="text-white font-semibold">₹{transactionData.amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">USDT to Receive:</span>
            <span className="text-green-400 font-semibold">{transactionData.usdtAmount?.toFixed(6)} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-blue-400 font-semibold">{transactionData.networkType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wallet Address:</span>
            <span className="text-white font-mono text-sm break-all">{transactionData.walletAddress}</span>
          </div>
        </div>
      </div>

      {/* Support Info */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-semibold">Need Help?</span>
        </div>
        <p className="text-sm text-blue-300 mb-3">
          If you face any issues or have questions about your transaction, our support team is here to help.
        </p>
        <button
          onClick={() => navigate('/support')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
        >
          <span>Contact Support</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/history')}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
        >
          View History
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-white font-medium transition-all"
        >
          New Transaction
        </button>
      </div>
    </div>
  )
}

export default ConfirmationStep

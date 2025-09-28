import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface Transaction {
  id: string
  transaction_type: 'buy' | 'sell'
  amount_inr: number
  amount_usdt: number
  exchange_rate: number
  network_type: 'TRC20' | 'ERC20' | null
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  created_at: string
}

const TransactionHistory: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTransactions()
  }, [user, navigate])

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error: any) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-800'
      case 'pending':
      case 'processing':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-800'
      case 'failed':
      case 'cancelled':
        return 'text-red-400 bg-red-900/20 border-red-800'
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-400 mt-2">View all your USDT buy and sell transactions</p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h2>
            <p className="text-gray-400 mb-6">You haven't made any transactions yet. Start trading USDT now!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-white font-medium transition-all"
            >
              Start Trading
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'buy' 
                        ? 'bg-green-900/20 border-green-800' 
                        : 'bg-red-900/20 border-red-800'
                    }`}>
                      {transaction.transaction_type === 'buy' ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white capitalize">
                        {transaction.transaction_type} USDT
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-2 ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="capitalize">{transaction.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">INR Amount</p>
                    <p className="text-lg font-semibold text-white">
                      ₹{transaction.amount_inr.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">USDT Amount</p>
                    <p className="text-lg font-semibold text-green-400">
                      {transaction.amount_usdt?.toFixed(6) || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Exchange Rate</p>
                    <p className="text-lg font-semibold text-white">
                      ₹{transaction.exchange_rate || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Network</p>
                    <p className="text-lg font-semibold text-blue-400">
                      {transaction.network_type || 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory

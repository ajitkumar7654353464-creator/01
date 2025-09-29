import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  transaction_type: 'buy' | 'sell'
  amount_inr: number
  amount_usdt: number | null
  exchange_rate: number | null
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  wallet_address: string | null
  network_type: 'TRC20' | 'ERC20' | null
}

const TransactionHistory: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all')

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTransactions()
  }, [user, navigate])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, transaction_type, amount_inr, amount_usdt, exchange_rate, status, created_at, wallet_address, network_type')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions((data as Transaction[]) || [])
    } catch (error: any) {
      console.error('Error loading transactions:', error)
      toast.error('Failed to load transaction history.')
    } finally {
      setLoading(false)
    }
  }
  
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions
    return transactions.filter(tx => tx.transaction_type === filter)
  }, [transactions, filter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/30';
      case 'pending':
      case 'processing': return 'text-yellow-400 bg-yellow-900/30';
      case 'failed':
      case 'cancelled': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  }
  
  const FilterButton = ({ value, children }: { value: 'all' | 'buy' | 'sell', children: React.ReactNode }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
        filter === value
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          </div>
          <p className="text-gray-400">View all your USDT transactions</p>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          <FilterButton value="all">All</FilterButton>
          <FilterButton value="buy">Buy</FilterButton>
          <FilterButton value="sell">Sell</FilterButton>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Transactions Found</h2>
            <p className="text-gray-400">You haven't made any transactions in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/40 rounded-xl border border-gray-700/80 overflow-hidden"
              >
                <div className="p-4 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {tx.transaction_type === 'buy' 
                      ? <TrendingUp className="w-6 h-6 text-green-400" /> 
                      : <TrendingDown className="w-6 h-6 text-red-400" />}
                    <div>
                      <h3 className="font-semibold text-white capitalize">{tx.transaction_type} USDT</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.created_at).toLocaleString('en-US', {
                          year: 'numeric', month: 'numeric', day: 'numeric', 
                          hour: 'numeric', minute: 'numeric', hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {getStatusIcon(tx.status)}
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-700/80">
                  <div className="bg-gray-800/60 p-4">
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="font-semibold text-white">₹{tx.amount_inr.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-800/60 p-4">
                    <p className="text-xs text-gray-400 mb-1">USDT {tx.transaction_type === 'buy' ? 'Received' : 'Sent'}</p>
                    <p className="font-semibold text-orange-400">{tx.amount_usdt?.toFixed(6) || 'N/A'} USDT</p>
                  </div>
                  <div className="bg-gray-800/60 p-4">
                    <p className="text-xs text-gray-400 mb-1">Rate</p>
                    <p className="font-semibold text-white">₹{tx.exchange_rate?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-4 text-xs text-gray-500 space-y-1">
                  <p>Transaction ID: <span className="text-gray-400 font-mono">{tx.id}</span></p>
                  {tx.wallet_address && (
                    <p>Wallet: <span className="text-gray-400 font-mono">{tx.wallet_address} ({tx.network_type})</span></p>
                  )}
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

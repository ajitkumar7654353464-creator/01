import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, CreditCard, Wallet } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface UserInfoFormProps {
  onSubmit: (userInfo: any) => void
  transactionData: any
  setTransactionData: (data: any) => void
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, transactionData, setTransactionData }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    upiId: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [user])

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setFormData({
          fullName: data.full_name || user.user_metadata?.full_name || '',
          phoneNumber: data.phone_number || '',
          city: data.city || '',
          upiId: data.upi_id || ''
        })
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update or create user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user!.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          city: formData.city,
          upi_id: formData.upiId
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      onSubmit(formData)
    } catch (error: any) {
      console.error('Error saving user info:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
        <p className="text-gray-400">Please provide your details for the transaction.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter your city"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              UPI ID *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="your-upi@bank"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            USDT Wallet Address *
          </label>
          <div className="space-y-3">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="networkType"
                  value="TRC20"
                  checked={transactionData.networkType === 'TRC20'}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, networkType: e.target.value }))}
                  className="text-orange-500"
                />
                <span className="text-white">TRC-20 (TRON)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="networkType"
                  value="ERC20"
                  checked={transactionData.networkType === 'ERC20'}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, networkType: e.target.value }))}
                  className="text-orange-500"
                />
                <span className="text-white">ERC-20 (Ethereum)</span>
              </label>
            </div>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={transactionData.walletAddress}
                onChange={(e) => setTransactionData(prev => ({ ...prev, walletAddress: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter your USDT wallet address"
                required
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-lg text-white font-medium transition-all"
        >
          {loading ? 'Saving...' : 'Continue to Payment'}
        </motion.button>
      </form>
    </div>
  )
}

export default UserInfoForm

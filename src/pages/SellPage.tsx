import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Wallet, Building, CreditCard, Loader } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const SELL_RATE = 90; // Fixed sell rate

const SellPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    usdtAmount: '',
    networkType: 'TRC20' as 'TRC20' | 'ERC20',
    paymentMethod: 'upi' as 'upi' | 'bank',
    upiId: '',
    upiQr: null as File | null,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    walletScreenshot: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [calculatedInrAmount, setCalculatedInrAmount] = useState(0)

  const usdtAmountNum = parseFloat(formData.usdtAmount) || 0

  useEffect(() => {
    if (usdtAmountNum > 0) {
      setCalculatedInrAmount(usdtAmountNum * SELL_RATE)
    } else {
      setCalculatedInrAmount(0)
    }
  }, [usdtAmountNum])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }

    if (!user) {
      toast.error('Please login to continue')
      return
    }

    setLoading(true)
    try {
      // TODO: In a real app, you would upload files to Supabase Storage and get the URL
      // For now, we'll use placeholder names.
      const walletScreenshotUrl = formData.walletScreenshot ? `sell_proof_${user.id}_${Date.now()}` : null;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'sell',
          amount_inr: calculatedInrAmount,
          amount_usdt: usdtAmountNum,
          exchange_rate: SELL_RATE,
          network_type: formData.networkType,
          upi_id: formData.paymentMethod === 'upi' ? formData.upiId : null,
          // TODO: Add bank details to schema and insert if needed
          payment_proof_url: walletScreenshotUrl,
          status: 'pending',
          timer_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min timer
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Sell order submitted successfully!')
      navigate('/history')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create sell order')
    } finally {
      setLoading(false)
    }
  }

  const ourWalletAddresses = {
    TRC20: 'THmtZz3hpiRLrZ1dbb7vBxJj5D5EfVaGov',
    ERC20: '0xa3674b3d96bbd967b2557455a1f85459ad391f1e'
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Sell USDT</h1>
            <p className="text-gray-400">
              Convert your USDT to INR at a fixed rate of ₹{SELL_RATE.toFixed(2)}.
            </p>
          </div>

          {usdtAmountNum > 0 && (
            <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Transaction Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">You're selling</p>
                  <p className="text-lg font-semibold text-white">{usdtAmountNum} USDT</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">You'll receive</p>
                  <p className="text-lg font-semibold text-green-400">≈ ₹{calculatedInrAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Exchange Rate</p>
                  <p className="text-lg font-semibold text-white">₹{SELL_RATE.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Network</p>
                  <p className="text-lg font-semibold text-blue-400">{formData.networkType}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Sell Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        USDT Amount *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.usdtAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, usdtAmount: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        placeholder="Enter USDT amount"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Network *
                      </label>
                      <select
                        value={formData.networkType}
                        onChange={(e) => setFormData(prev => ({ ...prev, networkType: e.target.value as 'TRC20' | 'ERC20' }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="TRC20">TRC-20 (TRON)</option>
                        <option value="ERC20">ERC-20 (Ethereum)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'upi' }))}
                        className="text-orange-500"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="text-white">UPI Payment</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'bank' }))}
                        className="text-orange-500"
                      />
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!formData.usdtAmount}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-lg text-white font-medium transition-all"
                >
                  Continue
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Payment Information</h2>
                  
                  {formData.paymentMethod === 'upi' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          UPI ID *
                        </label>
                        <input
                          type="text"
                          value={formData.upiId}
                          onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                          placeholder="your-upi@bank"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                          placeholder="Bank name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                          placeholder="Account number"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          value={formData.ifscCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                          placeholder="IFSC code"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Send USDT to Our Wallet</h3>
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-2">Our {formData.networkType} Wallet Address:</p>
                    <code className="block p-3 bg-gray-900 border border-gray-600 rounded text-orange-400 font-mono text-sm break-all">
                      {ourWalletAddresses[formData.networkType]}
                    </code>
                  </div>
                  <p className="text-xs text-blue-400">
                    Send exactly {formData.usdtAmount} USDT to the above address and upload the transaction screenshot below.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Transaction Screenshot *
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, walletScreenshot: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="wallet-screenshot-upload"
                      required
                    />
                    <label htmlFor="wallet-screenshot-upload" className="cursor-pointer">
                      <Wallet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">
                        {formData.walletScreenshot ? formData.walletScreenshot.name : 'Upload transaction screenshot'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !formData.walletScreenshot}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-lg text-white font-medium transition-all"
                  >
                    {loading ? 'Submitting...' : 'Submit Sell Order'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellPage

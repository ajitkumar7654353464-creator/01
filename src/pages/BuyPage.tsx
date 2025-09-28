import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Clock, CheckCircle, Loader } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import UserInfoForm from '@/components/UserInfoForm'
import PaymentStep from '@/components/PaymentStep'
import ConfirmationStep from '@/components/ConfirmationStep'
import { useUsdtPriceTiers } from '@/hooks/useUsdtPriceTiers'

const BuyPage: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { buyTiers, loading: ratesLoading } = useUsdtPriceTiers()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [transactionData, setTransactionData] = useState({
    amount: location.state?.amount || 0,
    usdtAmount: 0,
    exchangeRate: 0,
    networkType: 'TRC20' as 'TRC20' | 'ERC20',
    walletAddress: '',
    userInfo: {
      fullName: '',
      phoneNumber: '',
      city: '',
      upiId: ''
    },
    transactionId: ''
  })
  const [loading, setLoading] = useState(true)

  const calculatedValues = useMemo(() => {
    const inrAmount = location.state?.amount || 0
    if (inrAmount <= 0 || ratesLoading || buyTiers.length === 0) {
      return { usdtAmount: 0, actualRate: 0 }
    }
    const bestRateTier = buyTiers.reduce((prev, curr) => (prev.rate_inr < curr.rate_inr ? prev : curr))
    const provisionalUsdt = inrAmount / bestRateTier.rate_inr
    const correctTier = buyTiers.find(tier => 
      provisionalUsdt >= tier.min_quantity_usdt &&
      (tier.max_quantity_usdt === null || provisionalUsdt < tier.max_quantity_usdt)
    ) || bestRateTier;

    const actualRate = correctTier.rate_inr
    const usdtAmount = Number((inrAmount / actualRate).toFixed(6))
    return { usdtAmount, actualRate }
  }, [location.state?.amount, buyTiers, ratesLoading])

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    if (ratesLoading) return

    const amount = location.state?.amount || 0
    if (amount > 0) {
      setTransactionData(prev => ({ 
        ...prev, 
        amount, 
        exchangeRate: calculatedValues.actualRate, 
        usdtAmount: calculatedValues.usdtAmount 
      }))
      setLoading(false)
    } else if (location.state?.amount === undefined) {
      // If user navigates directly, redirect to home
      navigate('/')
    } else {
      setLoading(false)
    }
  }, [user, navigate, location.state, ratesLoading, calculatedValues])

  const handleUserInfoSubmit = (userInfo: any) => {
    setTransactionData(prev => ({ ...prev, userInfo }))
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user!.id,
          transaction_type: 'buy',
          amount_inr: transactionData.amount,
          amount_usdt: transactionData.usdtAmount,
          exchange_rate: transactionData.exchangeRate,
          network_type: transactionData.networkType,
          wallet_address: transactionData.walletAddress,
          payment_proof_url: paymentData.proofUrl,
          status: 'pending',
          timer_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setTransactionData(prev => ({ ...prev, transactionId: data.id }))
      setCurrentStep(3)
      toast.success('Transaction submitted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create transaction')
    }
  }

  if (loading || ratesLoading) {
    return (
      <div className="min-h-screen bg-gray-950 py-8 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
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
            <h1 className="text-3xl font-bold text-white mb-4">Buy USDT</h1>
            
            <div className="flex items-center space-x-4">
              {[
                { step: 1, title: 'User Info', icon: Upload },
                { step: 2, title: 'Payment', icon: Clock },
                { step: 3, title: 'Confirmation', icon: CheckCircle }
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 ${
                    currentStep >= step ? 'text-white' : 'text-gray-400'
                  }`}>{title}</span>
                  {step < 3 && <div className="w-8 h-0.5 bg-gray-700 ml-4"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Transaction Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Amount (INR)</p>
                <p className="text-lg font-semibold text-white">₹{transactionData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">You'll receive</p>
                <p className="text-lg font-semibold text-green-400">{transactionData.usdtAmount.toFixed(6)} USDT</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Exchange Rate</p>
                <p className="text-lg font-semibold text-white">₹{transactionData.exchangeRate.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Network</p>
                <p className="text-lg font-semibold text-blue-400">{transactionData.networkType}</p>
              </div>
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {currentStep === 1 && (
              <UserInfoForm
                onSubmit={handleUserInfoSubmit}
                transactionData={transactionData}
                setTransactionData={setTransactionData}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentStep
                transactionData={transactionData}
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <ConfirmationStep
                transactionData={transactionData}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BuyPage

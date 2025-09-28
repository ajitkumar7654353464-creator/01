import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, Loader } from 'lucide-react'
import { useBuyingPrices } from '@/hooks/useBuyingPrices'

interface PriceCalculatorProps {
  onBuyClick: (amount: number) => void
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onBuyClick }) => {
  const [amount, setAmount] = useState('')
  const { buyTiers, loading: ratesLoading } = useBuyingPrices()

  const inrAmount = parseFloat(amount) || 0

  const { usdtAmount, actualRate } = useMemo(() => {
    if (inrAmount <= 0 || ratesLoading || buyTiers.length === 0) {
      return { usdtAmount: 0, actualRate: null }
    }

    // Find the best rate to make a provisional calculation. For buying, best rate is lowest rate.
    const bestRateTier = buyTiers.reduce((prev, curr) => (prev.price_in_inr < curr.price_in_inr ? prev : curr))
    const provisionalUsdt = inrAmount / bestRateTier.price_in_inr

    // Find the correct tier based on the provisional USDT amount
    const correctTier = buyTiers.find(tier => 
      provisionalUsdt >= tier.min_quantity &&
      (tier.max_quantity === null || provisionalUsdt < tier.max_quantity)
    ) || bestRateTier;

    const actualRate = correctTier.price_in_inr
    const usdtAmount = Number((inrAmount / actualRate).toFixed(6))

    return { usdtAmount, actualRate }
  }, [inrAmount, buyTiers, ratesLoading])

  const handleCalculate = () => {
    if (inrAmount > 0 && actualRate) {
      onBuyClick(inrAmount)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold text-white">USDT Price Calculator</h2>
      </div>

      <p className="text-gray-400 mb-6">
        Enter INR amount to see how much USDT you will receive at live rates.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter Amount (INR)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in INR"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        {inrAmount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">You pay</p>
                <p className="text-lg font-semibold text-white">₹{inrAmount.toLocaleString()}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-400">You receive</p>
                <p className="text-lg font-semibold text-green-400">{usdtAmount > 0 ? `${usdtAmount} USDT` : '...'}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              {ratesLoading ? (
                <div className="flex justify-center items-center">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-xs text-gray-400 ml-2">Loading rate...</span>
                </div>
              ) : actualRate && (
                <p className="text-xs text-gray-400">
                  Rate: ₹{actualRate.toFixed(2)} per USDT
                </p>
              )}
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
          disabled={!amount || parseFloat(amount) <= 0 || ratesLoading || !actualRate}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
        >
          {ratesLoading ? 'Loading Rates...' : 'Calculate & Pay'}
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-xs text-blue-400">
          <strong>UPI ID:</strong> {import.meta.env.VITE_UPI_ID}
        </p>
      </div>
    </motion.div>
  )
}

export default PriceCalculator

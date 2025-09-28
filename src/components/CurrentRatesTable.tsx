import React from 'react'
import { motion } from 'framer-motion'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { Loader, TrendingUp, TrendingDown } from 'lucide-react'

const CurrentRatesTable: React.FC = () => {
  const { buyRate, sellRate, loading } = useExchangeRates()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Live Exchange Rates</h2>
        <p className="text-gray-400">Our best prices, updated in real-time.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">We Buy USDT At</h3>
                <p className="text-sm text-gray-400">Your price to sell USDT to us</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {sellRate ? `₹${sellRate.toFixed(2)}` : 'N/A'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-900/50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">We Sell USDT At</h3>
                <p className="text-sm text-gray-400">Your price to buy USDT from us</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-400">
              {buyRate ? `₹${buyRate.toFixed(2)}` : 'N/A'}
            </p>
          </motion.div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-400 text-center">
          Rates are updated instantly. You can edit these from your Supabase dashboard.
        </p>
      </div>
    </motion.div>
  )
}

export default CurrentRatesTable

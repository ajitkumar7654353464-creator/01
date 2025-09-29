import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Loader, ArrowRight } from 'lucide-react'
import { useCryptoPrices } from '@/hooks/useCryptoPrices'
import { useBuyingPrices } from '@/hooks/useBuyingPrices'

interface LiveCryptoPricesProps {
  onBuyUsdtClick: () => void
}

const LiveCryptoPrices: React.FC<LiveCryptoPricesProps> = ({ onBuyUsdtClick }) => {
  const { prices, loading: coingeckoLoading, error: coingeckoError } = useCryptoPrices()
  const { tiers, loading: ratesLoading } = useBuyingPrices()

  const loading = coingeckoLoading || ratesLoading
  const usdtStartRate = tiers.length > 0 ? tiers[0].price_inr : null

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
      >
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </motion.div>
    )
  }

  if (coingeckoError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
      >
        <p className="text-center text-red-400">Failed to load crypto prices</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <h2 className="text-xl font-bold text-white mb-6">Live Crypto Prices</h2>
      
      <div className="space-y-4">
        {prices.map((crypto, index) => {
          const isUsdt = crypto.id === 'tether'
          
          return (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={crypto.image} 
                  alt={crypto.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{crypto.name}</p>
                  <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-white">
                  {isUsdt && usdtStartRate ? `₹${usdtStartRate.toFixed(2)}` : `₹${crypto.current_price.toLocaleString()}`}
                </p>
                <div className="flex items-center space-x-1 justify-end">
                  {crypto.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm ${
                    crypto.price_change_percentage_24h > 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {isUsdt && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBuyUsdtClick}
                  className="ml-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-semibold flex items-center space-x-1"
                >
                  <span>Buy</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Market data provided by CoinGecko
      </p>
    </motion.div>
  )
}

export default LiveCryptoPrices

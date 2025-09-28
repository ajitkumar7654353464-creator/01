import React from 'react'
import { motion } from 'framer-motion'
import { usePriceTiers } from '../hooks/usePriceTiers'
import { Loader } from 'lucide-react'

const SellingPricesTable: React.FC = () => {
  const { sellTiers, loading } = usePriceTiers()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Our Selling Prices</h2>
        <p className="text-gray-400">Get the best value when you sell your USDT</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-700">
        <div className="grid grid-cols-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center">
            <h3 className="font-bold text-white text-lg">AMOUNT (IN INR)</h3>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center">
            <h3 className="font-bold text-white text-lg">PRICE (PER USDT)</h3>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="col-span-2 bg-gray-800 p-8 flex justify-center items-center">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : sellTiers.length > 0 ? (
            sellTiers.map((tier, index) => (
              <React.Fragment key={tier.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-4 text-center border-b border-gray-700 last:border-b-0"
                >
                  <span className="text-white font-semibold text-lg">
                    ₹{tier.min_amount_inr.toLocaleString()} - {tier.max_amount_inr ? `₹${tier.max_amount_inr.toLocaleString()}` : 'Above'}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-4 text-center border-b border-gray-700 last:border-b-0"
                >
                  <span className="text-yellow-400 font-semibold text-lg">₹{tier.rate.toFixed(2)}</span>
                </motion.div>
              </React.Fragment>
            ))
          ) : (
            <div className="col-span-2 bg-gray-800 p-8 text-center">
              <p className="text-gray-400">Selling prices are not available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg">
        <p className="text-sm text-indigo-400 text-center">
          Sell your USDT to us at these competitive, real-time rates.
        </p>
      </div>
    </motion.div>
  )
}

export default SellingPricesTable

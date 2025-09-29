import React from 'react'
import { motion } from 'framer-motion'
import { useBuyingPrices } from '../hooks/useBuyingPrices'
import { Loader } from 'lucide-react'

const BuyingPricesTable: React.FC = () => {
  const { tiers, loading, error } = useBuyingPrices()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-950 rounded-2xl p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Our Buying Prices</h2>
        <p className="text-gray-400">Competitive rates for all transaction volumes</p>
      </div>

      <div className="max-w-md mx-auto bg-dt-brown-dark rounded-xl border border-dt-brown-medium overflow-hidden">
        <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-dt-brown-medium text-dt-gold font-semibold uppercase text-sm">
          <h3>Quantity (in USDT)</h3>
          <h3 className="text-right">Our Price (in INR)</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-dt-gold" />
          </div>
        ) : error || tiers.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p>{error || 'Buying prices are not available at the moment.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-dt-brown-medium">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-2 gap-4 px-6 py-4"
              >
                <p className="font-mono text-white">{tier.quantity_range}</p>
                <p className="font-mono text-right text-green-400 font-semibold">
                  ₹{tier.price_inr.toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 max-w-md mx-auto p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-400 text-center">
          Prices are updated in real-time. You can edit them from your Supabase dashboard.
        </p>
      </div>
    </motion.div>
  )
}

export default BuyingPricesTable

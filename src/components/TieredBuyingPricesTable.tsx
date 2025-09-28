import React from 'react'
import { motion } from 'framer-motion'
import { useBuyingPrices } from '@/hooks/useBuyingPrices'
import { Loader } from 'lucide-react'

const BuyingPricesTable: React.FC = () => {
  const { buyTiers, loading } = useBuyingPrices()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Our Buying Prices</h2>
        <p className="text-gray-400 mt-2">Competitive rates for all transaction volumes</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-dt-brown-light bg-dt-brown-dark shadow-lg">
        <div className="grid grid-cols-2">
          {/* Header */}
          <div className="bg-dt-brown-medium p-4 text-center">
            <h3 className="font-bold text-dt-gold tracking-wider text-sm uppercase">Quantity (in USDT)</h3>
          </div>
          <div className="bg-dt-brown-medium p-4 text-center">
            <h3 className="font-bold text-dt-gold tracking-wider text-sm uppercase">Our Price (in INR)</h3>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="col-span-2 p-8 flex justify-center items-center">
              <Loader className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : buyTiers.length > 0 ? (
            buyTiers.map((tier, index) => (
              <React.Fragment key={tier.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 text-center border-t border-dt-brown-light"
                >
                  <span className="text-white font-semibold text-lg">
                    {tier.min_quantity} - {tier.max_quantity ? `${tier.max_quantity}` : '+'}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 text-center border-t border-dt-brown-light"
                >
                  <span className="text-white font-semibold text-lg">₹{tier.price_in_inr.toFixed(2)}</span>
                </motion.div>
              </React.Fragment>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center">
              <p className="text-gray-400">Buying prices are not available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-400 text-center">
          Prices are updated in real-time. Admins can edit them from the Supabase dashboard.
        </p>
      </div>
    </motion.div>
  )
}

export default BuyingPricesTable

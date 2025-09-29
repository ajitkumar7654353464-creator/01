import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, DollarSign, Smartphone, MessageCircle, Send } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import PriceCalculator from '@/components/PriceCalculator'
import LiveCryptoPrices from '@/components/LiveCryptoPrices'
import BuyingPricesTable from '@/components/BuyingPricesTable'
import FAQ from '@/components/FAQ'

interface HomePageProps {
  onAuthRequired: () => void
}

const HomePage: React.FC<HomePageProps> = ({ onAuthRequired }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const calculatorRef = useRef<HTMLDivElement>(null)

  const handleBuyClick = (amount?: number, usdtAmount?: number, exchangeRate?: number) => {
    if (!user) {
      onAuthRequired()
      return
    }
    navigate('/buy', { state: { amount, usdtAmount, exchangeRate } })
  }

  const handleSellClick = () => {
    if (!user) {
      onAuthRequired()
      return
    }
    navigate('/sell')
  }

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Buy & Sell <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">USDT</span> Instantly
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Easy Transactions • Secure • Fast Delivery
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToCalculator()}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl text-white font-semibold text-lg flex items-center space-x-2 transition-all"
              >
                <span>Buy USDT</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSellClick}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-semibold text-lg flex items-center space-x-2 transition-all"
              >
                <span>Sell USDT</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Price Calculator */}
            <div ref={calculatorRef}>
              <PriceCalculator onBuyClick={handleBuyClick} />
            </div>

            {/* Live Crypto Prices */}
            <LiveCryptoPrices onBuyUsdtClick={scrollToCalculator} />
          </div>
        </div>
      </section>

      {/* Buying Prices Table */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BuyingPricesTable />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose DTCash?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the best USDT trading platform in India with unmatched security and competitive rates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Instant UPI Payments',
                description: 'Lightning fast payments through secure UPI gateway'
              },
              {
                icon: Shield,
                title: 'Secure & Trusted',
                description: 'Bank-grade security with encrypted transactions'
              },
              {
                icon: DollarSign,
                title: 'Best Market Rates',
                description: 'Competitive rates with transparent pricing'
              },
              {
                icon: Smartphone,
                title: 'Easy to Use',
                description: 'Seamless experience on any device, anywhere'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Best platform to buy USDT in India at competitive rates.
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://t.me/bitgoldy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Join Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

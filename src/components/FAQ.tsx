import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How can I buy USDT?',
      answer: 'Simply enter the INR amount, calculate, and pay via UPI/QR. USDT will be sent instantly to your wallet.'
    },
    {
      question: 'Is it safe?',
      answer: 'Yes, we use secure payment channels and trusted wallets for every transaction. All payments are encrypted and protected.'
    },
    {
      question: 'How fast is delivery?',
      answer: 'Usually within 5–10 minutes after payment confirmation. Our automated system ensures quick processing.'
    },
    {
      question: 'What is the minimum amount?',
      answer: 'You can start buying from as low as ₹500. There\'s no maximum limit for transactions.'
    },
    {
      question: 'Which networks do you support?',
      answer: 'We support both USDT TRC-20 (TRON Network) and USDT ERC-20 (Ethereum Network) for maximum flexibility.'
    },
    {
      question: 'Can I sell USDT too?',
      answer: 'Yes! You can sell your USDT for INR through our platform. The process is just as quick and secure as buying.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-4 text-left bg-gray-800 hover:bg-gray-750 transition-colors flex justify-between items-center"
            >
              <span className="font-medium text-white">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-orange-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-850 border-t border-gray-700">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default FAQ

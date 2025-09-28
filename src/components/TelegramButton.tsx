import React from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const TelegramButton: React.FC = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/bitgoldy', '_blank')
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleTelegramClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
      aria-label="Contact on Telegram"
    >
      <Send className="w-7 h-7 text-white" />
    </motion.button>
  )
}

export default TelegramButton

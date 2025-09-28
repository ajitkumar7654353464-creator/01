import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Copy, CheckCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

interface PaymentStepProps {
  transactionData: any
  onSubmit: (paymentData: any) => void
  onBack: () => void
}

const PaymentStep: React.FC<PaymentStepProps> = ({ transactionData, onSubmit, onBack }) => {
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const upiId = import.meta.env.VITE_UPI_ID || 'usdtinrbit@axl'
  const upiUrl = `upi://pay?pa=${upiId}&am=${transactionData.amount}&tn=USDT%20Purchase`

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    toast.success('UPI ID copied to clipboard!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proofFile) {
      toast.error('Please upload the payment proof screenshot')
      return
    }

    setUploading(true)
    try {
      // In a real app, you would upload the file to storage
      // For now, we'll simulate the upload
      const proofUrl = `payment_proof_${Date.now()}.jpg`
      
      onSubmit({
        proofUrl
      })
    } catch (error: any) {
      toast.error('Failed to submit payment details')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
        <p className="text-gray-400">
          Complete your payment using UPI and provide the transaction details below.
        </p>
      </div>

      {/* UPI Payment Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Pay via UPI</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">UPI ID</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-orange-400 font-mono">
                  {upiId}
                </code>
                <button
                  onClick={handleCopyUPI}
                  className="p-2 bg-orange-500 hover:bg-orange-600 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Amount to Pay</p>
              <p className="text-2xl font-bold text-white">₹{transactionData.amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG 
                value={upiUrl}
                size={150}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
          <p className="text-sm text-blue-400">
            <strong>Instructions:</strong> Scan the QR code or use the UPI ID to make payment. 
            After successful payment, upload the screenshot below.
          </p>
        </div>
      </div>

      {/* Payment Confirmation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Payment Screenshot *
          </label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="proof-upload"
            />
            <label htmlFor="proof-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">
                {proofFile ? proofFile.name : 'Click to upload payment screenshot'}
              </p>
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
          >
            Back
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={uploading}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 rounded-lg text-white font-medium transition-all flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <span>Processing...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Payment</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default PaymentStep

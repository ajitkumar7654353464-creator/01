import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageCircle, Clock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Ticket {
  id: string
  subject: string
  description: string | null
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  transaction_id: string | null
}

const SupportPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    loadTickets()
  }, [user, navigate])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error: any) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject')
      return
    }
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          user_id: user!.id,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          status: 'open'
        })

      if (error) throw error

      toast.success('Support ticket created successfully!')
      setFormData({ subject: '', description: '', priority: 'medium' })
      setShowCreateForm(false)
      loadTickets()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400 bg-blue-900/30';
      case 'in_progress': return 'text-yellow-400 bg-yellow-900/30';
      case 'resolved':
      case 'closed': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/30';
      case 'high': return 'text-orange-400 bg-orange-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
            <h1 className="text-3xl font-bold text-white">Support Center</h1>
          </div>
          <p className="text-gray-400 mb-6">Get help with your transactions</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-white font-medium transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ticket</span>
          </motion.button>
        </div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Create Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              {/* Form fields remain the same, just styled within the modal/form area */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData(p => ({ ...p, priority: e.target.value as any }))} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">Cancel</button>
                <motion.button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white font-medium transition-all disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Create Ticket'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {tickets.length === 0 && !showCreateForm ? (
          <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">No Support Tickets</h2>
            <p className="text-gray-400">You haven't created any support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/40 rounded-xl border border-gray-700/80 overflow-hidden"
              >
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">{ticket.subject}</h3>
                      {ticket.description && <p className="text-sm text-gray-400 mt-1">{ticket.description}</p>}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(ticket.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end gap-2 flex-shrink-0 self-start sm:self-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      <span className="capitalize">{ticket.priority}</span>
                    </div>
                  </div>
                </div>
                {(ticket.id || ticket.transaction_id) && (
                  <div className="border-t border-gray-700/80 p-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                    <p>Ticket ID: <span className="text-gray-400 font-mono">{ticket.id}</span></p>
                    {ticket.transaction_id && <p>Transaction: <span className="text-gray-400 font-mono">{ticket.transaction_id}</span></p>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportPage

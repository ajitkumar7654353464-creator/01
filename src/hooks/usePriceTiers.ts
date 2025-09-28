import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '../lib/supabase'

type PriceTier = Database['public']['Tables']['price_tiers']['Row']

interface PriceTiers {
  buyTiers: PriceTier[]
  sellTiers: PriceTier[]
}

export const usePriceTiers = () => {
  const [tiers, setTiers] = useState<PriceTiers>({ buyTiers: [], sellTiers: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('price_tiers')
        .select('*')
        .order('min_amount_inr', { ascending: true })

      if (error) throw error

      const buyTiers = data.filter(tier => tier.type === 'buy')
      const sellTiers = data.filter(tier => tier.type === 'sell')

      setTiers({ buyTiers, sellTiers })
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch price tiers')
      console.error('Error fetching price tiers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTiers()

    const channel = supabase
      .channel('price_tiers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'price_tiers' },
        (payload) => {
          console.log('Price tier change received!', payload)
          fetchTiers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTiers])

  return { ...tiers, loading, error }
}

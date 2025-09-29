import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '../lib/supabase'

export type BuyingPriceTier = Database['public']['Tables']['buying_prices']['Row']

export const useBuyingPrices = () => {
  const [tiers, setTiers] = useState<BuyingPriceTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('buying_prices')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error

      setTiers(data || [])
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch buying prices')
      console.error('Error fetching buying prices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTiers()

    const channel = supabase
      .channel('buying_prices_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buying_prices' },
        (payload) => {
          console.log('Buying prices change received!', payload)
          fetchTiers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTiers])

  return { tiers, loading, error }
}

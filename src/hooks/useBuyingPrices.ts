import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '@/lib/supabase'

export type BuyingPrice = Database['public']['Tables']['buying_prices']['Row']

interface BuyingPrices {
  buyTiers: BuyingPrice[]
  sellRate: number
}

export const useBuyingPrices = () => {
  const [prices, setPrices] = useState<BuyingPrices>({ buyTiers: [], sellRate: 90 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('buying_prices')
        .select('*')
        .order('min_quantity', { ascending: true })

      if (error) throw error

      setPrices({ buyTiers: data, sellRate: 90 }) // Sell rate is fixed
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch buying prices')
      console.error('Error fetching buying prices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()

    const channel = supabase
      .channel('buying_prices_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buying_prices' },
        (payload) => {
          console.log('Buying price change received!', payload)
          fetchPrices()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPrices])

  return { ...prices, loading, error }
}

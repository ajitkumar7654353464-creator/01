import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '@/lib/supabase'

export type PriceTier = Database['public']['Tables']['usdt_price_tiers']['Row']

interface UsdtPriceTiers {
  buyTiers: PriceTier[]
  sellRate: number
}

export const useUsdtPriceTiers = () => {
  const [tiers, setTiers] = useState<UsdtPriceTiers>({ buyTiers: [], sellRate: 90 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('usdt_price_tiers')
        .select('*')
        .eq('type', 'buy')
        .order('min_quantity_usdt', { ascending: true })

      if (error) throw error

      setTiers({ buyTiers: data, sellRate: 90 }) // Sell rate is fixed
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
      .channel('usdt_price_tiers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usdt_price_tiers' },
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

import { useState, useEffect, useCallback } from 'react'
import { supabase, Database } from '../lib/supabase'

type AppConfig = Database['public']['Tables']['app_config']['Row']

interface ExchangeRates {
  buyRate: number | null
  sellRate: number | null
}

export const useExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRates>({ buyRate: null, sellRate: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('key, value')
        .in('key', ['buy_rate', 'sell_rate'])

      if (error) throw error

      const buyRate = data.find(item => item.key === 'buy_rate')?.value || null
      const sellRate = data.find(item => item.key === 'sell_rate')?.value || null

      setRates({ buyRate, sellRate })
      setError(null)
    } catch (err: any) {
      setError('Failed to fetch exchange rates')
      console.error('Error fetching exchange rates:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()

    const channel = supabase
      .channel('app_config_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_config' },
        (payload) => {
          console.log('Exchange rate change received!', payload)
          fetchRates()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchRates])

  return { ...rates, loading, error }
}

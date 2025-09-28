import { useState, useEffect } from 'react'
import axios from 'axios'

interface CryptoPrice {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'inr',
              ids: 'tether,bitcoin,ethereum,binancecoin,solana',
              order: 'market_cap_desc',
              per_page: 5,
              page: 1,
              sparkline: false
            }
          }
        )
        setPrices(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch crypto prices')
        console.error('Error fetching crypto prices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return { prices, loading, error }
}

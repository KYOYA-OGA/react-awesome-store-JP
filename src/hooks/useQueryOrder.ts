import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'

import { Order } from '../types'
import { ordersRef, snapshotToDoc } from '../firebase'

export const useQueryOrder = (orderId: string) => {
  const { loading, setLoading, error, setError } = useAsyncCall()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = ordersRef.doc(orderId).onSnapshot({
      next: (snapshot) => {
        if (!snapshot.exists) {
          setOrder(null)
          setError('Order not found')
          setLoading(false)
          return
        }

        const order = snapshotToDoc<Order>(snapshot)

        setOrder(order)
        setLoading(false)
      },
      error: (err) => {
        setError(err.message)
        setOrder(null)
        setLoading(false)
      },
    })
    return () => unsubscribe()
    // eslint-disable-next-line
  }, [])

  return { order, loading, error }
}

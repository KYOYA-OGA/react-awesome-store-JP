import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { StripeCustomer, UserCards, UserInfo } from '../types'
import { functions } from '../firebase/config'

export const useFetchCards = (userInfo: UserInfo | null) => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const [userCards, setUserCards] = useState<UserCards | null>(null)
  const [stripeCustomer, setStripeCustomer] = useState<StripeCustomer | null>(
    null
  )

  useEffect(() => {
    if (!userInfo?.stripeCustomerId) return

    let mounted = true

    const fetchCards = async (customerId: string) => {
      try {
        setLoading(true)

        const listPaymentMethods = functions.httpsCallable('listPaymentMethods')

        const customerData = (await listPaymentMethods({ customerId })) as {
          data: { paymentMethods: UserCards; customer: StripeCustomer }
        }

        if (mounted) {
          setUserCards(customerData.data.paymentMethods)
          setStripeCustomer(customerData.data.customer)
          setLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setError('Sorry, something went wrong')
          setLoading(false)
        }
      }
    }

    fetchCards(userInfo?.stripeCustomerId)

    return () => {
      mounted = false
    }
    // eslint-disable-next-line
  }, [setUserCards, setStripeCustomer, setError, setLoading])

  return { userCards, setUserCards, stripeCustomer, loading, error }
}

import { useAsyncCall } from './useAsyncCall'
import { functions } from '../firebase/config'
import { PaymentMethod } from '@stripe/stripe-js'

export const useRemoveCard = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const removeCard = async (payment_method: string) => {
    try {
      setLoading(true)

      const detachPaymentMethod = functions.httpsCallable('detachPaymentMethod')

      const {
        data: { paymentMethod },
      } = (await detachPaymentMethod({ payment_method })) as {
        data: { paymentMethod: PaymentMethod }
      }
      return paymentMethod
    } catch (error) {
      setError('Sorry, something went wrong')
      setLoading(false)

      return false
    }
  }

  return { removeCard, loading, error }
}

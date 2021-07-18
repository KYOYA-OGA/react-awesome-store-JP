import { Stripe } from '@stripe/stripe-js'

import { useAsyncCall } from './useAsyncCall'

import { db, functions, firebase } from '../firebase/config'
import { cartRef, ordersRef } from '../firebase'

import {
  CartItem,
  CreatePaymentIntentData,
  CreatePaymentMethod,
  UploadOrder,
} from '../types'
import { address_key } from '../components/select-address/ShippingAddress'

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const completePayment = async (
    paymentData: {
      createPaymentIntentData: CreatePaymentIntentData
      stripe: Stripe
      payment_method: CreatePaymentMethod
    },
    options: {
      save: boolean | undefined
      setDefault: boolean | undefined
      customerId?: string
    },
    order: UploadOrder,
    cart: CartItem[]
  ) => {
    const { createPaymentIntentData, stripe, payment_method } = paymentData
    const { save, setDefault, customerId } = options
    try {
      setLoading(true)

      // call the cloud function to get a client secret
      const createPaymentIntents = functions.httpsCallable(
        'createPaymentIntents'
      )

      const paymentIntent = (await createPaymentIntents(
        createPaymentIntentData
      )) as { data: { clientSecret: string } }

      if (!paymentIntent.data.clientSecret) return

      // 2.confirm the payment
      const confirmPayment = await stripe.confirmCardPayment(
        paymentIntent.data.clientSecret,
        {
          payment_method,
          save_payment_method: save,
        }
      )

      if (confirmPayment?.error?.message) {
        setError(confirmPayment.error.message)
        setLoading(false)
        return false
      }

      if (confirmPayment.paymentIntent?.status === 'succeeded') {
        if (setDefault) {
          const setDefaultCard = functions.httpsCallable('setDefaultCard')

          await setDefaultCard({
            customerId,
            payment_method: confirmPayment.paymentIntent?.payment_method,
          })
        }

        // Create a new order in firestore
        const uploadOrder: UploadOrder = {
          ...order,
          paymentStatus: 'Success',
          shipmentStatus: 'New',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }

        await ordersRef.add(uploadOrder).then(() => {
          // Delete the cart items from firestore
          cartRef
            .where('user', '==', order.user.id)
            .get()
            .then((snapshots) => {
              const batch = db.batch()
              snapshots.forEach((doc) =>
                cart.forEach((item) =>
                  item.id === doc.id ? batch.delete(doc.ref) : null
                )
              )

              return batch.commit()
            })
        })

        window.localStorage.removeItem(address_key)
        setLoading(false)
        return true
      }

      return false
    } catch (error) {
      setError('Sorry, something went wrong')
      setLoading(false)

      return false
    }
  }

  const createStripeCustomerId = async () => {
    try {
      setLoading(true)

      const createStripeCustomer = functions.httpsCallable(
        'createStripeCustomer'
      )

      const stripeCustomerData = (await createStripeCustomer()) as {
        data: { customerId: string }
      }

      return stripeCustomerData.data.customerId
    } catch (error) {
      setError('Sorry, something went wrong')
      setLoading(false)

      return undefined
    }
  }

  return { completePayment, createStripeCustomerId, loading, error }
}

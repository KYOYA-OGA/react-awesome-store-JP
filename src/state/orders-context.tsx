import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react'

import { useAuthContext } from './auth-context'
import { useAsyncCall } from '../hooks/useAsyncCall'
import { Order } from '../types'
import { isAdmin, isClient } from '../helpers'
import { firebase } from '../firebase/config'
import { ordersRef, snapshotToDoc } from '../firebase'

const ordersQueryLimit = 20

interface Props {}

type OrderState = {
  orders: Order[] | null
  loading: boolean
  error: string
  queryMoreOrders: () => void
}

type OrderDispatch = {
  setOrders: Dispatch<SetStateAction<Order[] | null>>
}

const OrdersStateContext = createContext<OrderState | undefined>(undefined)
const OrderDispatchContext = createContext<OrderDispatch | undefined>(undefined)

const OrdersContextProvider: React.FC<Props> = ({ children }) => {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [lastDocument, setLastDocument] =
    useState<firebase.firestore.DocumentData>()

  const { loading, setLoading, error, setError } = useAsyncCall()
  const {
    authState: { userInfo },
  } = useAuthContext()

  // Next Query
  const queryMoreOrders = async () => {
    try {
      if (!lastDocument) return

      setLoading(true)

      const snapshots = await ordersRef
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocument)
        .limit(ordersQueryLimit)
        .get()

      const newOrders = snapshots.docs.map((snapshot) =>
        snapshotToDoc<Order>(snapshot)
      )

      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      setLastDocument(lastVisible)

      // Combine the new orders with the existing state
      setOrders((prev) => (prev ? [...prev, ...newOrders] : newOrders))
      setLoading(false)
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)
    }
  }

  // Query orders from firestore (first query)
  useEffect(() => {
    if (!userInfo) return setOrders(null)

    setLoading(true)

    let unsubscribe: () => void

    // if user is a client, query only the orders that belong to this user
    if (isClient(userInfo.role)) {
      unsubscribe = ordersRef
        .where('user.id', '==', userInfo.id)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
          next: (snapshots) => {
            const orders: Order[] = []
            snapshots.forEach((snapshot) => {
              const order = snapshotToDoc<Order>(snapshot)
              orders.push(order)
            })

            setOrders(orders)
            setLoading(false)
          },
          error: (err) => {
            setError(err.message)
            setOrders(null)
            setLoading(false)
          },
        })

      // if user is an admin, query all orders
    } else if (isAdmin(userInfo.role)) {
      unsubscribe = ordersRef
        .orderBy('createdAt', 'desc')
        .limit(ordersQueryLimit)
        .onSnapshot({
          next: (snapshots) => {
            const orders = snapshots.docs.map((snapshot) =>
              snapshotToDoc<Order>(snapshot)
            )

            // snapshots.forEach((snapshot) => {
            //   const order = snapshotToDoc<Order>(snapshot)
            //   orders.push(order)
            // })

            const lastVisible = snapshots.docs[snapshots.docs.length - 1]
            setLastDocument(lastVisible)

            setOrders(orders)
            setLoading(false)
          },
          error: (err) => {
            setError(err.message)
            setOrders(null)
            setLoading(false)
          },
        })
    }

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <OrdersStateContext.Provider
      value={{ orders, loading, error, queryMoreOrders }}
    >
      <OrderDispatchContext.Provider value={{ setOrders }}>
        {children}
      </OrderDispatchContext.Provider>
    </OrdersStateContext.Provider>
  )
}

export default OrdersContextProvider

export const useOrdersContext = () => {
  const ordersState = useContext(OrdersStateContext)
  const ordersDispatch = useContext(OrderDispatchContext)

  if (ordersState === undefined || ordersDispatch === undefined)
    throw new Error(
      'useOrdersContext must be used within OrdersContextProvider'
    )

  return { ordersState, ordersDispatch }
}

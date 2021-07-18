import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react'

import { useAuthContext } from './auth-context'
import { isAdmin } from '../helpers'
import { orderCountsRef } from '../firebase'

interface Props {}

type OrderCounts = {
  orderCounts: number
}

type OrderCountsDispatch = {
  setOrderCounts: Dispatch<SetStateAction<number>>
}

const OrderCountsStateContext = createContext<OrderCounts | undefined>(
  undefined
)
const OrderCountsDispatchContext = createContext<
  OrderCountsDispatch | undefined
>(undefined)

const OrderCountsContextProvider: React.FC<Props> = ({ children }) => {
  const [orderCounts, setOrderCounts] = useState(0)

  const {
    authState: { userInfo },
  } = useAuthContext()

  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) return setOrderCounts(0)

    const unsubscribe = orderCountsRef.doc('counts').onSnapshot((snapshot) => {
      const counts = snapshot.data() as { orderCounts: number }

      setOrderCounts(counts?.orderCounts)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <OrderCountsStateContext.Provider value={{ orderCounts }}>
      <OrderCountsDispatchContext.Provider value={{ setOrderCounts }}>
        {children}
      </OrderCountsDispatchContext.Provider>
    </OrderCountsStateContext.Provider>
  )
}

export default OrderCountsContextProvider

export const useOrderCountsContext = () => {
  const orderCountsState = useContext(OrderCountsStateContext)
  const orderCountsDispatch = useContext(OrderCountsDispatchContext)

  if (orderCountsState === undefined || orderCountsDispatch === undefined)
    throw new Error(
      'useOrdersContext must be used within OrdersContextProvider'
    )

  return { orderCountsState, orderCountsDispatch }
}

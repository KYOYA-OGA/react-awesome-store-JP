import React, { useState, useEffect } from 'react'

import Spinner from '../components/Spinner'
import ManageOrderItem from '../components/manage-orders/ManageOrderItem'
import Tab from '../components/Tab'
import Pagination from '../components/Pagination'
import { orderTabType } from './Orders'

import { useOrdersContext } from '../state/orders-context'
import { useOrderCountsContext } from '../state/orderCounts-context'
import { useSearchContext } from '../state/search-context'

import { usePagination } from '../hooks/usePagination'
import { useSelectTab } from '../hooks/useSelectTab'

import { Order, OrderTab } from '../types'
import { orderTabs } from '../helpers'

const ordersPerPage = 2

interface Props {}

const ManageOrders: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error, queryMoreOrders },
  } = useOrdersContext()
  const { searchedItems } = useSearchContext()

  const {
    orderCountsState: { orderCounts },
  } = useOrderCountsContext()
  const { activeTab } = useSelectTab<OrderTab>(orderTabType, 'All')

  const { page, totalPages } = usePagination<OrderTab, Order>(
    orderCounts,
    ordersPerPage,
    activeTab,
    searchedItems as Order[]
  )

  const [orderByTab, setOrderByTab] = useState(orders)

  const [paginatedSearchedItems, setPaginatedSearchedItems] =
    useState(searchedItems)

  useEffect(() => {
    const startIndex = ordersPerPage * (page - 1)
    const endIndex = ordersPerPage * page
    if (searchedItems) {
      setPaginatedSearchedItems(searchedItems.slice(startIndex, endIndex))
      setOrderByTab([])
    } else {
      if (!orders) {
        setOrderByTab(null)
        return
      }

      // Check if we need to query more orders
      if (orders.length < orderCounts && orders.length < ordersPerPage * page) {
        return queryMoreOrders()
      }

      if (activeTab === 'All') setOrderByTab(orders.slice(startIndex, endIndex))
      else
        setOrderByTab(
          orders.filter((order) => order.shipmentStatus === activeTab)
        )

      setPaginatedSearchedItems(null)
    }
    // eslint-disable-next-line
  }, [activeTab, orders, setOrderByTab, page, searchedItems, orderCounts])

  if (loading) return <Spinner color="grey" width={50} height={50} />

  if (error) return <h2 className="header--center">{error}</h2>

  if (!orders || orders.length === 0)
    return <h2 className="header--center">注文がありません</h2>

  return (
    <div className="page--orders">
      <div className="orders-header">
        <h2 className="header header--orders">注文履歴</h2>

        <div className="orders-tabs">
          {orderTabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              activeTab={activeTab}
              tabType={orderTabType}
              withPagination={true}
            />
          ))}
        </div>
      </div>

      <div className="orders-pagination">
        {activeTab === 'All' && (
          <Pagination
            page={page}
            totalPages={totalPages}
            tabType={orderTabType}
            activeTab={activeTab}
          />
        )}
      </div>

      <div className="orders-details">
        <div className="orders-content">
          <div className="orders-column">
            <h3 className="header--center">購入日</h3>
          </div>
          <div className="orders-column orders-column--hide">
            <h3 className="header--center">量</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">価格 (円)</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">配送状況</h3>
          </div>
          <div className="orders-column orders-column--hide">
            <h3 className="header--center">購入者</h3>
          </div>
          <div className="orders-column orders-column--manage">
            <h3 className="header--center">注文を編集する</h3>
          </div>
        </div>

        {/* Orders */}
        {paginatedSearchedItems ? (
          <>
            {paginatedSearchedItems.length < 1 ? (
              <h2 className="header--center">注文がありません</h2>
            ) : (
              (paginatedSearchedItems as Order[]).map((order) => (
                <ManageOrderItem key={order.id} order={order} />
              ))
            )}
          </>
        ) : (
          orderByTab &&
          orderByTab.map((order) => (
            <ManageOrderItem key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}

export default ManageOrders

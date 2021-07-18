import React from 'react'
import { Link } from 'react-router-dom'

import { Order } from '../../types'
import {
  formatAmount,
  calculateCartAmount,
  calculateCartQuantity,
} from '../../helpers'

interface Props {
  order: Order
}

const OrderItem: React.FC<Props> = ({
  order: { id, createdAt, items, shipmentStatus },
}) => {
  return (
    <Link to={`/orders/my-orders/${id}`}>
      <div className="orders-content orders-content--content">
        <div className="orders-column">
          <p className="paragraph--center paragraph--focus">
            {createdAt.toDate().toDateString()}
          </p>
        </div>
        <div className="orders-column">
          <p className="paragraph--center paragraph--focus">
            {calculateCartQuantity(items)}
          </p>
        </div>
        <div className="orders-column">
          <p className="paragraph--center paragraph--focus">
            {formatAmount(calculateCartAmount(items))}
          </p>
        </div>
        <div className="orders-column">
          <p
            className="paragraph--center paragraph--focus"
            style={{
              color:
                shipmentStatus === 'New'
                  ? 'blue'
                  : shipmentStatus === 'Preparing'
                  ? 'chocolate'
                  : shipmentStatus === 'Shipped'
                  ? 'green'
                  : shipmentStatus === 'Delivered'
                  ? 'grey'
                  : shipmentStatus === 'Canceled'
                  ? 'red'
                  : undefined,
            }}
          >
            {shipmentStatus ? shipmentStatus : ''}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default OrderItem

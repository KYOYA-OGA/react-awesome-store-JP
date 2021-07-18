import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../Button'

import { Order } from '../../types'
import {
  formatAmount,
  calculateCartAmount,
  calculateCartQuantity,
} from '../../helpers'

interface Props {
  order: Order
}

const ManageOrderItem: React.FC<Props> = ({
  order: {
    id,
    createdAt,
    items,
    shipmentStatus,
    user: { name },
  },
}) => {
  return (
    <Link to={`/admin/manage-orders/${id}`}>
      <div className="orders-content orders-content--content">
        <div className="orders-column">
          <p className="paragraph--center paragraph--focus">
            {createdAt.toDate().toDateString()}
          </p>
        </div>
        <div className="orders-column orders-column--hide">
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
        <div className="orders-column orders-column--hide">
          <p className="paragraph--center paragraph--focus">{name}</p>
        </div>
        <div className="orders-column orders-column--manage">
          <p className="paragraph--center paragraph--focus">
            {shipmentStatus === 'Delivered' ? (
              'Done'
            ) : (
              <Button
                width="60%"
                className="btn--orange manage-order-btn--mobile"
              >
                Manage order
              </Button>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ManageOrderItem

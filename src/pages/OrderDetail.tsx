import React from 'react'
import { useParams } from 'react-router-dom'

import Spinner from '../components/Spinner'
import PageNotFound from './PageNotFound'

import { formatAmount } from '../helpers'

import { useQueryOrder } from '../hooks/useQueryOrder'

interface Props {}

const OrderDetail: React.FC<Props> = () => {
  const params = useParams<{ id: string }>()
  const { order, loading, error } = useQueryOrder(params.id)

  if (loading) return <Spinner color="grey" width={50} height={50} />

  if (error) return <h2 className="header--center">{error}</h2>

  if (!order) return <PageNotFound />

  const {
    id,
    amount,
    items,
    shippingAddress: { address2, address1, city, zipCode, phone, fullname },
    paymentStatus,
    shipmentStatus,
  } = order

  return (
    <div className="page--order-details">
      <h2 className="header">Your order detail</h2>

      <div className="order-section">
        <h4 className="header">Order ID:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">{id}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">Purchased Items:</h4>
        {items.map(({ quantity, item: { id, title, price } }, i) => (
          <div key={id} className="order-section__content">
            <div className="order-item">
              <p className="paragraph paragraph--focus" style={{ width: '5%' }}>
                {i + 1}
              </p>
              <p
                className="paragraph paragraph--focus"
                style={{ width: '50%' }}
              >
                {title}
              </p>
              <p
                className="paragraph paragraph--focus"
                style={{ width: '15%' }}
              >
                {quantity} x {formatAmount(price)}
              </p>
              <p className="paragraph paragraph--focus" style={{ width: '5%' }}>
                =
              </p>
              <p
                className="paragraph paragraph--focus"
                style={{ width: '20%' }}
              >
                ${formatAmount(quantity * price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-section">
        <h4 className="header">Order amount:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">${formatAmount(amount)}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">Delivery address:</h4>
        <div className="order-section__content">
          <div className="order-address">
            <p className="paragraph">
              Recipient name:{' '}
              <span className="paragraph--focus">{fullname}</span>
            </p>
            <p className="paragraph paragraph--focus">
              {address1}, {address2 ? address2 : ''}, {city}, {zipCode}, Tel:{' '}
              {phone}
            </p>
          </div>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">Payment status:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">{paymentStatus || 'n/a'}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">Shippment status:</h4>
        <div className="order-section__content">
          <p
            className="paragraph paragraph--focus"
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
            {shipmentStatus || 'n/a'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

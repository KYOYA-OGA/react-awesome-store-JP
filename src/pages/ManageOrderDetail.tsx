import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import Spinner from '../components/Spinner'
import Button from '../components/Button'
import ShipmentStatusControl from '../components/manage-orders/ShipmentStatusControl'
import PageNotFound from './PageNotFound'

import { formatAmount } from '../helpers'

import { useQueryOrder } from '../hooks/useQueryOrder'

interface Props {}

const ManageOrderDetail: React.FC<Props> = () => {
  const params = useParams<{ id: string }>()
  const { order, loading, error } = useQueryOrder(params.id)

  const labelRef = useRef<HTMLDivElement>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const printShippingLabel = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: `Shipping label ${params.id}`,
  })

  const printInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice - ${params.id}`,
  })

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
    createdAt,
  } = order

  return (
    <div className="page--order-details">
      <h2 className="header">注文詳細</h2>

      <div className="order-printing">
        {shipmentStatus === 'New' ? (
          <>
            {/* Shipping label */}
            <div className="order-printing__section">
              <Button
                width="100%"
                className="btn--orange"
                onClick={printShippingLabel}
              >
                配送先住所を印刷する
              </Button>
            </div>

            <div className="print-component">
              <div className="page shipping-label" ref={labelRef}>
                <div className="label">
                  <h4 className="header">注文者: {fullname}</h4>
                  <p className="paragraph">{address1},</p>
                  {address2 && <p className="paragraph">{address2}</p>}
                  <p className="paragraph">
                    {city},{zipCode}
                  </p>
                  <p className="paragraph">電話番号 : {phone}</p>

                  <p className="paragraph">
                    注文番号: <span className="paragraph--focus">{id}</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Invoice */}
            <div className="order-printing__section">
              <Button
                width="100%"
                className="btn--orange"
                onClick={printInvoice}
              >
                インボイスを印刷する
              </Button>

              <div className="print-component">
                <div className="page invoice" ref={invoiceRef}>
                  <h1 className="header--center">AwesomeShop</h1>

                  <div className="invoice__head">
                    <h3 className="header">販売者:</h3>
                    <h4 className="header">AwesomeShop</h4>
                    <p className="paragraph">〒418-0011 富士吉田市</p>
                    <p className="paragraph">富士山</p>
                    {/* <p className="paragraph">Minnesota 73128</p> */}
                    <p className="paragraph">Tel: 405-474-0406</p>
                  </div>

                  <div className="invoice__head">
                    <h3 className="header">購入者:</h3>
                    <h4 className="header">{fullname}</h4>
                    <p className="paragraph">{address1}</p>
                    {address2 && <p className="paragraph">{address2}</p>}
                    <p className="paragraph">
                      {city} {zipCode}
                    </p>
                    <p className="paragraph">電話番号: {phone}</p>
                  </div>

                  <div className="invoice__head">
                    <p className="paragraph">
                      インボイス No.:{' '}
                      <span className="paragraph--focus">{id}</span>
                    </p>
                    <p className="paragraph">
                      インボイス日付:{' '}
                      <span className="paragraph--focus">
                        {createdAt.toDate().toDateString()}
                      </span>
                    </p>
                  </div>

                  <table className="table invoice__items">
                    <thead className="invoice__header-row">
                      <tr>
                        <th className="table-cell">商品</th>
                        <th className="table-cell" style={{ width: '40%' }}>
                          説明
                        </th>
                        <th className="table-cell">量</th>
                        <th className="table-cell">価格</th>
                        <th className="table-cell">計</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map(
                        ({ quantity, item: { title, price } }, i) => (
                          <tr key={i}>
                            <td className="table-cell paragraph--center">
                              {i + 1}
                            </td>
                            <td className="table-cell paragraph--center">
                              {title}
                            </td>
                            <td className="table-cell paragraph--center">
                              {quantity}
                            </td>
                            <td className="table-cell paragraph--center">
                              {formatAmount(price)}
                            </td>
                            <td className="table-cell paragraph--center">
                              {formatAmount(quantity * price)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <h3 className="header">総計: {formatAmount(amount)}円</h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h3
            className="header paragraph-focus"
            style={{
              color:
                shipmentStatus === 'Preparing'
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
            {shipmentStatus}
          </h3>
        )}
      </div>

      <div className="order-section">
        <h4 className="header">オーダーID:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">{id}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">購入商品:</h4>
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
        <h4 className="header">総計:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">${formatAmount(amount)}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">配送先住所:</h4>
        <div className="order-section__content">
          <div className="order-address">
            <p className="paragraph">
              注文者名: <span className="paragraph--focus">{fullname}</span>
            </p>
            <p className="paragraph paragraph--focus">
              {address1}, {address2 ? address2 : ''}, {city}, {zipCode}, Tel:{' '}
              {phone}
            </p>
          </div>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">支払状況:</h4>
        <div className="order-section__content">
          <p className="paragraph paragraph--focus">{paymentStatus || 'n/a'}</p>
        </div>
      </div>

      <div className="order-section">
        <h4 className="header">配送状況:</h4>
        <div className="order-section__content">
          <ShipmentStatusControl order={order} />
        </div>
      </div>
    </div>
  )
}

export default ManageOrderDetail

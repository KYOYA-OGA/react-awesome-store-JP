import React from 'react'
import { useHistory } from 'react-router-dom'

import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Address } from '../../types'

export const address_key = 'awesome_shippingAddress'

interface Props {
  address: Address
  setAddressToEdit: (address: Address | null) => void
  setOpenDialog: (open: boolean) => void
  setAddressToDelete: (address: Address | null) => void
}

const ShippingAddress: React.FC<Props> = ({
  address,
  setAddressToEdit,
  setOpenDialog,
  setAddressToDelete,
}) => {
  const { fullname, address1, address2, city, zipCode, phone } = address

  const history = useHistory()

  return (
    <div className="shipping-address">
      <div className="shipping-address__detail">
        <h4 className="header">{fullname}</h4>
        <p className="paragraph">{zipCode}</p>
        <p className="paragraph">{address1}</p>
        {address2 && <p className="paragraph">{address2}</p>}
        {/* <p className="paragraph">{city}</p> */}
        <p className="paragraph">{phone}</p>
      </div>

      <Button
        width="100%"
        className="btn--orange"
        style={{ margin: '1rem 0' }}
        onClick={() => {
          window.localStorage.setItem(address_key, JSON.stringify(address))
          history.push({ pathname: '/buy/checkout' })
        }}
      >
        この住所に送る
      </Button>

      <div className="shipping-address__edit">
        <FontAwesomeIcon
          icon={['fas', 'edit']}
          size="1x"
          style={{ cursor: 'pointer' }}
          onClick={() => setAddressToEdit(address)}
        />
        <FontAwesomeIcon
          icon={['fas', 'trash-alt']}
          size="1x"
          color="red"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setAddressToDelete(address)
            setOpenDialog(true)
          }}
        />
      </div>
    </div>
  )
}

export default ShippingAddress

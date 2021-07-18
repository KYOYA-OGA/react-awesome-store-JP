import React from 'react'
import { useForm } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'

import { useManageShippingAddress } from '../../hooks/useManageShippingAddress'

import { Address, UserInfo } from '../../types'
interface Props {
  userInfo: UserInfo | null
  addressToEdit: Address | null
  setAddressToEdit: (address: Address | null) => void
}

const AddAndEditAddress: React.FC<Props> = ({
  userInfo,
  addressToEdit,
  setAddressToEdit,
}) => {
  const { addNewAddress, editAddress, loading, error } =
    useManageShippingAddress()
  const { register, errors, handleSubmit, reset } =
    useForm<Omit<Address, 'index'>>()

  const handleAddNewAddress = handleSubmit(async (data) => {
    if (!userInfo) return

    const finished = await addNewAddress(data, userInfo)

    if (finished) reset()
  })

  const handleEditAddress = handleSubmit(async (data) => {
    if (!userInfo?.shippingAddresses || addressToEdit?.index === undefined)
      return

    if (typeof addressToEdit.index !== 'number') return

    // check if no changes have been made
    const { fullname, address1, address2, city, zipCode, phone } = addressToEdit

    if (
      fullname === data.fullname &&
      address1 === data.address1 &&
      address2 === data.address2 &&
      city === data.city &&
      zipCode === data.zipCode &&
      phone === data.phone
    ) {
      alert('No changed have been made')
      return
    }

    const finished = await editAddress(data, addressToEdit.index, userInfo)

    if (finished) {
      reset()
      setAddressToEdit(null)
    }
  })

  return (
    <form
      className="form"
      onSubmit={addressToEdit ? handleEditAddress : handleAddNewAddress}
      style={{ width: '100%' }}
    >
      <p
        className="paragraph paragraph--success paragraph--focus"
        style={{ cursor: 'pointer', textAlign: 'end', marginRight: '0.5rem' }}
        onClick={() => {
          reset()
          setAddressToEdit(null)
        }}
      >
        Clear all
      </p>
      <Input
        label="Fullname"
        name="fullname"
        defaultValue={addressToEdit ? addressToEdit.fullname : ''}
        placeholder="Full name"
        ref={register({ required: 'Full name is required' })}
        error={errors.fullname?.message}
      />
      <Input
        label="Address1"
        name="address1"
        defaultValue={addressToEdit ? addressToEdit.address1 : ''}
        placeholder="Address 1"
        ref={register({ required: 'Street Address is required' })}
        error={errors.address1?.message}
      />
      <Input
        label="Address2"
        name="address2"
        defaultValue={addressToEdit ? addressToEdit.address2 : ''}
        placeholder="Apartment, suite, building, floor, etc."
        ref={register}
        error={errors.address2?.message}
      />
      <Input
        label="City"
        name="city"
        defaultValue={addressToEdit ? addressToEdit.city : ''}
        placeholder="City"
        ref={register({ required: 'City is required' })}
        error={errors.city?.message}
      />
      <Input
        label="Zipcode"
        name="zipCode"
        defaultValue={addressToEdit ? addressToEdit.zipCode : ''}
        placeholder="Zip code"
        ref={register({ required: 'Zip code is required' })}
        error={errors.zipCode?.message}
      />
      <Input
        label="Phone"
        name="phone"
        defaultValue={addressToEdit ? addressToEdit.phone : ''}
        placeholder="Phone number"
        type="text"
        ref={register({ required: 'Phone is required' })}
        error={errors.phone?.message}
      />
      <Button width="100%" loading={loading} disabled={loading}>
        Submit
      </Button>

      {error && <p className="paragraph paragraph--error">{error}</p>}
    </form>
  )
}

export default AddAndEditAddress

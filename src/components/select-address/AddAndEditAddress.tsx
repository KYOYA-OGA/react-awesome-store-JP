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
      alert('変更されていません')
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
        もとに戻す
      </p>
      <Input
        label="お名前"
        name="fullname"
        defaultValue={addressToEdit ? addressToEdit.fullname : ''}
        placeholder="お名前"
        ref={register({ required: 'お名前は必須です' })}
        error={errors.fullname?.message}
      />
      <Input
        label="郵便番号"
        name="zipCode"
        defaultValue={addressToEdit ? addressToEdit.zipCode : ''}
        placeholder="郵便番号"
        ref={register({ required: '郵便番号は必須です' })}
        error={errors.zipCode?.message}
      />
      <Input
        label="住所1"
        name="address1"
        defaultValue={addressToEdit ? addressToEdit.address1 : ''}
        placeholder="住所"
        ref={register({ required: '住所は必須です' })}
        error={errors.address1?.message}
      />
      <Input
        label="住所2"
        name="address2"
        defaultValue={addressToEdit ? addressToEdit.address2 : ''}
        placeholder="建物名等"
        ref={register}
        error={errors.address2?.message}
      />
      {/* <Input
        label="City"
        name="city"
        defaultValue={addressToEdit ? addressToEdit.city : ''}
        placeholder="City"
        ref={register({ required: 'City is required' })}
        error={errors.city?.message}
      /> */}

      <Input
        label="電話番号"
        name="phone"
        defaultValue={addressToEdit ? addressToEdit.phone : ''}
        placeholder="電話番号"
        type="text"
        ref={register({ required: '電話番号は必須です' })}
        error={errors.phone?.message}
      />
      <Button width="100%" loading={loading} disabled={loading}>
        登録する
      </Button>

      {error && <p className="paragraph paragraph--error">{error}</p>}
    </form>
  )
}

export default AddAndEditAddress

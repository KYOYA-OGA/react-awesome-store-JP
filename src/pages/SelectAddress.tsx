import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import AddAndEditAddress from '../components/select-address/AddAndEditAddress'
import ShippingAddress from '../components/select-address/ShippingAddress'
import AlertDialog from '../components/dialogs/AlertDialog'
import Spinner from '../components/Spinner'

import { useManageShippingAddress } from '../hooks/useManageShippingAddress'
import { useDialog } from '../hooks/useDialog'
import { useAuthContext } from '../state/auth-context'
import { useCartContext } from '../state/cart-context'

import { Address } from '../types'

interface Props {}

const SelectAddress: React.FC<Props> = () => {
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)

  const { openDialog, setOpenDialog } = useDialog()
  const { deleteAddress, loading, error } = useManageShippingAddress()
  const { cart } = useCartContext()

  const {
    authState: { userInfo },
  } = useAuthContext()

  if (!cart || (cart && cart.length === 0)) return <Redirect to="/" />

  if (!userInfo) return <Spinner color="grey" width={50} height={50} />

  return (
    <div className="page--select-address">
      <h2 className="header">配送先住所を選択してください</h2>
      <div className="select-address">
        <div className="select-address__existing">
          {!userInfo?.shippingAddresses ||
          userInfo?.shippingAddresses?.length === 0 ? (
            <p className="paragraph">住所がありません。追加しましょう。</p>
          ) : (
            userInfo.shippingAddresses.map((address, index) => (
              <ShippingAddress
                address={{ ...address, index }}
                key={index}
                setAddressToEdit={setAddressToEdit}
                setOpenDialog={setOpenDialog}
                setAddressToDelete={setAddressToDelete}
              />
            ))
          )}
        </div>
        <div className="select-address__add-new">
          <h3 className="header">新しい住所を追加する</h3>

          <AddAndEditAddress
            userInfo={userInfo}
            addressToEdit={addressToEdit}
            setAddressToEdit={setAddressToEdit}
          />
        </div>
      </div>

      {openDialog && (
        <AlertDialog
          header="確認してください"
          message="本当にこの住所を削除しますか？"
          loading={loading}
          error={error}
          onCancel={() => {
            setAddressToDelete(null)
            setOpenDialog(false)
          }}
          onConfirm={async () => {
            if (!userInfo || addressToDelete?.index === undefined) return

            if (typeof addressToDelete.index !== 'number') return

            const finished = await deleteAddress(
              addressToDelete.index,
              userInfo
            )

            if (finished) {
              setAddressToDelete(null)
              setOpenDialog(false)
            }
          }}
        />
      )}
    </div>
  )
}

export default SelectAddress

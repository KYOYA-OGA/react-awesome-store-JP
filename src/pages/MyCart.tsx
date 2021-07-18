import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Button from '../components/Button'
import Spinner from '../components/Spinner'
import MyCartItem from '../components/cart/MyCartItem'
import AlertDialog from '../components/dialogs/AlertDialog'

import { useDialog } from '../hooks/useDialog'
import { useManageCart } from '../hooks/useManageCart'
import { useCartContext } from '../state/cart-context'

import {
  calculateCartQuantity,
  calculateCartAmount,
  formatAmount,
} from '../helpers'
import { CartItem } from '../types'

interface Props {}

const MyCart: React.FC<Props> = () => {
  const [cartItemToDelete, setCartItemToDelete] = useState<CartItem | null>(
    null
  )

  const { cart } = useCartContext()
  const { openDialog, setOpenDialog } = useDialog()
  const { removeCartItem, loading, error } = useManageCart()

  const history = useHistory()

  if (!cart) return <Spinner color="gray" width={50} height={50} />

  if (cart && cart.length === 0)
    return (
      <h2 className="header--center">
        買い物かごは空です。
        <span
          className="header--orange header--link"
          onClick={() => history.push('/')}
        >
          買い物をしましょう！
        </span>
      </h2>
    )

  return (
    <div className="page--my-cart">
      <div className="cart">
        <h2 className="header">買い物かご</h2>
        <div className="cart-detail">
          {cart.map((item) => (
            <MyCartItem
              key={item.id}
              cartItem={item}
              setOpenDialog={setOpenDialog}
              setCartItemToDelete={setCartItemToDelete}
              openDialog={openDialog}
            />
          ))}
        </div>
      </div>
      <div className="cart-summary">
        <h3 className="header">買い物かご合計</h3>
        <div>
          <p className="paragraph">
            品数:{' '}
            <span className="paragraph paragraph--orange paragraph--focus">
              {calculateCartQuantity(cart)}
            </span>
          </p>

          <p className="paragraph">
            総計:{' '}
            <span className="paragraph paragraph--orange paragraph--focus">
              {formatAmount(calculateCartAmount(cart))}円
            </span>
          </p>
        </div>

        <Button
          width="100%"
          className="btn--orange"
          style={{ margin: '1rem 0' }}
          onClick={() => history.push('/buy/select-address')}
        >
          支払いに進む
        </Button>
      </div>

      {openDialog && setCartItemToDelete && (
        <AlertDialog
          header="please confirm"
          message={`Are you sure you want to delete the "${cartItemToDelete?.item.title}" from your cart?`}
          loading={loading}
          error={error}
          onCancel={() => {
            setCartItemToDelete(null)
            setOpenDialog(false)
          }}
          onConfirm={async () => {
            if (cartItemToDelete) {
              const finished = await removeCartItem(
                cartItemToDelete.item.id,
                cartItemToDelete.user
              )

              if (finished) {
                setCartItemToDelete(null)
                setOpenDialog(false)
              }
            }
          }}
        />
      )}
    </div>
  )
}

export default MyCart

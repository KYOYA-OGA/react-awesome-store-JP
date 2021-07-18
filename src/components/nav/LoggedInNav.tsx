import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthContext, openUserDropdown } from '../../state/auth-context'
import { useCartContext } from '../../state/cart-context'
import { useViewContext } from '../../state/view-context'
import { isClient, calculateCartQuantity } from '../../helpers'

interface Props {}

const LoggedInNav: React.FC<Props> = () => {
  const { viewMode } = useViewContext()
  const { cart } = useCartContext()
  const {
    authDispatch,
    authState: { userInfo },
  } = useAuthContext()
  return (
    <ul className="navbar">
      <div className="navbar__lists">
        {viewMode === 'client' || (userInfo && isClient(userInfo?.role)) ? (
          <li className="list list--cart">
            <NavLink to="/buy/my-cart">
              <FontAwesomeIcon
                icon={['fas', 'cart-arrow-down']}
                color="white"
                size="lg"
              />
            </NavLink>
            <div className="cart-qty">
              {cart && calculateCartQuantity(cart)}
            </div>
          </li>
        ) : null}
      </div>

      <div className="navbar__profile">
        <div className="profile">
          <FontAwesomeIcon
            icon={['fas', 'user-circle']}
            color="white"
            size="2x"
            onClick={() => authDispatch(openUserDropdown(true))}
          />
        </div>
      </div>
    </ul>
  )
}

export default LoggedInNav

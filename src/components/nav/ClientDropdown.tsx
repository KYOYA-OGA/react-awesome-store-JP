import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {}

const ClientDropdown: React.FC<Props> = () => {
  return (
    <ul className="sidebar__section sidebar__section--nav">
      <li className="list">
        <NavLink to="/products" className="list-link">
          商品
        </NavLink>
      </li>
      <li className="list">
        <NavLink to="/buy/my-cart" className="list-link">
          買い物かご
        </NavLink>
      </li>
      <li className="list">
        <NavLink to="/orders/my-orders" className="list-link">
          注文履歴
        </NavLink>
      </li>
    </ul>
  )
}

export default ClientDropdown

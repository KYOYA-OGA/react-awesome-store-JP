import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import NavBar from './components/nav/MainNav'
import UserDropdown from './components/nav/UserDropdown'
import { useModalContext } from './state/modal-context'
import { useAuthContext, openUserDropdown } from './state/auth-context'
import ViewContextProvider from './state/view-context'

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const {
    authState: { isUserDropdownOpen },
    authDispatch,
  } = useAuthContext()
  const { modal } = useModalContext()
  const location = useLocation()

  useEffect(() => {
    if (isUserDropdownOpen) authDispatch(openUserDropdown(false))
    // eslint-disable-next-line
  }, [location.pathname])

  return (
    <div>
      <ViewContextProvider>
        <NavBar />
        {isUserDropdownOpen && <UserDropdown />}
      </ViewContextProvider>
      <div className="page">{children}</div>

      {modal && modal}
    </div>
  )
}

export default Layout

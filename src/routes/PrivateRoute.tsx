import React, { ReactElement } from 'react'
import { Redirect, useLocation } from 'react-router-dom'

import Spinner from '../components/Spinner'
import { useAuthContext } from '../state/auth-context'

interface Props {}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const {
    authState: { authUser, userInfo, authChecked },
  } = useAuthContext()

  const location = useLocation()

  if (!authChecked && (!authUser || !userInfo))
    return <Spinner color="gray" height={50} width={50} />

  if (authChecked && (!authUser || !userInfo))
    return (
      <Redirect
        to={{
          pathname: '/',
          state: {
            from: location.pathname,
          },
        }}
      />
    )

  return (
    <>
      {React.Children.map(children as ReactElement, (child) =>
        React.cloneElement(child, { userInfo })
      )}
    </>
  )
}

export default PrivateRoute

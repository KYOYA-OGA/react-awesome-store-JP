import React from 'react'

import Button from '../Button'
import { useModalContext } from '../../state/modal-context'

interface Props {}

const LoggedOutNav: React.FC<Props> = () => {
  const { setModalType } = useModalContext()

  return (
    <ul className="navbar">
      <div className="navbar__profile">
        <Button
          className="btn--sign"
          width="auto"
          onClick={() => setModalType('signin')}
        >
          サインイン
        </Button>
        <Button className="btn--sign" onClick={() => setModalType('signup')}>
          登録
        </Button>
      </div>
    </ul>
  )
}

export default LoggedOutNav

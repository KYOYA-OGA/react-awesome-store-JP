import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { useModalContext } from '../../state/modal-context'

import { SignupData } from '../../types'

interface Props {}

const ResetPassword: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const { error, loading, resetPassword, successMsg } = useAuthenticate()
  const { register, errors, handleSubmit } =
    useForm<Omit<SignupData, 'username' | 'password'>>()

  const handleResetPassword = handleSubmit((data) => resetPassword(data))

  return (
    <>
      <div className="backdrop" onClick={() => setModalType('close')}></div>
      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => setModalType('close')}>
          &times;
        </div>
        <h5 className="header--center paragraph--orange ">
          パスワードをリセットするメールアドレスを入力してください
        </h5>
        <form className="form" onSubmit={handleResetPassword}>
          <Input
            placeholder="メールアドレス"
            name="email"
            error={errors.email?.message}
            ref={register({
              required: 'メールアドレスは必須です',
            })}
          />

          <Button width="100%" style={{ margin: '0.5rem 0' }} loading={loading}>
            変更する
          </Button>
          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>
        {successMsg && (
          <p className="paragraph--success paragraph--small">{successMsg}</p>
        )}
      </div>
    </>
  )
}

export default ResetPassword

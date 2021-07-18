import React from 'react'
import { useForm } from 'react-hook-form'

import Button from '../Button'
import Input from '../Input'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { useModalContext } from '../../state/modal-context'
import SocialMediaLogin from './SocialMediaLogin'

import { SignupData } from '../../types'

interface Props {}

const Signup: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const { signup, error, loading, socialLogin } = useAuthenticate()
  const { register, errors, handleSubmit } = useForm<SignupData>()

  const handleSignup = handleSubmit(async (data) => {
    const response = await signup(data)

    if (response) setModalType('close')
  })

  return (
    <>
      <div className="backdrop" onClick={() => setModalType('close')}></div>
      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => setModalType('close')}>
          &times;
        </div>
        <h3 className="header--center paragraph--orange ">
          AwesomeShopに登録する
        </h3>
        <SocialMediaLogin socialLogin={socialLogin} loading={loading} />
        <hr />
        <p className="paragraph--center paragraph--focus paragraph--small">
          メールアドレスで登録する
        </p>

        <form className="form" onSubmit={handleSignup}>
          <Input
            label="ユーザー名"
            placeholder="ユーザー名"
            name="username"
            error={errors.username?.message}
            ref={register({
              required: 'ユーザー名は必須です',
              minLength: {
                value: 1,
                message: 'ユーザー名は1文字以上である必要があります',
              },
              maxLength: {
                value: 30,
                message: 'ユーザー名は30文字以下である必要があります',
              },
            })}
          />

          <Input
            label="メールアドレス"
            placeholder="メールアドレス"
            name="email"
            error={errors.email?.message}
            ref={register({
              required: 'メールアドレスは必須です',
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'メールアドレスの形式が正しくありません',
              },
            })}
          />
          <Input
            type="password"
            label="パスワード"
            placeholder="パスワード"
            name="password"
            error={errors.password?.message}
            ref={register({
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上である必要があります',
              },
              maxLength: {
                value: 50,
                message: 'パスワードは50文字以下である必要があります',
              },
            })}
          />

          <Button width="100%" style={{ margin: '0.5rem 0' }} loading={loading}>
            登録
          </Button>
          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>
        <p className="paragraph paragraph--focus paragraph--small">
          アカウントをお持ちですか？{' '}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('signin')}
          >
            サインイン
          </span>
        </p>
      </div>
    </>
  )
}

export default Signup

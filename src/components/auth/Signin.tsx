import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import Button from '../Button'
import Input from '../Input'
import { useAuthenticate } from '../../hooks/useAuthenticate'
import { useModalContext } from '../../state/modal-context'

import SocialMediaLogin from './SocialMediaLogin'
import { SignupData } from '../../types'

interface Props {}

const Signin: React.FC<Props> = () => {
  const { setModalType } = useModalContext()
  const { signin, error, loading, socialLogin } = useAuthenticate()
  const { register, errors, handleSubmit } =
    useForm<Omit<SignupData, 'username'>>()

  const history = useHistory()

  const handleSignin = handleSubmit(async (data) => {
    const response = await signin(data)

    if (response) setModalType('close')
  })

  return (
    <>
      <div
        className="backdrop"
        onClick={() => {
          history.push('/', undefined)
          setModalType('close')
        }}
      ></div>
      <div className="modal modal--auth-form">
        <div
          className="modal-close"
          onClick={() => {
            history.push('/', undefined)
            setModalType('close')
          }}
        >
          &times;
        </div>
        <h3 className="header--center paragraph--orange ">
          AwesomeShopにサインインする
        </h3>

        <SocialMediaLogin socialLogin={socialLogin} loading={loading} />
        <hr />
        <p className="paragraph--center paragraph--focus paragraph--small">
          メールアドレスでサインインする
        </p>

        <form className="form" onSubmit={handleSignin}>
          <Input
            label="メールアドレス"
            placeholder="メールアドレス"
            name="email"
            error={errors.email?.message}
            ref={register({
              required: 'メールアドレスは必須です',
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
            })}
          />

          <Button width="100%" style={{ margin: '0.5rem 0' }} loading={loading}>
            ログイン
          </Button>
          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>

        <p className="paragraph paragraph--focus paragraph--small">
          まだアカウントをお持ちでない場合は{' '}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('signup')}
          >
            登録
          </span>
        </p>
        <p className="paragraph paragraph--focus paragraph--small">
          パスワードをお忘れの場合は{' '}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType('reset_password')}
          >
            こちら
          </span>
        </p>
      </div>
    </>
  )
}

export default Signin

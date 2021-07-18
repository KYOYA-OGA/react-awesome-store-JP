import React, {
  createContext,
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react'
import Signup from '../components/auth/Signup'
import Signin from '../components/auth/Signin'
import ResetPassword from '../components/auth/ResetPassword'

interface Props {}

type ModalType = 'close' | 'signup' | 'signin' | 'reset_password'
type Modals = {
  [key in ModalType]: ReactElement | null
}

type ModalState = {
  modal: ReactElement | null
}

type ModalDispatch = {
  setModalType: Dispatch<SetStateAction<ModalType>>
}

const ModalStateContext = createContext<ModalState | undefined>(undefined)
const ModalDispatchContext = createContext<ModalDispatch | undefined>(undefined)

const modals: Modals = {
  close: null,
  signup: <Signup />,
  signin: <Signin />,
  reset_password: <ResetPassword />,
}

const ModalContextProvider: React.FC<Props> = ({ children }) => {
  const [modal, setModal] = useState<ReactElement | null>(null)
  const [modalType, setModalType] = useState<ModalType>('close')

  useEffect(() => {
    setModal(modals[modalType])
  }, [modalType])

  return (
    <ModalStateContext.Provider value={{ modal }}>
      <ModalDispatchContext.Provider value={{ setModalType }}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  )
}

export default ModalContextProvider

export const useModalContext = () => {
  const modalState = useContext(ModalStateContext)
  const modalDispatch = useContext(ModalDispatchContext)

  if (modalState === undefined || modalDispatch === undefined)
    throw new Error(
      'useModalContext must be used within the  ModalContextProvider'
    )
  return { ...modalDispatch, ...modalState }
}

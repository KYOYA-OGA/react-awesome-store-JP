import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

interface Props {}

type ViewState = 'client' | 'admin'
type ViewDispatch = Dispatch<SetStateAction<ViewState>>

const ViewStateContext = createContext<ViewState | undefined>(undefined)
const ViewDispatchContext = createContext<ViewDispatch | undefined>(undefined)

const ViewContextProvider: React.FC<Props> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewState>('admin')
  return (
    <ViewStateContext.Provider value={viewMode}>
      <ViewDispatchContext.Provider value={setViewMode}>
        {children}
      </ViewDispatchContext.Provider>
    </ViewStateContext.Provider>
  )
}

export default ViewContextProvider

export const useViewContext = () => {
  const viewMode = useContext(ViewStateContext)
  const setViewMode = useContext(ViewDispatchContext)

  if (viewMode === undefined || setViewMode === undefined)
    throw new Error(
      'useViewContext must be used within the ViewContextProvider'
    )

  return { viewMode, setViewMode }
}

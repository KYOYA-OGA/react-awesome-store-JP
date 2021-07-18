import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react'
import { Order, Product, UserInfo } from '../types'

interface Props {}

type SearchState = {
  searchedItems: Product[] | Order[] | UserInfo[] | null
}
type SearchDispatch = {
  setSearchedItems: Dispatch<
    SetStateAction<Product[] | Order[] | UserInfo[] | null>
  >
}

const SearchStateContext = createContext<SearchState | undefined>(undefined)
const SearchDispatchContext = createContext<SearchDispatch | undefined>(
  undefined
)

const SearchContextProvider: React.FC<Props> = ({ children }) => {
  const [searchedItems, setSearchedItems] = useState<
    Product[] | Order[] | UserInfo[] | null
  >(null)
  return (
    <SearchStateContext.Provider value={{ searchedItems }}>
      <SearchDispatchContext.Provider value={{ setSearchedItems }}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchStateContext.Provider>
  )
}

export default SearchContextProvider

export const useSearchContext = () => {
  const searchedState = useContext(SearchStateContext)
  const searchedDispatch = useContext(SearchDispatchContext)

  if (searchedState === undefined || searchedDispatch === undefined)
    throw new Error(
      'useSearchContext must be used within SearchContextProvider.'
    )

  return { ...searchedState, ...searchedDispatch }
}

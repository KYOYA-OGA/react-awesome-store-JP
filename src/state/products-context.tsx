import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react'
import { useAsyncCall } from '../hooks/useAsyncCall'
import { Product, ProductTab } from '../types'
import { firebase } from '../firebase/config'
import { productsRef, productCountsRef, snapshotToDoc } from '../firebase'

const limitQuery = 20

interface Props {}

type Products = { [key in ProductTab]: Product[] }
type ProductCounts = { [key in ProductTab]: number }

type ProductsState = {
  products: Products
  productCounts: ProductCounts
  loading: boolean
  error: string
  queryMoreProducts: () => void
}

type ProductsDispatch = {
  setProducts: Dispatch<SetStateAction<Products>>
}

const ProductsStateContext = createContext<ProductsState | undefined>(undefined)
const ProductsDispatchContext = createContext<ProductsDispatch | undefined>(
  undefined
)

const initialProducts: Products = {
  All: [],
  Clothing: [],
  Shoes: [],
  Watches: [],
  Accessories: [],
}

const initialProductCounts: ProductCounts = {
  All: 0,
  Clothing: 0,
  Shoes: 0,
  Watches: 0,
  Accessories: 0,
}

const ProductsContextProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState(initialProducts)
  const [productCounts, setProductCounts] = useState(initialProductCounts)
  const { loading, setLoading, error, setError } = useAsyncCall()
  const [lastDocument, setLastDocument] =
    useState<firebase.firestore.DocumentData>()

  const queryMoreProducts = async () => {
    try {
      if (!lastDocument) return

      setLoading(true)

      const snapshots = await productsRef
        .orderBy('createdAt', 'desc')
        .limit(limitQuery)
        .get()

      const newQueries = snapshots.docs.map((snapshot) =>
        snapshotToDoc<Product>(snapshot)
      )
      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      setLastDocument(lastVisible)

      // Combine the new queries with the existing state
      setProducts((prev) => {
        const updatedProducts: any = {}

        Object.keys(initialProducts).forEach((cat) => {
          const category = cat as ProductTab

          category === 'All'
            ? (updatedProducts.All = [...prev.All, ...newQueries])
            : (updatedProducts[category] = [
                ...prev[category],
                ...newQueries.filter((item) => item.category === category),
              ])
        })

        return updatedProducts
      })

      setLoading(false)
    } catch (err) {
      const { message } = err as { message: string }
      setError(message)
      setLoading(false)
    }
  }

  // Fetch the products collection from firestore (first query)
  useEffect(() => {
    setLoading(true)
    const unsubscribe = productsRef
      .orderBy('createdAt', 'desc')
      .limit(limitQuery)
      .onSnapshot({
        next: (snapshots) => {
          const allProducts = snapshots.docs.map((snapshot) =>
            snapshotToDoc<Product>(snapshot)
          )

          // snapshots.forEach((snapshot) => {
          //   const product = snapshotToDoc<Product>(snapshot)

          //   allProducts.push(product)
          // })

          const lastVisible = snapshots.docs[snapshots.docs.length - 1]
          setLastDocument(lastVisible)

          const updatedProducts: any = {}

          Object.keys(initialProducts).forEach((cat) => {
            const category = cat as ProductTab

            category === 'All'
              ? (updatedProducts.All = allProducts)
              : (updatedProducts[category] = allProducts.filter(
                  (item) => item.category === category
                ))
          })
          setProducts(updatedProducts)
          setLoading(false)
        },
        error: (err) => {
          setError(err.message)
          setLoading(false)
        },
      })

    return () => unsubscribe()
    // eslint-disable-next-line
  }, [])

  // Fetch the product-counts collection from firestore
  useEffect(() => {
    const unsubscribe = productCountsRef
      .doc('counts')
      .onSnapshot((snapshot) => {
        const countsData = snapshot.data() as ProductCounts

        if (!countsData) return setProductCounts(initialProductCounts)

        setProductCounts(countsData)
      })
    return () => unsubscribe()
  }, [])

  return (
    <ProductsStateContext.Provider
      value={{ products, productCounts, loading, error, queryMoreProducts }}
    >
      <ProductsDispatchContext.Provider value={{ setProducts }}>
        {children}
      </ProductsDispatchContext.Provider>
    </ProductsStateContext.Provider>
  )
}

export default ProductsContextProvider

export const useProductsContext = () => {
  const productsState = useContext(ProductsStateContext)
  const productsDispatch = useContext(ProductsDispatchContext)

  if (productsState === undefined || productsDispatch === undefined)
    throw new Error(
      'useProductsContext must be used within ProductsContextProvider.'
    )

  return { productsState, productsDispatch }
}

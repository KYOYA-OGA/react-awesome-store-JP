import React, { useState, useEffect } from 'react'
import AdminProductItem from '../components/manage-products/AdminProductItem'
import AlertDialog from '../components/dialogs/AlertDialog'
import Button from '../components/Button'
import AddAndEditProduct from '../components/manage-products/AddAndEditProduct'
import Pagination from '../components/Pagination'

import { useProductsContext } from '../state/products-context'
import { useSearchContext } from '../state/search-context'
import { useManageProduct } from '../hooks/useManageProduct'
import { usePagination } from '../hooks/usePagination'

import Spinner from '../components/Spinner'
import { Product } from '../types'
import { useDialog } from '../hooks/useDialog'

const productsPerPage = 10

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const {
    productsState: {
      products,
      loading,
      error,
      productCounts,
      queryMoreProducts,
    },
  } = useProductsContext()

  const { openDialog, setOpenDialog } = useDialog()
  const {
    deleteProduct,
    loading: deleteProdLoading,
    error: deleteProdError,
  } = useManageProduct()
  const { searchedItems } = useSearchContext()

  const { page, totalPages } = usePagination(
    productCounts.All,
    productsPerPage,
    undefined,
    searchedItems as Product[]
  )

  const [productsByPage, setProductsByPage] = useState(products.All)
  const [paginatedSearchedItems, setPaginatedSearchedItems] =
    useState(searchedItems)

  useEffect(() => {
    const startIndex = productsPerPage * (page - 1)
    const endIndex = productsPerPage * page
    if (searchedItems) {
      setPaginatedSearchedItems(searchedItems.slice(startIndex, endIndex))
      setProductsByPage([])
    } else {
      // Check if we need to query more products
      if (
        products.All.length < productCounts.All &&
        products.All.length < productsPerPage * page
      ) {
        queryMoreProducts()
        return
      }
      setProductsByPage(products.All.slice(startIndex, endIndex))
      setPaginatedSearchedItems(null)
    }
    // eslint-disable-next-line
  }, [products.All, productCounts.All, page, searchedItems])

  if (loading) return <Spinner color="gray" width={50} height={50} />

  return (
    <div className="page--manage-products">
      <div className="manage-products__section">
        <Button
          className="btn--orange"
          width="auto"
          onClick={() => setOpenProductForm(true)}
        >
          新しい商品を追加する
        </Button>

        {openProductForm && (
          <AddAndEditProduct
            setOpenProductForm={setOpenProductForm}
            productToEdit={productToEdit}
            setProductToEdit={setProductToEdit}
          />
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination-container">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}

      <div className="manage-products__section">
        {!loading && products.All.length === 0 ? (
          <h2 className="header--center">
            商品がありません。追加してください。
          </h2>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="table-cell">商品名</th>
                <th className="table-cell">画像</th>
                <th className="table-cell">価格 (円)</th>
                <th className="table-cell table-cell--hide">作成日</th>
                <th className="table-cell table-cell--hide">更新日</th>
                <th className="table-cell">在庫</th>
              </tr>
            </thead>

            <tbody>
              {paginatedSearchedItems ? (
                <>
                  {paginatedSearchedItems.length < 1 ? (
                    <tr>
                      <td colSpan={6}>
                        <h2 className="header--center">商品がありません</h2>
                      </td>
                    </tr>
                  ) : (
                    (paginatedSearchedItems as Product[]).map((product) => (
                      <AdminProductItem
                        key={product.id}
                        product={product}
                        setOpenProductForm={setOpenProductForm}
                        setProductToEdit={setProductToEdit}
                        setOpenDialog={setOpenDialog}
                        setProductToDelete={setProductToDelete}
                      />
                    ))
                  )}
                </>
              ) : (
                productsByPage &&
                productsByPage.map((product) => (
                  <AdminProductItem
                    key={product.id}
                    product={product}
                    setOpenProductForm={setOpenProductForm}
                    setProductToEdit={setProductToEdit}
                    setOpenDialog={setOpenDialog}
                    setProductToDelete={setProductToDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {error && <p className="paragraph paragraph--error"> {error}</p>}

      {openDialog && (
        <AlertDialog
          header="確認してください"
          message={`${
            productToDelete ? productToDelete?.title : 'item'
          }を本当に削除しますか?`}
          onCancel={() => {
            setProductToDelete(null)
            setOpenDialog(false)
          }}
          onConfirm={async () => {
            // delete product
            if (productToDelete) {
              const finished = await deleteProduct(productToDelete)

              if (finished) setOpenDialog(false)
            }
          }}
          loading={deleteProdLoading}
          error={deleteProdError}
        />
      )}
    </div>
  )
}

export default ManageProducts

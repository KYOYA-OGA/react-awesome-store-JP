import React, { useRef, ChangeEvent, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Input from '../Input'
import Button from '../Button'
import { useAuthContext } from '../../state/auth-context'
import { useManageProduct } from '../../hooks/useManageProduct'
import { AddProductData, Product } from '../../types'
import { storageRef } from '../../firebase/config'
import { categories } from '../../helpers'

const fileType = ['image/png', 'image/jpeg', 'image/jpg']

interface Props {
  setOpenProductForm: (open: boolean) => void
  productToEdit: Product | null
  setProductToEdit: (product: Product | null) => void
}

const AddAndEditProduct: React.FC<Props> = ({
  setOpenProductForm,
  productToEdit,
  setProductToEdit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    authState: { authUser },
  } = useAuthContext()

  const {
    uploadImageToStorage,
    addNewProduct,
    editProduct,
    uploadProgression,
    setUploadProgression,
    addProductFinished,
    editProductFinished,
    loading,
    error,
  } = useManageProduct()
  const { register, handleSubmit, errors, reset } = useForm<AddProductData>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addProductFinished) {
      reset()
      setSelectedFile(null)
      setUploadProgression(0)
    }
  }, [addProductFinished, reset, setUploadProgression, setSelectedFile])

  useEffect(() => {
    if (editProductFinished) {
      reset()
      setSelectedFile(null)
      setUploadProgression(0)
      setProductToEdit(null)
      setOpenProductForm(false)
    }
  }, [
    editProductFinished,
    reset,
    setUploadProgression,
    setSelectedFile,
    setProductToEdit,
    setOpenProductForm,
  ])

  const handleOpenUploadBox = () => {
    if (inputRef?.current) inputRef.current.click()
  }

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || !files[0]) return

    const file = files[0]

    if (!fileType.includes(file.type)) {
      alert('png???jpg???jpeg?????????????????????????????????')
      return
    }

    setSelectedFile(file)
  }

  const handleAddProduct = handleSubmit((data) => {
    if (!selectedFile || !authUser) return

    return uploadImageToStorage(
      selectedFile,
      addNewProduct(data, authUser?.uid)
    )
  })

  const handleEditProduct = handleSubmit(async (data) => {
    if (!productToEdit || !authUser) return

    const {
      title,
      description,
      price,
      imageFileName,
      category,
      inventory,
      imageRef,
      imageUrl,
    } = productToEdit

    // Check if the product data has been changed
    const isNotEdited =
      title === data.title &&
      description === data.description &&
      +price === +data.price &&
      imageFileName === data.imageFileName &&
      category === data.category &&
      +inventory === +data.inventory

    //  Nothing changed
    if (isNotEdited) return

    // Something changed

    if (imageFileName !== data.imageFileName) {
      if (!selectedFile) return
      // If the image changed, delete the old image
      const oldImageRef = storageRef.child(imageRef)
      await oldImageRef.delete()

      return uploadImageToStorage(
        selectedFile,
        editProduct(productToEdit.id, data, authUser.uid)
      )
    } else {
      // the image has not been changed
      return editProduct(
        productToEdit.id,
        data,
        authUser.uid
      )(imageUrl, imageRef)
    }
  })

  return (
    <>
      <div
        className="backdrop"
        onClick={() => {
          setProductToEdit(null)
          setOpenProductForm(false)
        }}
      ></div>
      <div className="modal modal--add-product">
        <div
          className="modal-close"
          onClick={() => {
            setProductToEdit(null)
            setOpenProductForm(false)
          }}
        >
          &times;
        </div>
        <h2 className="header--center">
          {productToEdit ? '?????????????????????' : '?????????????????????'}
        </h2>
        <form
          className="form"
          onSubmit={productToEdit ? handleEditProduct : handleAddProduct}
        >
          {/* title */}
          <Input
            label="?????????"
            name="title"
            placeholder="?????????"
            defaultValue={productToEdit ? productToEdit.title : ''}
            ref={register({
              required: '????????????????????????',
              minLength: {
                value: 1,
                message: '1???????????????????????????????????????',
              },
            })}
            error={errors.title?.message}
          />

          {/* Description */}
          <Input
            label="??????"
            name="description"
            placeholder="????????????"
            defaultValue={productToEdit ? productToEdit.description : ''}
            ref={register({
              required: '???????????????????????????',
              minLength: {
                value: 6,
                message: '6???????????????????????????????????????',
              },
              maxLength: {
                value: 200,
                message: '200???????????????????????????????????????',
              },
            })}
            error={errors.description?.message}
          />

          {/* Price */}
          <Input
            label="??????"
            name="price"
            placeholder="????????????"
            defaultValue={productToEdit ? productToEdit.price : ''}
            ref={register({
              required: '?????????????????????',
            })}
            error={errors.price?.message}
          />

          {/* Image */}
          <div className="form__input-container">
            <label htmlFor="Image" className="form__input-label">
              ??????
            </label>
            <div className="form__input-file-upload">
              {uploadProgression ? (
                <div style={{ width: '70%' }}>
                  <input
                    type="text"
                    className="upload-progression"
                    style={{
                      width: `${uploadProgression}%`,
                      color: 'white',
                      textAlign: 'center',
                    }}
                    value={`${uploadProgression}%`}
                    readOnly
                  />
                </div>
              ) : (
                <input
                  name="imageFileName"
                  type="text"
                  className="input"
                  readOnly
                  style={{ width: '70%', cursor: 'pointer' }}
                  onClick={handleOpenUploadBox}
                  value={
                    selectedFile
                      ? selectedFile.name
                      : productToEdit
                      ? productToEdit.imageFileName
                      : ''
                  }
                  ref={register({ required: '???????????????????????????' })}
                />
              )}

              <Button
                width="30%"
                height="100%"
                type="button"
                style={{ borderRadius: '0', border: '1px solid #282c34' }}
                onClick={handleOpenUploadBox}
              >
                <span className="paragraph--small">?????????????????????</span>
              </Button>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={handleSelectFile}
              />
            </div>
            {errors?.imageFileName && !selectedFile && (
              <p className="paragraph paragraph--error-small">
                {errors.imageFileName.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="form__input-container">
            <label htmlFor="Category" className="form__input-label">
              ????????????
            </label>
            <select
              name="category"
              className="input"
              defaultValue={productToEdit ? productToEdit.category : undefined}
              ref={register({ required: '???????????????????????????' })}
            >
              <option style={{ display: 'none' }}></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors?.category && (
              <p className="paragraph paragraph--error-small">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Inventory */}
          <Input
            type="number"
            label="??????"
            name="inventory"
            placeholder="????????????"
            defaultValue={productToEdit ? productToEdit.inventory : ''}
            ref={register({
              required: '?????????????????????',
              pattern: {
                value: /^[0-9]\d*$/,
                message: '?????????????????????????????????',
              },
            })}
            error={errors.inventory?.message}
          />

          <Button
            className="btn--orange"
            width="100%"
            style={{ marginTop: '1rem' }}
            loading={loading}
            disabled={loading}
          >
            ??????
          </Button>
        </form>

        {error && <p className="paragraph paragraph--error"></p>}
      </div>
    </>
  )
}

export default AddAndEditProduct

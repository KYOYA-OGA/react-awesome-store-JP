import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { AddProductData, Product, UploadProduct } from '../types'
import { firebase, storageRef } from '../firebase/config'
import { createImageRef, productsRef } from '../firebase'

export const useManageProduct = () => {
  const [uploadProgression, setUploadProgression] = useState(0)
  const [addProductFinished, setAddProductFinished] = useState(false)
  const [editProductFinished, setEditProductFinished] = useState(false)
  const { loading, setLoading, error, setError } = useAsyncCall()

  //! 1. firebaseストレージに画像データを保存し、画像URLを返してもらう
  const uploadImageToStorage = (
    image: File,
    cb: (imageUrl: string, imagePath: string) => void
  ) => {
    setLoading(true)

    const imageRef = createImageRef(image.name)
    const uploadTask = imageRef.put(image)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate upload progression
        const progression =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgression(progression)
      },
      (err) => {
        // error case
        setError(err.message)
        setLoading(false)
      },
      () => {
        // success case
        // Get the image url
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((imageUrl) => {
            cb(imageUrl, imageRef.fullPath)
          })
          .catch((err) => {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)
          })
      }
    )
  }

  //! 2. firestoreのproducts collectionに新規ドキュメントを作成する。product data と image urlが必要

  const addNewProduct =
    (data: AddProductData, creator: string) =>
    (imageUrl: string, imagePath: string) => {
      const { title, description, price, imageFileName, category, inventory } =
        data
      setLoading(true)
      setAddProductFinished(false)

      const newProduct: UploadProduct = {
        title,
        description,
        price: +price,
        category,
        inventory: +inventory,
        imageUrl,
        imageFileName,
        imageRef: imagePath,
        creator,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      productsRef
        .add(newProduct)
        .then(() => {
          setAddProductFinished(true)
          setLoading(false)
        })
        .catch((err) => {
          const { message } = err as { message: string }

          setError(message)
          setLoading(false)
        })
    }

  //! 2. firestoreのproducts collectionドキュメントを更新する。
  const editProduct =
    (productId: string, data: AddProductData, creator: string) =>
    (imageUrl: string, imagePath: string) => {
      const { title, description, price, imageFileName, category, inventory } =
        data
      setLoading(true)
      setEditProductFinished(false)

      const editedProduct: UploadProduct = {
        title,
        description,
        price: +price,
        category,
        inventory: +inventory,
        imageUrl,
        imageFileName,
        imageRef: imagePath,
        creator,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      productsRef
        .doc(productId)
        .set(editedProduct, { merge: true })
        .then(() => {
          setEditProductFinished(true)
          setLoading(false)
        })
        .catch((err) => {
          const { message } = err as { message: string }

          setError(message)
          setLoading(false)
        })
    }

  const deleteProduct = async (product: Product) => {
    try {
      setLoading(true)
      // 1. Delete the product's image from storage

      const imageRef = storageRef.child(product.imageRef)
      await imageRef.delete()

      // 2. Delete the document from the products collection in firestore
      await productsRef.doc(product.id).delete()
      // 3. Todo: Delete the cart item if the cart item is the deleted product

      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)
      return false
    }
  }

  return {
    uploadImageToStorage,
    addNewProduct,
    editProduct,
    deleteProduct,
    uploadProgression,
    setUploadProgression,
    addProductFinished,
    editProductFinished,
    loading,
    error,
  }
}

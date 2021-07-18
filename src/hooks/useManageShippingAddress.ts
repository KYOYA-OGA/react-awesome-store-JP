import { usersRef } from '../firebase'
import { firebase } from '../firebase/config'

import { Address, UserInfo } from '../types'
import { useAsyncCall } from './useAsyncCall'

export const useManageShippingAddress = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const addNewAddress = async (
    data: Omit<Address, 'index'>,
    userInfo: UserInfo
  ) => {
    try {
      setLoading(true)

      const updatedUserInfo = {
        shippingAddresses: userInfo.shippingAddresses
          ? [...userInfo.shippingAddresses, data]
          : [data],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      // update the user document in the users collection in firestore

      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true })
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  const editAddress = async (
    data: Omit<Address, 'index'>,
    index: number,
    userInfo: UserInfo
  ) => {
    try {
      if (!userInfo.shippingAddresses) {
        setError('Sorry cannot edit the shipping address.')
        return false
      }

      setLoading(true)

      // the current shipping addresses array
      const currentShippingAddresses = userInfo.shippingAddresses

      // update the shipping address
      currentShippingAddresses[index] = data

      // updated user info
      const updatedUserInfo = {
        shippingAddresses: currentShippingAddresses,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      // update the user document in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true })
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  const deleteAddress = async (index: number, userInfo: UserInfo) => {
    try {
      if (
        !userInfo.shippingAddresses ||
        userInfo.shippingAddresses.length === 0
      ) {
        setError('Sorry,something went wrong...')
        return false
      }

      setLoading(true)

      // updated user info
      const updatedUserInfo = {
        shippingAddresses: userInfo.shippingAddresses.filter(
          (_, i) => i !== index
        ),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      // update the user document in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true })
      setLoading(false)

      return true
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)

      return false
    }
  }

  return { addNewAddress, editAddress, deleteAddress, loading, error }
}

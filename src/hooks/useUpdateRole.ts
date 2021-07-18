import { Role } from '../types'
import { useAsyncCall } from './useAsyncCall'
import { functions } from '../firebase/config'

export const useUpdateRole = () => {
  const { loading, setLoading, error, setError } = useAsyncCall()

  const updateRole = async (userId: string, newRole: Role) => {
    try {
      setLoading(true)

      const updateUserRole = functions.httpsCallable('updateUserRole')

      await updateUserRole({ userId, newRole })
      setLoading(false)

      return true
    } catch (error) {
      setError('Sorry, something went wrong')
      setLoading(false)

      return false
    }
  }

  return { updateRole, loading, error }
}

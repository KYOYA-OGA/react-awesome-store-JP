import { useState } from 'react'

export const useAsyncCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  return { loading, setLoading, error, setError, successMsg, setSuccessMsg }
}

import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'

import { UserInfo } from '../types'
import { isAdmin } from '../helpers'
import { snapshotToDoc, userCountsRef, usersRef } from '../firebase'
import { firebase } from '../firebase/config'

const userQueryLimit = 30

export const useFetchUsers = (userInfo: UserInfo) => {
  const { loading, setLoading, error, setError } = useAsyncCall()
  const [users, setUsers] = useState<UserInfo[] | null>(null)
  const [userCounts, setUserCounts] = useState(0)
  const [lastDocument, setLastDocument] =
    useState<firebase.firestore.DocumentData>()

  // Next query
  const queryMoreUsers = async () => {
    try {
      if (!lastDocument) return

      setLoading(true)

      const snapshots = await usersRef
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocument)
        .limit(userQueryLimit)
        .get()
      const newUsers = snapshots.docs.map((snapshot) =>
        snapshotToDoc<UserInfo>(snapshot)
      )

      const lastVisible = snapshots.docs[snapshots.docs.length - 1]
      setLastDocument(lastVisible)

      // Combine the new users with the existing users state
      setUsers((prev) => (prev ? [...prev, ...newUsers] : newUsers))
      setLoading(false)
    } catch (err) {
      const { message } = err as { message: string }

      setError(message)
      setLoading(false)
    }
  }

  // query the users collection (first query)
  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) {
      setUsers(null)
      return
    }

    setLoading(true)

    const unsubscribe = usersRef
      .orderBy('createdAt', 'desc')
      .limit(userQueryLimit)
      .onSnapshot({
        next: (snapshots) => {
          const users = snapshots.docs.map((snapshot) =>
            snapshotToDoc<UserInfo>(snapshot)
          )

          const lastVisible = snapshots.docs[snapshots.docs.length - 1]
          setLastDocument(lastVisible)

          setUsers(users)
          setLoading(false)
        },
        error: (err) => {
          setError(err.message)
          setUsers(null)
          setLoading(false)
        },
      })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // query the user-counts/counts
  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) {
      setUserCounts(0)
      return
    }

    const unsubscribe = userCountsRef.doc('counts').onSnapshot({
      next: (snapshot) => {
        const { userCounts } = snapshot.data() as { userCounts: number }

        setUserCounts(userCounts)
      },
      error: (err) => {
        setError(err.message)
        setUserCounts(0)
      },
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { users, userCounts, loading, error, queryMoreUsers }
}

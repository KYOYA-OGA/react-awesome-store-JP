import React, { useState, useEffect } from 'react'

import Spinner from '../components/Spinner'
import User from '../components/manage-users/User'
import Pagination from '../components/Pagination'

import { useSearchContext } from '../state/search-context'

import { usePagination } from '../hooks/usePagination'
import { useFetchUsers } from '../hooks/useFetchUsers'
import { UserInfo } from '../types'

const usersPerPage = 2

interface Props {
  userInfo: UserInfo
}

const ManageUsers: React.FC<Props> = ({ userInfo }) => {
  const { users, userCounts, loading, error, queryMoreUsers } =
    useFetchUsers(userInfo)
  const { searchedItems } = useSearchContext()
  const { page, totalPages } = usePagination(
    userCounts,
    usersPerPage,
    undefined,
    searchedItems as UserInfo[]
  )
  const [usersByPage, setUsersByPage] = useState(users)
  const [paginatedSearchedItems, setPaginatedSearchedItems] =
    useState(searchedItems)

  useEffect(() => {
    const startIndex = usersPerPage * (page - 1)
    const endIndex = usersPerPage * page
    if (searchedItems) {
      setPaginatedSearchedItems(searchedItems.slice(startIndex, endIndex))
      setUsersByPage([])
    } else {
      if (!users) return

      // Check if we need to query more users
      if (users.length < userCounts && users.length < usersPerPage * page) {
        queryMoreUsers()
        return
      }
      setUsersByPage(users.slice(startIndex, endIndex))
      setPaginatedSearchedItems(null)
    }
    // eslint-disable-next-line
  }, [searchedItems, users, page, userCounts])

  if (loading) return <Spinner color="grey" height={50} width={50} />

  if (error) return <h2 className="header--center">{error}</h2>

  if (!users || users.length === 0)
    return <h2 className="header--center">ユーザーがいません</h2>

  return (
    <div className="page--manage-users">
      <h2 className="header--center">ユーザーを編集する</h2>

      <Pagination page={page} totalPages={totalPages} />

      <table className="table table--manage-users">
        <thead>
          <tr>
            {/* Header */}
            <th className="table-cell" style={{ width: '20%' }} rowSpan={2}>
              名前
            </th>
            <th className="table-cell" style={{ width: '25%' }} rowSpan={2}>
              メールアドレス
            </th>
            <th className="table-cell" rowSpan={2}>
              作成日
            </th>

            <th className="table-cell" style={{ width: '25%' }} colSpan={3}>
              役割
            </th>
          </tr>

          {/* Sub header */}
          <tr>
            <th className="table-cell">クライアント</th>
            <th className="table-cell">管理者</th>
            <th className="table-cell">マスター管理者</th>
          </tr>
        </thead>

        <tbody>
          {paginatedSearchedItems ? (
            <>
              {paginatedSearchedItems.length < 1 ? (
                <tr>
                  {' '}
                  <td colSpan={6}>
                    {' '}
                    <h2 className="header--center">ユーザーがいません</h2>{' '}
                  </td>
                </tr>
              ) : (
                (paginatedSearchedItems as UserInfo[]).map((user) => (
                  <User key={user.id} user={user} admin={userInfo} />
                ))
              )}
            </>
          ) : (
            usersByPage &&
            usersByPage.map((user) => (
              <User key={user.id} user={user} admin={userInfo} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUsers

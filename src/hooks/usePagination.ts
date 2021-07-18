import { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { calculateTotalPages } from '../helpers'

export const usePagination = <T, U>(
  totalItems: number,
  perPage: number,
  activeTab?: T,
  searchedItems?: U[] | null
) => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const history = useHistory()
  const { search, pathname } = useLocation()
  const params = new URLSearchParams(search)
  const currentPage = params.get('page')

  useEffect(() => {
    if (currentPage) setPage(+currentPage)
    else setPage(1)
  }, [currentPage])

  // when the active tab changes, reset the tab page to 1
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    if (searchedItems) {
      setPage(1)
      setTotalPages(calculateTotalPages(searchedItems.length, perPage))
      // Remove the cat query string
      history.replace(`${pathname}?page=1`)
    } else setTotalPages(calculateTotalPages(totalItems, perPage))
  }, [activeTab, searchedItems, totalItems, perPage, history, pathname])

  return { page, totalPages }
}

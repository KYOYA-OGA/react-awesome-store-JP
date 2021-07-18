import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Props<T> {
  label: T
  tabType: string
  activeTab: T
  withPagination?: boolean
}

const Tab = <T extends string>({
  label,
  tabType,
  activeTab,
  withPagination,
}: Props<T>) => {
  const { pathname } = useLocation()
  return (
    <Link
      to={
        withPagination
          ? `${pathname}?${tabType}=${label}&page=1`
          : `${pathname}?${tabType}=${label}`
      }
    >
      <p
        className={`paragraph ${
          label === activeTab ? 'btn-tab btn-tab--active' : 'btn-tab'
        }`}
        style={{ marginRight: '1rem' }}
      >
        {label}
      </p>
    </Link>
  )
}

export default Tab

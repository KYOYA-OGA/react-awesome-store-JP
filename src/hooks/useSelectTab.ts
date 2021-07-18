import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useSelectTab = <T>(tabType: string, defaultTab: T) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const { search } = useLocation()

  const params = new URLSearchParams(search)

  const tab = params.get(tabType) as unknown as T

  useEffect(() => {
    if (tab) setActiveTab(tab)
    else setActiveTab(defaultTab)
  }, [tab, defaultTab])

  return { activeTab }
}

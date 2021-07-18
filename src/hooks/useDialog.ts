import { useState } from 'react'

export const useDialog = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return { openDialog, setOpenDialog }
}

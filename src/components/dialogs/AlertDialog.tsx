import React from 'react'

import DialogWrapper from './DialogWrapper'
import Button from '../Button'

interface Props {
  header: string
  message: string
  // onOpenDialog?: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  error?: string
  confirmText?: string
}

const AlertDialog: React.FC<Props> = ({
  header,
  message,
  onCancel,
  onConfirm,
  loading,
  error,
  confirmText,
}) => {
  return (
    <DialogWrapper
      header={header}
      onClose={onCancel && !loading ? onCancel : undefined}
    >
      <div className="dialog-body">
        <div className="alert-message paragraph paragraph--success">
          {message}
        </div>

        <div className="alert-action">
          {onCancel && (
            <Button
              className="btn--cancel"
              onClick={onCancel}
              disabled={loading}
              width="20%"
            >
              キャンセル
            </Button>
          )}
          {onConfirm && (
            <Button
              className="btn--confirm"
              onClick={() => onConfirm()}
              loading={loading}
              disabled={loading}
              width="20%"
            >
              {confirmText ? confirmText : '確認'}
            </Button>
          )}
        </div>

        {error && <p className="paragraph paragraph--error">{}</p>}
      </div>
    </DialogWrapper>
  )
}

export default AlertDialog

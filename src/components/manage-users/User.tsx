import React, { useState } from 'react'

import Button from '../Button'
import { useUpdateRole } from '../../hooks/useUpdateRole'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserInfo } from '../../types'

interface Props {
  user: UserInfo
  admin: UserInfo
}

const User: React.FC<Props> = ({
  user: { id, username, email, createdAt, role },
  admin,
}) => {
  const [newRole, setNewRole] = useState(role)
  const [isEditing, setIsEditing] = useState(false)

  const { updateRole, error, loading } = useUpdateRole()

  const handleUpdateRole = async () => {
    if (role === newRole) return

    const finished = await updateRole(id, newRole)

    if (finished) setIsEditing(false)

    if (error) alert(error)
  }
  return (
    <tr>
      {/* User name */}
      <td className="table-cell" style={{ width: '20%' }}>
        {username}
      </td>

      {/* Email */}
      <td className="table-cell" style={{ width: '25%' }}>
        {email}
      </td>

      {/* CreatedAt */}
      <td className="table-cell">
        {createdAt && createdAt.toDate().toLocaleDateString()}
      </td>

      {/* Role - Client */}
      <td className="table-cell">
        {newRole === 'CLIENT' ? (
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            size="1x"
            style={{
              cursor: isEditing ? 'pointer' : undefined,
              color: isEditing ? 'green' : undefined,
            }}
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            size="1x"
            style={{
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => setNewRole('CLIENT')}
          />
        ) : (
          ''
        )}
      </td>

      {/* Role - Admin */}
      <td className="table-cell">
        {newRole === 'ADMIN' ? (
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            size="1x"
            style={{
              cursor: isEditing ? 'pointer' : undefined,
              color: isEditing ? 'green' : undefined,
            }}
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            size="1x"
            style={{
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => setNewRole('ADMIN')}
          />
        ) : (
          ''
        )}
      </td>

      {/* Role - Super Admin */}
      <td className="table-cell">
        {role === 'SUPER_ADMIN' ? (
          <FontAwesomeIcon icon={['fas', 'check-circle']} size="1x" />
        ) : (
          ''
        )}
      </td>

      {/* Edit */}
      {admin.role === 'SUPER_ADMIN' && (
        <td className="table-cell">
          {role !== 'SUPER_ADMIN' && (
            <>
              {!isEditing ? (
                <FontAwesomeIcon
                  icon={['fas', 'edit']}
                  size="1x"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsEditing(true)}
                />
              ) : (
                <div className="table__update-action">
                  <Button
                    width="45%"
                    height="auto"
                    className="btn--cancel"
                    style={{ fontSize: '1.3rem' }}
                    onClick={() => {
                      setNewRole(role)
                      setIsEditing(false)
                    }}
                    disabled={loading}
                  >
                    キャンセル
                  </Button>
                  <Button
                    width="45%"
                    height="auto"
                    className="btn--confirm"
                    style={{ fontSize: '1.3rem' }}
                    onClick={handleUpdateRole}
                    loading={loading}
                    spinnerHeight={10}
                    spinnerWidth={10}
                    disabled={loading || role === newRole}
                  >
                    確認
                  </Button>
                </div>
              )}
            </>
          )}
        </td>
      )}
    </tr>
  )
}

export default User

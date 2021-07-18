import { NavLink } from 'react-router-dom'
import { useViewContext } from '../../state/view-context'

interface Props {}

const AdminDropdown: React.FC<Props> = () => {
  const { viewMode, setViewMode } = useViewContext()
  return (
    <>
      <div className="sidebar__section">
        <h3
          className="header--center header--orange header--link"
          onClick={() =>
            setViewMode((prev) => (prev === 'admin' ? 'client' : 'admin'))
          }
        >
          {viewMode === 'admin'
            ? 'カスタマー用に切り替える'
            : '管理者用に切り替える'}
        </h3>
      </div>
      {viewMode === 'admin' && (
        <div className="sidebar__section sidebar__section--nav">
          <li className="list">
            <NavLink to="/admin/manage-products" className="list-link">
              商品を管理する
            </NavLink>
          </li>
          <li className="list">
            <NavLink to="/admin/manage-orders" className="list-link">
              注文を管理する
            </NavLink>
          </li>
          <li className="list">
            <NavLink to="/admin/manage-users" className="list-link">
              ユーザーを管理する
            </NavLink>
          </li>
        </div>
      )}
    </>
  )
}

export default AdminDropdown

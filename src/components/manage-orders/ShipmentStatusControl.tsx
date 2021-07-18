import React, { useState, ChangeEvent } from 'react'

import Button from '../Button'

import { useUpdateShipmentStatus } from '../../hooks/useUpdateShipmentStatus'

import { shipmentStatuses } from '../../helpers'
import { Order, ShipmentStatus } from '../../types'

interface Props {
  order: Order
}

const ShipmentStatusControl: React.FC<Props> = ({
  order: { id, shipmentStatus },
}) => {
  const [newStatus, setNewStatus] = useState(shipmentStatus)

  const { updateStatus, loading, error } = useUpdateShipmentStatus()

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setNewStatus(e.target.value as ShipmentStatus)

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === shipmentStatus) return

    const finished = await updateStatus(id, newStatus)

    if (!finished && error) alert(error)
  }

  return (
    <div className="shipment-status">
      <select
        name="status"
        className="status-action"
        defaultValue={shipmentStatus}
        onChange={handleStatusChange}
      >
        {shipmentStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <Button
        width="40%"
        className="btn--orange"
        loading={loading}
        disabled={loading || newStatus === shipmentStatus}
        onClick={handleUpdateStatus}
      >
        Update
      </Button>
    </div>
  )
}

export default ShipmentStatusControl

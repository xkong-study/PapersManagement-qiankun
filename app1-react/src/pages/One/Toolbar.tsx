import React from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  onDelete?: () => void
  onAdd?: () => void,
  toolbar?: React.ReactChild
  selectedRowKeys: string[]
}

const Toolbar: React.FC<Props> = function({
                                            selectedRowKeys,
                                            toolbar,
                                            onDelete,
                                            onAdd
                                          }) {
  const showToolbar = onDelete || onAdd
  const selectedLen = selectedRowKeys.length
  const disabled = selectedLen <= 0

  return showToolbar ? (
    <div className="table-action-panel">
      <div>
        {onAdd && (
          <Button
            type="primary"
            onClick={onAdd}
            icon={<PlusOutlined />}
          >
            new
          </Button>
        )}

        {onDelete && (
          <Popconfirm
            title={`Are you sure to delete ${selectedLen} record？`}
            onConfirm={onDelete}
            placement="bottomRight"
            okType="danger"
            disabled={disabled}
          >
            <Button
              type="primary"
              danger
              disabled={disabled}
              icon={<DeleteOutlined />}
            >
              delete
            </Button>
          </Popconfirm>
        )}
      </div>

      {toolbar}
    </div>
  ) : null
}

export default Toolbar

/**
 * @fileOverview command
 * @date 2023-07-27
 * @author poohlaha
 */
import React, {ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import { Card, Input, Button, Table } from 'antd'
import Loading from '@views/components/loading/loading'
import MBreadcrumb from '@views/modules/breadcrumb'

const Command: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const {monitorStore, leftStore} = useStore()

  useMount(async () => {
    await onRefresh()
  })

  const onRefresh = async () => {
    await monitorStore.getCommandList()
  }

  const getOptions = (text = '', record: any = {}, index = 0) => {
    return (
      <div className="options" key={index}>
        <a onClick={() => monitorStore.onExecCommand(record.id || '')}>执行</a>
        <a onClick={() => monitorStore.onRemoveCommand(record.id || '')}>删除</a>
      </div>
    )
  }

  const commandColumns: any = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '脚本',
      dataIndex: 'exec',
      render: (text = '', record: any = {}, index = 0) => {
        if (text.indexOf('\\n') === -1) {
          return <p key={index}>{text || ''}</p>
        }

        let texts = text.split('\\n') || []
        return (
          <div className="exec-column" key={index}>
            {
              texts.length > 0 && texts.map((t: string) => {
                return <p>{t || ''}</p>
              })
            }
          </div>
        )
      }
    },
    {
      title: '添加时间',
      dataIndex: 'create_date'
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: getOptions
    }
  ]

  const render = () => {
    return (
      <div className="command-page w100 min-h100 flex-direction-column">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb
            className="flex-1"
            items={leftStore.menuList}
            activeIndexes={leftStore.activeIndexes}
            onChange={(activeIndexes: Array<number> = []) => leftStore.setActiveIndexes(activeIndexes)}
          />

          <div className="top-add flex-align-center">
            <div className="refresh-item flex-align-center" onClick={onRefresh}>
              <svg className="svg-icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M1007.2 262.4c-12.8-6.4-32 0-38.4 19.2l-25.6 70.4C904.8 256 847.2 179.2 757.6 128c-108.8-64-230.4-89.6-352-57.6C232.8 108.8 104.8 236.8 60 409.6 53.6 428.8 66.4 441.6 79.2 448 98.4 448 111.2 441.6 117.6 422.4c38.4-153.6 153.6-268.8 307.2-300.8 108.8-25.6 217.6-6.4 307.2 51.2 76.8 44.8 134.4 115.2 166.4 198.4l-76.8-32c-12.8-6.4-32 0-38.4 19.2-6.4 12.8 0 32 12.8 38.4l128 51.2c6.4 6.4 12.8 6.4 19.2 6.4 0 0 6.4 0 6.4 0 0 0 0 0 0 0 0 0 0 0 6.4 0 6.4 0 12.8-6.4 12.8-12.8L1026.4 294.4C1032.8 281.6 1020 268.8 1007.2 262.4zM949.6 576c-12.8-6.4-32 6.4-32 19.2-38.4 153.6-153.6 268.8-307.2 300.8-108.8 25.6-217.6 6.4-307.2-51.2-76.8-44.8-134.4-115.2-166.4-198.4l76.8 32c12.8 6.4 32 0 38.4-19.2 6.4-12.8 0-32-12.8-38.4L104.8 576C98.4 576 92 569.6 85.6 569.6c0 0-6.4 0-6.4 0 0 0 0 0 0 0 0 0 0 0-6.4 0C66.4 576 60 582.4 60 588.8L2.4 729.6c-6.4 12.8 0 32 19.2 38.4 12.8 6.4 32 0 38.4-19.2l25.6-70.4C124 768 181.6 844.8 271.2 896c108.8 64 230.4 89.6 352 57.6 172.8-38.4 307.2-172.8 345.6-345.6C975.2 595.2 962.4 582.4 949.6 576z" fill="currentColor"></path>
              </svg>
              <p>刷新</p>
            </div>
          </div>
        </div>

        {/* 输入信息 */}
        <div className="command-form">
          <Card title="信息输入">
           <div className="form-item flex-align-center">
             <label>名称:</label>
             <Input
               placeholder="请输入名称"
               value={monitorStore.commandForm.name || ''}
               allowClear={true}
               onChange={(e) => {
                 monitorStore.commandForm.name = e.target.value || ''
               }}
             />
           </div>

            <div className="form-item flex-align-center">
              <label>脚本:</label>
              <Input.TextArea
                placeholder="请输入脚本"
                autoSize={{ minRows: 3, maxRows: 6 }}
                value={monitorStore.commandForm.exec || ''}
                allowClear={true}
                onChange={(e) => {
                  monitorStore.commandForm.exec = e.target.value || ''
                }}
              />
            </div>

            <div className="flex flex-jsc-end w100" onClick={() => monitorStore.onCommandSubmit()}>
              <Button type="primary">提交</Button>
            </div>
          </Card>
        </div>

        {/* 查询信息 */}
        <div className="command-content">
          <Table columns={commandColumns} dataSource={monitorStore.commandList} />
        </div>

        <Loading show={monitorStore.loading}/>
      </div>
    )
  }

  return render()
}
export default observer(Command)

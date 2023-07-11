/**
 * @fileOverview process
 * @date 2023-07-06
 * @author poohlaha
 */
import React, {ReactElement, useState} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import {Collapse, Descriptions, Badge, Modal, Select} from 'antd'
import Loading from '@views/components/loading/loading'
import MBreadcrumb from '@views/modules/breadcrumb'
import NoData from '@views/components/noData'
import Utils from '@utils/utils'
const Process: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {monitorStore, leftStore} = useStore()
  const [showModal, setShowModal] = useState(false)

  useMount(async () => {
    await onRefresh()
  })

  const onRefresh = async () => {
    await monitorStore.getList()
  }

  // 进程使用情况
  const getProcessHtml = (processes: Array<{[K: string]: any}> = []) => {
    if (processes.length === 0) {
      return ( <NoData />)
    }

    return (
      processes.map((process: {[K: string]: any} = {}, index: number) => {
        return (
          <Descriptions bordered column={2} key={index}>
            <Descriptions.Item label="pid"><p className="color-text">{process.pid || ''}</p></Descriptions.Item>
            <Descriptions.Item label="parentPid"><p className="color-text">{process.parent_pid || ''}</p></Descriptions.Item>
            <Descriptions.Item label="start time"><p className="color-text">{process.start_time || ''}</p></Descriptions.Item>
            <Descriptions.Item label="cmd"><p className="color-text">{process.cmd || ''}</p></Descriptions.Item>
            <Descriptions.Item label="exe"><p className="color-text">{process.exe || ''}</p></Descriptions.Item>
            <Descriptions.Item label="virtual memory(bytes)"><p className="color-text">{process.virtual_memory || ''}</p></Descriptions.Item>
            <Descriptions.Item label="run time"><p className="color-text">{process.run_time || ''}</p></Descriptions.Item>
            <Descriptions.Item label="status">
              <Badge status="processing" text={process.status || ''} />
            </Descriptions.Item>

            {/* 磁盘使用情况 */}
            <Descriptions.Item label="disk usage" span={2}>
              <div className="card-item flex-align-center">
                <p>total written bytes:</p>
                <p>{process.total_written_bytes|| 0}</p>
              </div>

              <div className="card-item flex-align-center">
                <p>written bytes:</p>
                <p>{process.written_bytes|| 0}</p>
              </div>

              <div className="card-item flex-align-center">
                <p>total read bytes:</p>
                <p>{process.total_read_bytes|| 0}</p>
              </div>

              <div className="card-item flex-align-center">
                <p>read bytes:</p>
                <p>{process.read_bytes|| 0}</p>
              </div>
            </Descriptions.Item>
          </Descriptions>
        )
      })
    )
  }

  const getCollapseItems = () => {
    if (monitorStore.loading || monitorStore.processes.length === 0) {
      return []
    }

    let items: Array<any> = []
    monitorStore.processes.forEach((item: {[K: string]: any}, index: number) => {
      let name = item.name || ''
      let processes = item.processes || []
      items.push({
        key: '' + index,
        label: name,
        children: getProcessHtml(processes),
        extra: (
         <div className="flex-align-center extra-item">
           <p
             onClick={async (event: any) => {
                event.stopPropagation()
                let pidList = processes.map((process: {[K: string]: any}) => process.pid)
                await monitorStore.onKillProcess(name, pidList)
             }}
           >
             结束进程
           </p>
           <p
             onClick={async (event: any) => {
                event.stopPropagation()
                await monitorStore.onRemoveProcess(name)
             }}
           >
             移除进程
           </p>
         </div>
        )
      })
    })

    return items
  }

  // 获取进程列表
  const getSelectProcessList = () => {
    if (monitorStore.processList.length === 0) return []

    let processes: Array<any> = []
    for(let process of monitorStore.processList) {
      if (Utils.isBlank(process.name) || Utils.isBlank(process.pid)) {
        continue
      }

      let arr = processes.filter((a: any) => a.value === process.name) || []
      if (arr.length === 0) {
        processes.push({
          value: process.name,
          label: process.name
        })
      }
    }

    return processes
  }

  const render = () => {
    return (
      <div className="process-page w100 min-h100 flex-direction-column">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb
            className="flex-1"
            items={leftStore.menuList}
            activeIndexes={leftStore.activeIndexes}
            onChange={(activeIndexes: Array<number> = []) => leftStore.setActiveIndexes(activeIndexes)}
          />

          <div className="top-add flex-align-center">
            <div className="add-item flex-align-center" onClick={() => setShowModal(true)}>
              <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 992C246.912 992 32 777.088 32 512 32 246.912 246.912 32 512 32c265.088 0 480 214.912 480 480 0 265.088-214.912 480-480 480z m0-64c229.76 0 416-186.24 416-416S741.76 96 512 96 96 282.24 96 512s186.24 416 416 416z" fill="currentColor"></path>
                <path d="M256 544a32 32 0 0 1 0-64h512a32 32 0 0 1 0 64H256z" fill="currentColor"></path>
                <path d="M480 256a32 32 0 0 1 64 0v512a32 32 0 0 1-64 0V256z" fill="currentColor"></path>
              </svg>
              <p>添加进程</p>
            </div>

            <div className="refresh-item flex-align-center" onClick={onRefresh}>
              <svg className="svg-icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M1007.2 262.4c-12.8-6.4-32 0-38.4 19.2l-25.6 70.4C904.8 256 847.2 179.2 757.6 128c-108.8-64-230.4-89.6-352-57.6C232.8 108.8 104.8 236.8 60 409.6 53.6 428.8 66.4 441.6 79.2 448 98.4 448 111.2 441.6 117.6 422.4c38.4-153.6 153.6-268.8 307.2-300.8 108.8-25.6 217.6-6.4 307.2 51.2 76.8 44.8 134.4 115.2 166.4 198.4l-76.8-32c-12.8-6.4-32 0-38.4 19.2-6.4 12.8 0 32 12.8 38.4l128 51.2c6.4 6.4 12.8 6.4 19.2 6.4 0 0 6.4 0 6.4 0 0 0 0 0 0 0 0 0 0 0 6.4 0 6.4 0 12.8-6.4 12.8-12.8L1026.4 294.4C1032.8 281.6 1020 268.8 1007.2 262.4zM949.6 576c-12.8-6.4-32 6.4-32 19.2-38.4 153.6-153.6 268.8-307.2 300.8-108.8 25.6-217.6 6.4-307.2-51.2-76.8-44.8-134.4-115.2-166.4-198.4l76.8 32c12.8 6.4 32 0 38.4-19.2 6.4-12.8 0-32-12.8-38.4L104.8 576C98.4 576 92 569.6 85.6 569.6c0 0-6.4 0-6.4 0 0 0 0 0 0 0 0 0 0 0-6.4 0C66.4 576 60 582.4 60 588.8L2.4 729.6c-6.4 12.8 0 32 19.2 38.4 12.8 6.4 32 0 38.4-19.2l25.6-70.4C124 768 181.6 844.8 271.2 896c108.8 64 230.4 89.6 352 57.6 172.8-38.4 307.2-172.8 345.6-345.6C975.2 595.2 962.4 582.4 949.6 576z" fill="currentColor"></path>
              </svg>
              <p>刷新</p>
            </div>
          </div>
        </div>

        <div className="content flex-1 flex-direction-column">
          {
            !monitorStore.loading && monitorStore.processes.length === 0 ? (
              <Collapse className="flex-1 no-data-container flex-center">
                <NoData />
              </Collapse>
              ) : (
              <Collapse items={getCollapseItems()} defaultActiveKey={['0']}/>
            )
          }

        </div>

        {/* 添加进程 */}
        <Modal
          title="添加进程"
          open={showModal}
          onOk={async () => {
            await monitorStore.onAddProcesses(async () => {
              setShowModal(false)
              await monitorStore.getList()
            })
          }}
          onCancel={() => setShowModal(false)}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择进程"
            optionLabelProp="label"
            onChange={(value: Array<string> = []) => monitorStore.onSelectProcessChange(value)}
            options={getSelectProcessList()}
            showSearch={true}
            allowClear={true}
          />
        </Modal>

        <Loading show={monitorStore.loading}/>
      </div>
    )
  }

  return render();
}

export default observer(Process)

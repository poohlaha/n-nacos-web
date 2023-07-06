/**
 * @fileOverview dashboard
 * @date 2023-07-05
 * @author poohlaha
 */
import React, {Fragment, ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import {Card} from 'antd'
import {
  Chart,
  Interval,
  Coordinate,
  Legend,
  View,
  Annotation,
} from 'bizcharts'
import Loading from "@views/components/loading/loading";

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {dashboardStore} = useStore()

  useMount(async () => {
    await onRefresh()
  })

  const onRefresh = async () => {
    await dashboardStore.getSystemInfo()
  }

  // 转换成 g
  const getMemoryUnit = (memory: number) => {
    if (memory === 0) return ''
    let byte = 1024
    if (memory < Math.pow(byte, 4)) {
      return (memory / Math.pow(byte, 3)).toFixed(2) + 'G'
    }

    return memory + 'B'
  }

  // 内存使用率
  const getMemoryUsed = (totalMemory: number, usedMemory: number) => {
    if (totalMemory === 0) return []
    let usedPercent = (usedMemory / totalMemory).toFixed(4)
    const data = [
      {type: '已使用', percent: parseFloat(usedPercent)},
      {type: '未使用', percent: parseFloat((1 - parseFloat(usedPercent)).toFixed(4))},
    ]

    const cols = {
      percent: {
        formatter: (val: any) => {
          return (val * 100).toFixed(2) + "%";
        }
      }
    }

    return [data, cols]
  }

  const getDiskCardHtml = (disk: {[K: string]: any}) => {
    if (Utils.isObjectNull(disk)) return null
    let usedPercent = (disk.available_space / disk.total_space).toFixed(4)
    const data = [
      {type: '未使用', percent: parseFloat(usedPercent)},
      {type: '已使用', percent: parseFloat((1 - parseFloat(usedPercent)).toFixed(4))}
    ]

    const content = {
      percent: (data[0].percent * 100).toFixed(2)  + '%'
    }

    return getPiePercentHtml(data, content, false)
  }

  // 获取磁盘使用情况
  const getDiskHtml = (diskInfo: Array<{[K: string]: any}>) => {
    if (diskInfo.length === 0) return null

    return (
      diskInfo.map((disk: {[K: string]: any}, index: number) => {
        return (
          <Card
            hoverable
            style={{width: 250}}
            cover={getDiskCardHtml(disk)}
            key={index}
          >
            <Card.Meta title={`${disk.name || ''}(${disk.type_ || ''})`} description={`位置: ${disk.mount_point || ''}`} />
            <Card.Meta description={`总空间: ${getMemoryUnit(disk.total_space) || ''}`} />
            <Card.Meta description={`可用空间: ${getMemoryUnit(disk.available_space) || ''}`} />
          </Card>
        )
      })
    )
  }

  // 获取操作系统
  const getOs = (osType: string) => {
    if (Utils.isBlank(osType)) return "Unknow"
    if (osType.toLowerCase() === 'windows') return 'Windows'
    if (osType.toLowerCase() === 'linux') return 'Linux'
    if (osType.toLowerCase() === 'darwin') return 'MacOs'
    return "Unknow"
  }


  const getHtml = () => {
    let info = dashboardStore.systemInfo.info || {}
    let diskInfo = dashboardStore.systemInfo.disk_info || []
    let processes = dashboardStore.systemInfo.processes || []
    let memory: Array<any> = getMemoryUsed(info.total_memory, info.used_memory)
    let memoryData: Array<any> = []
    let content: {[K: string]: any} = {}
    if (memory.length > 1) {
      memoryData = memory[0]
      content.percent = (memoryData[0].percent * 100).toFixed(2) + '%'
    }

    return (
      <Fragment>
        {/* 机器信息 */}
        <Card title="服务器信息" className="sys-info-card" extra={<div onClick={onRefresh}>刷新</div>}>
          <div className="card-item flex-align-center">
            <p>操作系统: </p>
            <p>{getOs(info.os_type || '')}</p>
          </div>

          <div className="card-item flex-align-center">
            <p>CPU核数: </p>
            <p>{info.cpu_num || 0}</p>
          </div>

          <div className="card-item flex-align-center">
            <p>总内存: </p>
            <p>{getMemoryUnit(info.total_memory || 0) || 0}</p>
          </div>

          <div className="card-item flex-align-center">
            <p>已使用内存: </p>
            <p>{getMemoryUnit(info.used_memory || 0) || 0}</p>
          </div>
        </Card>

        {/* 内存使用率 */}
        <Card title="内存使用率">
          {
            info.total_memory > 0 && (
              <div className="card-item">
                {
                  getPiePercentHtml(memoryData, content)
                }
              </div>
              )
          }
        </Card>

        {/* 磁盘使用情况*/}
        <Card title="磁盘使用情况">
          <div className="card-item disk-card flex-center">
            {getDiskHtml(diskInfo)}
          </div>
        </Card>

      </Fragment>
    )

  }

  // 饼图
  const getPiePercentHtml = (data: Array<{[K: string]: any}> = [], content: {[K: string]: any} = {}, useLegend: boolean = true) => {
    return (
      <Chart placeholder={false} height={250} padding="auto" autoFit>
        <Legend visible={useLegend} />
        <View
          data={data}
          scale={{
            percent: {
              formatter: (val: any) => {
                return (val * 100).toFixed(2) + "%";
              }
            }
          }}
        >
          <Coordinate type="theta" innerRadius={0.75} />
          <Interval
            position="percent"
            adjust="stack"
            color={["type", ["rgba(100, 100, 255, 0.6)", "#eee"]]}
            size={20}
          />

          <Annotation.Text
            position={["50%", "50%"]}
            content={content.percent}
            style={{
              fontSize: 24,
              textAlign: "center",
            }}
          />
        </View>
      </Chart>
    )
  }

  const render = () => {
    return (
      <div className="dashboard-page w100 min-h100">
        {getHtml()}
        <Loading show={dashboardStore.loading} />
      </div>
    )
  }

  return render();
}

export default observer(Dashboard)

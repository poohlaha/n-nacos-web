/**
 * @fileOverview dashboard
 * @date 2023-04-12
 * @author poohlaha
 */
import React, {Fragment, ReactElement, useRef} from 'react'
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
  Axis,
  Tooltip,
  View,
  Annotation,
} from 'bizcharts'

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {commonStore} = useStore()

  useMount(() => {
    commonStore.onSendMessage({
      data: ['cpu', 'dist', 'nginx'],
      request: 'system'
    })
  })

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

  // 获取操作系统
  const getOs = (osType: string) => {
    if (Utils.isBlank(osType)) return "Unknow"
    if (osType.toLowerCase() === 'windows') return 'Windows'
    if (osType.toLowerCase() === 'linux') return 'Linux'
    if (osType.toLowerCase() === 'darwin') return 'Macos'
    return "Unknow"
  }

  const getHtml = () => {
    let info = commonStore.data.info || {}
    let diskInfo = commonStore.data.disk_info || []
    let process = commonStore.data.processes || []
    let memory: Array<any> = getMemoryUsed(info.total_memory, info.used_memory)
    let memoryData: Array<any> = []
    let memoryCol: {[K: string]: any} = {}
    let content: {[K: string]: any} = {}
    if (memory.length > 1) {
      memoryData = memory[0]
      memoryCol = memory[1]
      content.percent = memoryData[0].percent * 100  + '%'
    }

    return (
      <Fragment>
        {/* 机器信息 */}
        <Card title="服务器信息">
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
            info.total_memory > 0 ? (
              <div className="card-item">
                <Chart placeholder={false} height={250} padding="auto" autoFit>
                  <Legend visible={true} />
                  <View
                    data={memoryData}
                    scale={memoryCol}
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
              </div>
              ) : (
              <div className="card-item flex-center">无</div>
            )
          }
        </Card>

        {/* 磁盘使用情况*/}
        <Card title="磁盘使用">

        </Card>
      </Fragment>
    )

  }

  const render = () => {
    return (
      <div className="dashboard-page wh100">
        {getHtml()}
      </div>
    )
  }

  return render();
}

export default observer(Dashboard)

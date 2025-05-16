/**
 * @fileOverview 服务器信息
 * @date 2024-02-29
 * @author poohlaha
 */
import React, { ReactElement, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, Descriptions, Button } from 'antd'
import useMount from '@hooks/useMount'
import { useStore } from '@views/stores'
import { ADDRESS, TOAST } from '@utils/base'
import Loading from '@views/components/loading/loading'
import { listen } from '@tauri-apps/api/event'
import Utils from '@utils/utils'
import * as echarts from 'echarts'

// import { Chart, Interval, Coordinate, Legend, View, Annotation } from 'bizcharts'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import CommonHtmlHandler from '@views/handlers/common'

const Server = (): ReactElement => {
  const [showPwd, setShowPwd] = useState(false)
  const [_, setId] = useState('')
  const { serverStore } = useStore()
  const cupUsedRef = useRef(null)
  const memUsedRef = useRef(null)

  useMount(async () => {
    let id = ADDRESS.getAddressQueryString('id') || ''
    id = Utils.decrypt(decodeURIComponent(id))
    setId(id)
    if (serverStore.list.length === 0) {
      await serverStore.getList()
    }

    serverStore.serverInfo = (serverStore.list || []).find((server: { [K: string]: any }) => server.id === id) || {}

    // 内存使用率
    /*
    let memUsedChartDom = memUsedRef.current || null
    let memUsedChart = echarts.init(memUsedChartDom)
    let memUsedDate: Array<any> = []
    let memUsedData: Array<any> = []

     */

    // cpu 使用率
    let cpuUsedChartDom = cupUsedRef.current || null
    let cupUsedChart = echarts.init(cpuUsedChartDom)
    let cupUsedDate: Array<any> = []
    let cupUsedData: Array<any> = []

    // 监听监控结果运行事件
    await listen('monitor_response', async (event: any = {}) => {
      let data = event.payload || {}
      console.log('receive monitor response', data)
      if (data.code !== 200) {
        serverStore.isStartMonitor = false
        TOAST.show({ message: data.error || '监控结果运行异常', type: 4 })
        return
      }

      serverStore.isStartMonitor = true
      let body = data.body || {}
      if (Utils.isObjectNull(serverStore.monitorListenInfo.os || {})) {
        serverStore.monitorListenInfo.os = body.os || {}
      }

      let time = Utils.formatDateStr(new Date(), 'HH:mm:ss') || ''
      serverStore.memUsedList.push({
        time: time,
        value: getMemoryUnit(serverStore.monitorListenInfo.os?.used_memory || 0),
        total: getMemoryUnit(serverStore.monitorListenInfo.os?.total_memory || 0)
      })

      /*
      memUsedDate.push(time)
      memUsedData.push(body.os?.used_memory || 0)
      memUsedChart.setOption(getChartOptions(memUsedDate, memUsedData, '内存使用率', 0, body.os?.total_memory || 0))
       */
      // cpu used
      if (cupUsedDate.length >= 100) {
        // cupUsedDate.shift()
      }

      if (cupUsedData.length >= 100) {
        // cupUsedDate.shift()
      }

      cupUsedDate.push(time)
      cupUsedData.push(body.cpuInfo.usage)
      cupUsedChart.setOption(getChartOptions(cupUsedDate, cupUsedData, 'CPU使用率', 1))

      serverStore.monitorListenInfo.diskInfo = body.diskInfo || []
      serverStore.monitorListenInfo.cupInfo = body.cupInfo || {}
      serverStore.monitorListenInfo.homeDir = body.homeDir || ''
    })
  })

  const getMemTooltipFormatter = (params: { [K: string]: any } = {}, total: number = 0) => {
    let result = '<div class="line-tooltip card card-no-margin">'
    result += `
            <div class="content-box flex-align-center">
              <p class="font-bold">总内存:</p>
              <p class="value">${getMemoryUnit(total) || '-'}</p>
             </div>
        `
    params.forEach((item: { [K: string]: any }) => {
      result += `
             <div class="content-box flex-align-center">
              <p class="font-bold">${item.seriesName || ''}:</p>
              <p class="value">${getMemoryUnit(item.value) || '-'}</p>
             </div>
          `
    })

    result += '</div>'
    return result
  }

  const getCpuTooltipFormatter = (params: { [K: string]: any } = {}) => {
    let result = '<div class="line-tooltip card card-no-margin">'
    params.forEach((item: { [K: string]: any }) => {
      result += `
             <div class="content-box flex-align-center">
              <p class="font-bold">${item.seriesName || ''}:</p>
              <p class="value">${item.value || '-'}%</p>
             </div>
          `
    })

    result += '</div>'
    return result
  }

  const getChartOptions = (
    date: Array<any>,
    data: Array<any>,
    text: string = '',
    index: number,
    totalMem: number = 0
  ) => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      formatter(params: { [K: string]: any } = {}) {
        if (index === 0) {
          return getMemTooltipFormatter(params, totalMem)
        }
        if (index === 1) {
          return getCpuTooltipFormatter(params)
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      series: [
        {
          name: text,
          type: 'line',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          data: data
        }
      ]
    }
  }

  // 服务器基本信息
  const getServerInfoHtml = () => {
    return (
      <Card title="服务器基本信息" className="server-info-card">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="IP">
            <p className="color-text">{serverStore.serverInfo?.ip || '-'}</p>
          </Descriptions.Item>
          <Descriptions.Item label="端口">
            <p className="color-text">{serverStore.serverInfo?.port || 0}</p>
          </Descriptions.Item>
          <Descriptions.Item label="账号">
            <p className="color-text">{serverStore.serverInfo?.account || '-'}</p>
          </Descriptions.Item>
          <Descriptions.Item label="密码">
            <div className="flex flex-align-center">
              <p className="color-text flex-1">{showPwd ? serverStore.serverInfo?.pwd || '' : '*********'}</p>

              <div className="buttons">
                <Button type="link" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? '隐藏' : '查看'}
                </Button>

                <Button
                  type="link"
                  onClick={() => {
                    try {
                      const tempInput = document.createElement('textarea')
                      tempInput.value = serverStore.serverInfo?.pwd
                      document.body.appendChild(tempInput)
                      tempInput.select()
                      document.execCommand('copy')
                      document.body.removeChild(tempInput)
                      TOAST.show({ message: '复制到剪切板成功', type: 2 })
                    } catch (e) {
                      console.error(e)
                      TOAST.show({ message: '复制到剪切板失败', type: 4 })
                    }
                  }}
                >
                  复制到剪切板
                </Button>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="名称">
            <p className="color-text">{serverStore.serverInfo?.name || '-'}</p>
          </Descriptions.Item>
          <Descriptions.Item label="描述">
            <p className="color-text" style={{ whiteSpace: 'pre' }}>
              {serverStore.serverInfo?.desc || '-'}
            </p>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  // 转换成 g
  const getMemoryUnit = (memory: number) => {
    if (memory === 0) return ''
    let byte = 1024
    if (memory < byte ** 4) {
      return `${(memory / byte ** 3).toFixed(2)}G`
    }

    return `${memory}B`
  }

  // 服务器信息
  // @ts-ignore
  const getServerHtml = () => {
    let os = serverStore.monitorListenInfo?.os || {}
    return (
      <Card
        title="服务器信息"
        className="server-card page-margin-top"
        extra={
          <div
            onClick={async () => {
              await onUploadServer()
            }}
          >
            {serverStore.isStartMonitor ? '停用' : '启用'}
          </div>
        }
      >
        <Card className="info-card" bordered>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="操作系统">
              <p className="color-text">{os.os_type || '-'}</p>
            </Descriptions.Item>
            <Descriptions.Item label="主机名">
              <p className="color-text">{os.host_name || '-'}</p>
            </Descriptions.Item>
            <Descriptions.Item label="CPU核心数">
              <p className="color-text">{os.cpu_num || '-'}</p>
            </Descriptions.Item>
            <Descriptions.Item label="用户主目录">
              <p className="color-text">{serverStore.monitorListenInfo?.homeDir || '-'}</p>
            </Descriptions.Item>
            <Descriptions.Item label="总内存">
              <p className="color-text">{getMemoryUnit(os.total_memory || 0) || '-'}</p>
            </Descriptions.Item>
            <Descriptions.Item label="已使用内存">
              <p className="color-text">{getMemoryUnit(os.used_memory || 0) || '-'}</p>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 内存使用率 */}
        {/* getMemUsedChatHtml() */}

        {/* CPU 使用率 */}
        {getCpuUsedChatHtml()}

        {/* 磁盘使用情况
        {getDistInfoHtml()}
        */}
      </Card>
    )
  }

  // 内存使用率
  // @ts-ignore
  const getMemUsedChatHtml = () => {
    return (
      <Card title="内存使用率" className="mem-info-card page-margin-top">
        <div
          ref={memUsedRef}
          style={{
            height: 500
          }}
        />
      </Card>
    )
  }

  // CPU使用率
  const getCpuUsedChatHtml = () => {
    return (
      <Card title="CPU使用率" className="cpu-info-card page-margin-top">
        <div
          ref={cupUsedRef}
          style={{
            height: 500
          }}
        />
      </Card>
    )
  }

  // 磁盘使用情况
  /*
  const getDistInfoHtml = () => {
    let diskInfo = serverStore.monitorListenInfo.diskInfo || []
    return (
      <Card title="磁盘情况" className="dist-info-card page-margin-top">
        <div className="card-item disk-card flex-center">
          {diskInfo.map((disk: { [K: string]: any }, index: number) => {
            return (
              <Card hoverable style={{ width: 250 }} cover={getDiskCardHtml(disk)} key={index}>
                <Card.Meta
                  title={`${disk.name || ''}(${disk.type_ || ''})`}
                  description={`位置: ${disk.mount_point || ''}`}
                />
                <Card.Meta description={`总空间: ${getMemoryUnit(disk.total_space) || ''}`} />
                <Card.Meta description={`可用空间: ${getMemoryUnit(disk.available_space) || ''}`} />
              </Card>
            )
          })}
        </div>
      </Card>
    )
  }
   */

  /*
  const getDiskCardHtml = (disk: { [K: string]: any }) => {
    if (Utils.isObjectNull(disk)) return null
    let usedPercent = (disk.available_space / disk.total_space).toFixed(4)
    const data = [
      { type: '未使用', percent: parseFloat(usedPercent) },
      { type: '已使用', percent: parseFloat((1 - parseFloat(usedPercent)).toFixed(4)) }
    ]

    const content = {
      percent:  `${(data[0].percent * 100).toFixed(2)}%`
    }

    return getPiePercentHtml(data, content, false)
  }
   */

  // 饼图
  /*
  const getPiePercentHtml = (
    data: Array<{ [K: string]: any }> = [],
    content: { [K: string]: any } = {},
    useLegend: boolean = true
  ) => {
    return (
      <Chart placeholder={false} height={250} padding="auto" autoFit>
        <Legend visible={useLegend} />
        <View
          data={data}
          scale={{
            percent: {
              formatter: (val: any) => {
                return  `${(val * 100).toFixed(2)}%`
              }
            }
          }}
        >
          <Coordinate type="theta" innerRadius={0.75} />
          <Interval
            position="percent"
            adjust="stack"
            color={['type', ['rgba(100, 100, 255, 0.6)', '#eee']]}
            size={20}
          />

          <Annotation.Text
            position={['50%', '50%']}
            content={content.percent}
            style={{
              fontSize: 24,
              textAlign: 'center'
            }}
          />
        </View>
      </Chart>
    )
  }
   */

  const onUploadServer = async () => {
    if (!serverStore.isStartMonitor) {
      await serverStore.startMonitor(serverStore.serverInfo?.id || '')
    } else {
      await serverStore.stopMonitor()
    }
  }

  const getHtml = () => {
    return (
      <div className="flex-direction-column mt-4 p-4">
        {/* 服务器基本信息 */}
        {getServerInfoHtml()}

        {/* 服务器信息
        {getServerHtml()}
         */}
      </div>
    )
  }

  const render = () => {
    return (
      <Page className="server-info-page">
        {/* title */}
        <div className="page-title flex-align-center pt-5 pl-5 pr-5">
          {CommonHtmlHandler.getBackNode()}
          <p className="flex-1 font-bold text-xl ml-2">{RouterUrls.SERVER.DETAIL.NAME}</p>
        </div>

        {getHtml()}
        <Loading show={serverStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Server)

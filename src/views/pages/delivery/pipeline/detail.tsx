/**
 * @fileOverview 流水线详情页面
 * @date 2024-02-21
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import MBreadcrumb from '@views/modules/breadcrumb'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@views/stores'
import Utils from '@utils/utils'
import { Tabs, Button, Tag, Drawer, Popconfirm, Space } from 'antd'
import useMount from '@hooks/useMount'
import { ADDRESS, TOAST } from '@utils/base'
import Loading from '@views/components/loading/loading'
import PipelineProcess from './add/process'
import NoData from '@views/components/noData'
import RunDialog from '@pages/delivery/pipeline/run'
import { listen } from '@tauri-apps/api/event'
import Ansi from 'ansi-to-react'
import MTable from '@views/modules/table'
import RouterUrls from '@route/router.url.toml'

const PipelineDetail = (): ReactElement => {
  const navigate = useNavigate()
  const { pipelineStore, homeStore } = useStore()
  const [open, setOpen] = useState(false)
  const [runReadonly, setRunReadonly] = useState(false)
  const [runTabIndex, setRunTabIndex] = useState('0')

  useMount(async () => {
    let id = ADDRESS.getAddressQueryString('id') || ''
    let serverId = ADDRESS.getAddressQueryString('serverId') || ''
    id = Utils.decrypt(decodeURIComponent(id))
    serverId = Utils.decrypt(decodeURIComponent(serverId))
    console.log(`id: ${id}, serverId: ${serverId}`)

    pipelineStore.loggerList = []
    await pipelineStore.getDetailInfo(id, serverId)

    // 监听流水线运行事件
    await listen('pipeline_exec_response', async (event: any = {}) => {
      let data = event.payload || {}
      console.log('receive pipeline exec response', data)
      if (data.code !== 200) {
        TOAST.show({ message: data.error || '流水线运行失败', type: 4 })
        return
      }

      pipelineStore.detailInfo = data.body || {}
    })

    // 监听流水线步骤事件
    await listen('pipeline_exec_step_log', async (event: any = {}) => {
      let data = event.payload || {}
      console.log('receive pipeline exec step log', data)
      pipelineStore.loggerList.push(data)
    })

    // 监听流水线步骤结果事件
    await listen('pipeline_exec_step_response', async (event: any = {}) => {
      let data = event.payload || {}
      console.log('receive pipeline exec step response', data)
      let body = data.body || {}
      if (Utils.isObjectNull(body)) {
        pipelineStore.detailInfo.run.current.status = 'Failed'
        return
      }

      pipelineStore.detailInfo = body
    })

  })

  const getStatus = (status: string) => {
    if (status === 'No') {
      return (
        <div className="svg-box flex-center no flex-direction-column">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512.602353 31.081412a481.882353 481.882353 0 1 1 0 963.764706 481.882353 481.882353 0 0 1 0-963.764706z m0 60.235294a421.647059 421.647059 0 1 0 0 843.294118 421.647059 421.647059 0 0 0 0-843.294118zM584.282353 356.171294c6.987294 8.312471 9.035294 19.757176 5.300706 29.997177l-104.32753 274.432a30.479059 30.479059 0 0 1-57.344-20.781177l104.32753-274.492235a30.479059 30.479059 0 0 1 51.983059-9.155765z m134.686118-0.843294l120.470588 134.023529a30.479059 30.479059 0 0 1 0 40.779295l-120.470588 134.023529a30.479059 30.479059 0 1 1-45.357177-40.779294l102.159059-113.603765-102.159059-113.603765a30.479059 30.479059 0 1 1 45.357177-40.839529z m-389.12-10.059294l5.360941 0.602353a30.479059 30.479059 0 0 1 16.323764 50.29647L249.374118 509.771294l102.159058 113.603765a30.479059 30.479059 0 0 1-45.296941 40.779294L185.705412 530.130824a30.479059 30.479059 0 0 1 0-40.779295l120.470588-134.023529a30.479059 30.479059 0 0 1 29.033412-9.396706z"
              fill="currentColor"></path>
          </svg>

          <div className="text">尚未构建</div>
        </div>
      )
    }

    if (status === 'Success') {
      return (
        <div className="svg-box flex-center success flex-direction-column">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="currentColor"></path>
            <path
              d="M481.792 698.197333a42.666667 42.666667 0 0 1-60.330667 0L240.469333 517.205333a42.666667 42.666667 0 0 1 60.330667-60.330666L451.669333 607.573333 723.2 336.213333a42.666667 42.666667 0 0 1 60.330667 60.330667L481.792 698.197333z"
              fill="#ffffff"></path>
          </svg>

          <div className="text">构建成功</div>
        </div>
      )
    }

    if (status === 'Process') {
      return (
        <div className="svg-box flex-center process flex-direction-column theme">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0zM254.08 513.088l-45.44 169.6 80.64-46.592a248.192 248.192 0 0 0 339.072 90.88 246.464 246.464 0 0 0 95.232-99.392l-61.888-16.64c-15.488 24.96-37.12 46.528-64.384 62.272A186.112 186.112 0 0 1 343.04 605.12l80.64-46.592-169.6-45.44z m126.08-216.064c-42.24 24.32-74.24 59.264-95.296 99.392l61.888 16.64c15.552-24.96 37.12-46.528 64.384-62.272a186.112 186.112 0 0 1 254.336 68.096l-80.64 46.592 169.6 45.44 45.44-169.6-80.64 46.592a248.192 248.192 0 0 0-339.136-90.88z"
              fill="currentColor"></path>
          </svg>

          <div className="text">构建中</div>
        </div>
      )
    }

    if (status === 'Queue') {
      return (
        <div className="svg-box flex-center process flex-direction-column theme">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512 29.866667C243.2 29.866667 29.866667 234.666667 29.866667 494.933333s213.333333 460.8 482.133333 460.8 482.133333-204.8 482.133333-465.066666S780.8 29.866667 512 29.866667zM691.2 640v21.333333h-42.666667V640c0-64-34.133333-115.2-102.4-132.266667h-8.533333c0-12.8 4.266667-21.333333 8.533333-21.333333 64-12.8 102.4-68.266667 102.4-128v-38.4H375.466667v34.133333c0 59.733333 34.133333 110.933333 93.866666 136.533334 4.266667 0 4.266667 4.266667 4.266667 4.266666s4.266667 4.266667 4.266667 8.533334c4.266667 0 4.266667 8.533333 0 12.8v4.266666h-4.266667c-64 17.066667-102.4 68.266667-102.4 132.266667v21.333333h345.6c21.333333 0 34.133333 12.8 34.133333 29.866667 0 17.066667-12.8 29.866667-34.133333 29.866667H298.666667c-21.333333 0-34.133333-12.8-34.133334-29.866667 0-17.066667 12.8-29.866667 34.133334-29.866667h29.866666v-21.333333c0-64 34.133333-119.466667 89.6-145.066667-55.466667-34.133333-89.6-85.333333-89.6-149.333333v-38.4H298.666667c-21.333333 0-34.133333-12.8-34.133334-29.866667s17.066667-29.866667 34.133334-29.866666h418.133333c21.333333 0 34.133333 12.8 34.133333 29.866666s-12.8 29.866667-34.133333 29.866667H682.666667v25.6c0 59.733333-34.133333 119.466667-85.333334 149.333333 59.733333 25.6 93.866667 85.333333 93.866667 145.066667z m-183.466667-98.133333h8.533334v-4.266667l4.266666 4.266667c4.266667 0 4.266667 4.266667 12.8 8.533333h4.266667c34.133333 12.8 59.733333 38.4 59.733333 81.066667v8.533333h-166.4v-8.533333c0-42.666667 21.333333-68.266667 64-81.066667 8.533333-4.266667 12.8-4.266667 12.8-8.533333z m-25.6-110.933334c-29.866667-4.266667-55.466667-29.866667-68.266666-59.733333h196.266666c-12.8 29.866667-38.4 55.466667-72.533333 59.733333-12.8 0-21.333333 8.533333-29.866667 17.066667 0 0-4.266667-4.266667-4.266666-8.533333l-21.333334-8.533334z"
              fill="currentColor"></path>
          </svg>

          <div className="text">排队中</div>
        </div>
      )
    }

    if (status === 'Failed') {
      return (
        <div className="svg-box flex-center failed flex-direction-column">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 514.4l132-230.2h223.7l-138.6 228 138.6 228H164L32 514.4z m828.3 452.9l-265.4 0.2-111.4-193.9 266.8 6.5L879 546.3l111.4 194-130.1 227z m-3.5-910.8L992 284.8 881.8 479.5l-130.1-233-266.7 8.2L595.2 60l261.6-3.5zM847.1 533L724.9 739.2H464.1l117.8-207.3 265.2 1.1z m-383-247.7l265.1-1.1L847 491.5H586.3L464.1 285.3z m-38.2 0L291.7 512.2l135.3 227 134.2-225.8-135.3-228.1z"
              fill="currentColor"></path>
          </svg>
          <div className="text">构建失败</div>
        </div>
      )
    }

    if (status === 'Stop') {
      return (
        <div className="svg-box flex-center stop flex-direction-column">
          <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M388.8 386.9h248.8v248.8H388.8V386.9z"></path>
            <path fill="currentColor"
              d="M513.2 127.4c51.9 0 102.1 10.1 149.4 30.1 45.7 19.3 86.8 47 122.1 82.3s63 76.3 82.3 122.1c20 47.3 30.1 97.6 30.1 149.4S887 613.4 867 660.7c-19.3 45.7-47 86.8-82.3 122.1s-76.3 63-122.1 82.3c-47.3 20-97.6 30.1-149.4 30.1S411 885.1 363.7 865.1c-45.7-19.3-86.8-47-122.1-82.3s-63-76.3-82.3-122.1c-20-47.3-30.1-97.6-30.1-149.4s10.1-102.1 30.1-149.4c19.3-45.7 47-86.8 82.3-122.1s76.3-63 122.1-82.3c47.3-20 97.6-30.1 149.5-30.1m0-64c-247.4 0-447.9 200.5-447.9 447.9s200.5 447.9 447.9 447.9 447.9-200.5 447.9-447.9S760.5 63.4 513.2 63.4z"></path>
          </svg>
          <div className="text">中止构建</div>
        </div>
      )
    }
  }

  const getTagHtml = (tag: string = '') => {
    let tagObj = pipelineStore.TAGS.find((t: {[K: string]: any} = {}) => t.value === tag) || {}
    if (!Utils.isObjectNull(tagObj)) {
      return (
        <Tag color={tagObj.color || ''}>{tagObj.label || ''}</Tag>
      )
    }

    return <div className="tag"></div>
  }

  // 获取最近运行
  const getLateRunHtml = () => {
    let detailInfo = pipelineStore.detailInfo || {}
    let basic = detailInfo.basic || {}
    let run = detailInfo.run || {}
    let current = run.current || {}
    let duration = current.duration || 0
    let durationStr = '-'
    if (duration > 0) {
      durationStr = `${duration}s`
    }

    return (
      <div className="late-content h100 flex-direction-column">
        <div className="buttons flex-jsc-between">
          <div className="buttons-left">
            <Button
              type="primary"
              className="page-margin-right"
              onClick={() => {
                pipelineStore.showRunDialog = true
                pipelineStore.selectItem = pipelineStore.detailInfo || {}
                pipelineStore.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
                pipelineStore.isNeedSelectedLastSelected(pipelineStore.detailInfo?.run || {}, pipelineStore.runDialogProps)
                pipelineStore.onSetRadioRunProps(pipelineStore.detailInfo || {}, pipelineStore.runDialogDefaultProps)
                setRunReadonly(false)
              }}
            >
              运行
            </Button>
            <Button>错误阶段重试</Button>
          </div>

          <div className="buttons-right">
            <Button
              className="page-margin-right"
              onClick={() => {
                pipelineStore.setAddForm(pipelineStore.detailInfo || {})
                navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.ADD_URL}`)
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="温馨提示"
              description="是否删除该条记录?"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await pipelineStore.onDeletePipeline(pipelineStore.detailInfo?.id || '', pipelineStore.detailInfo?.serverId || '', () => {
                  navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.URL}`)
                })
              }}
            >
              <Button danger>删除</Button>
            </Popconfirm>

          </div>
        </div>

        {/* 运行状态 */}
        <div className="run-status page-margin-top border flex">
          <div className="status flex-direction-column status-step status-step-item  flex-align-center">
            {getStatus(detailInfo.status || 'No')}
          </div>

          <div className="status-step flex-align-center">
            <div className="run-time status-step-item flex-direction-column flex-center">
              <div className="name">执行时间</div>
              <div className="text">{current.startTime || '-'}</div>
            </div>

            <div className="exec-time status-step-item flex-direction-column flex-center">
              <div className="name">运行时长</div>
              <div className="text">{durationStr}</div>
            </div>
          </div>

          <div className="status-step flex-align-center">
            <div className="run-git status-step-item flex-direction-column flex-center">
              <div className="name">代码仓库</div>
              <div className="text">{run.projectName || '-'}</div>
            </div>

            <div className="run-branch status-step-item flex-direction-column flex-center">
              <div className="name">代码分支</div>
              <div className="text">{run.branch || '-'}</div>
            </div>
          </div>

          <div className="status-step flex-align-center">
            <div className="run-time status-step-item flex-direction-column flex-center">
              <div className="name">流水线名称</div>
              <div className="text">{basic.name || '-'}</div>
            </div>

            <div className="run-tag status-step-item flex-direction-column flex-center">
              <div className="name">标签</div>
              <div className="text">{getTagHtml(basic.tag || '')}</div>
            </div>
          </div>
        </div>

        {/* 结果 */}
        <div className="result-tabs flex-1">
          <Tabs
            defaultActiveKey="0"
            items={RESULT_TABS}
            onChange={() => {

            }}
          />
        </div>
      </div>
    )
  }

  // 构建过程
  const getBuildProcessHtml = () => {
    let detailInfo = pipelineStore.detailInfo || {}
    let run = detailInfo.run || {}
    let current = run.current || {}
    return (
      <div className="result-build-process page-padding h100">
        <div className="logger flex-jsc-end">
          <p className="theme cursor-pointer" onClick={() => setOpen(true)}>查看日志</p>
        </div>
        <PipelineProcess
          currentStep={current.step}
          processList={current.steps || []}
          currentStepStatus={current.status}
          isRun={true}
        />
      </div>
    )
  }

  // 构建快照
  const getBuildSnapshotHtml = () => {
    let detailInfo = pipelineStore.detailInfo || {}
    let run = detailInfo.run || {}
    let current = run.current || {}
    let snapshot = current.runnable || {}
    let variables = snapshot.variables || []
    let selectedVariables = snapshot.selectedVariables || []
    if (Utils.isObjectNull(snapshot)) {
     return (
       <div className="result-build-snapshot h100">
         <div className="no-data-box">
           <NoData />
         </div>
       </div>
     )
    }

    return (
      <div className="result-build-snapshot h100">
        <div className="build-item">
          <p className="font-bold title flex-align-center">运行属性</p>
          <MTable
            dataSource={getRunProps(snapshot)}
            columns={getColumns()}
          />
        </div>

        <div className="build-item page-margin-top">
          <p className="font-bold title flex-align-center">启动变量</p>
          <MTable
            dataSource={getRunVariables(variables, selectedVariables)}
            columns={getColumns()}
          />
        </div>
      </div>
    )
  }

  const getRunVariables = (variables: Array<{[K: string]: any}> = [], selectedVariables: Array<{[K: string]: any}> = []) => {
    if (variables.length === 0 || selectedVariables.length === 0) {
      return []
    }

    let list: Array<{[K: string]: any}> = []
    selectedVariables.forEach((item) => {
      let selectedItem = variables.find((s) => s.id === item.id) || {}
      if (!Utils.isObjectNull(selectedItem)) {
        list.push({
          name: selectedItem.name,
          value: item.value || '',
          genre: selectedItem.genre,
          desc: selectedItem.desc || ''
        })
      }
    })

    console.log('variables list:', list)
    return list
  }

  const getColumns = () => {
    let columns: Array<{[K: string]: any}> = pipelineStore.getAddVariableCommonColumns() || []
    return columns.map(column => {
      let col: {[K: string]: any} = {
        ...column,
        needTooltip: false,
      }

      if (column.render) {
        col.render = column.render
      }

      return col
    })
  }

  const getRunProps = (runnable: {[K: string]: any} = {}) => {
    let list: Array<{[K: string]: any}> = []
    let h5 = pipelineStore.TAGS[pipelineStore.TAGS.length - 1].value
    let isH5 = runnable.tag === h5

    for (let item of pipelineStore.DIALOG_PROPS_LIST) {
      let owner = item.owner
      if (isH5 && Object.prototype.hasOwnProperty.call(runnable, item.value)) {
        if (owner === 'all' || owner === h5) {
          let value = runnable[item.value]
          if (item.value === pipelineStore.DIALOG_PROPS_LIST[2].value) {
            if (value.length === 0) {
              continue
            }
          }

          list.push({
            name: item.label,
            value: runnable[item.value],
            genre: item.type,
            desc: item.desc || ''
          })
        }
      }
    }

    return list
  }

  const RESULT_TABS: Array<any> = [
    {
      key: '1',
      label: '构建过程',
      children: getBuildProcessHtml(),
    },
    {
      key: '2',
      label: '构建快照',
      children: getBuildSnapshotHtml(),
    },
  ]

  // 获取运行历史
  const getRunHistoryHtml = () => {
    let detailInfo = pipelineStore.detailInfo || {}
    let run = detailInfo.run || {}
    let historyList = run.historyList || []
    if (historyList.length === 0) {
      return (
        <div className="history-content h100">
          <div className="no-data-box">
            <NoData />
          </div>
        </div>
      )
    }

    return (
      <div className="history-content h100">
        <MTable
          dataSource={historyList}
          actions={[
            {
              render: (record: {[K: string]: any} = {}) => {
                return (
                  <Space size="middle">
                    <a
                      onClick={() => {
                        pipelineStore.showRunDialog = true
                        pipelineStore.selectItem = record || {}
                        pipelineStore.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
                        pipelineStore.runDialogProps.value = '1'
                        pipelineStore.runDialogProps.remark = record.current?.runnable?.remark || ''
                        pipelineStore.onSetRadioRunProps(pipelineStore.selectItem || {}, pipelineStore.runDialogDefaultProps)
                        setRunReadonly(true)
                      }}
                    >
                      重试
                    </a>
                  </Space>
                )
              }
            },
          ]}
          columns={
            [
              {
                title: '运行记录',
                dataIndex: 'order',
                key: 'order',
                width: '10%',
                needTooltip: false,
                render: (record: {[K: string]: any} = {}) => {
                  let current = record.current || {}
                  let order = current.order || ''
                  return (<span>#{order}</span>)
                }
              },
              {
                title: '运行状态',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                needTooltip: false,
                render: (record: {[K: string]: any} = {}) => {
                  let current = record.current || {}
                  let status = pipelineStore.RUN_STATUS.find((status: {[K: string]: any} = {}) => status.value.toLowerCase() === (current.status || '').toLowerCase()) || {}
                  if (!Utils.isObjectNull(status)) {
                    return (
                      <Tag color={status.color || ''}>{status.label || ''}</Tag>
                    )
                  }
                }
              },
              {
                title: '开始时间',
                key: 'startTime',
                needTooltip: false,
                dataIndex: 'startTime',
                width: '20%',
                render: (record: {[K: string]: any} = {}) => {
                  let current = record.current || {}
                  return (<span>{current.startTime || '-'}</span>)
                }
              },
              {
                title: '持续时间',
                dataIndex: 'duration',
                key: 'duration',
                needTooltip: false,
                width: '20%',
                render: (record: {[K: string]: any} = {}) => {
                  let current = record.current || {}
                  let duration = current.duration || 0
                  if (duration === 0) {
                    return (<span>-</span>)
                  }

                  return (<span>{duration}秒</span>)
                }
              },
              {
                title: '运行备注',
                dataIndex: 'desc',
                key: 'desc',
                needTooltip: false,
                width: '20%',
                render: (record: {[K: string]: any} = {}) => {
                  let current = record.current || {}
                  let runnable = current.runnable || {}
                  let remark = runnable.remark || ''
                  if (Utils.isBlank(remark)) {
                    return (<span>-</span>)
                  }

                  return (<span>{remark}</span>)
                }
              },
              {
                title: '操作',
                dataIndex: 'actions',
                key: 'actions',
                width: '20%',
              }
            ]
          }
        />
      </div>
    )
  }

  const RUN_TABS: Array<any> = [
    {
      key: '0',
      label: '最近运行',
      children: getLateRunHtml(),
    },
    {
      key: '1',
      label: '运行历史',
      children: getRunHistoryHtml(),
    }
  ]


  const getBreadcrumb = () => {
    let menuList = Utils.deepCopy(homeStore.menuList || [])
    let detailInfo = pipelineStore.detailInfo || {}
    let basic = detailInfo.basic || {}
    menuList.push({
      key: 'pipeline-detail',
      name: basic.name,
      icon: (
        <svg
          key="pipeline-add-svg"
          className="svg-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M754.753851 475.715769a29.759795 29.759795 0 0 0-29.759795 29.759796v187.518711H545.731288a29.759795 29.759795 0 0 0-29.759795 29.823795v0.063999c0 16.447887 13.311908 29.759795 29.759795 29.759796h179.262768v185.470724c0 16.447887 13.311908 29.759795 29.759795 29.759796h0.127999a29.759795 29.759795 0 0 0 29.759796-29.759796V752.641866h163.006879a29.759795 29.759795 0 0 0 29.759795-29.759796v-0.127999a29.759795 29.759795 0 0 0-29.759795-29.759795H784.641646v-187.518711a29.759795 29.759795 0 0 0-29.887795-29.759796z"
            fill="currentColor"
          ></path>
          <path
            d="M393.412335 662.594485c18.047876 0 30.079793-12.031917 30.079794-30.079794 0-18.111875-12.031917-30.143793-30.079794-30.143792H92.230406V361.412555h783.098616c0 18.111875 12.031917 30.079793 30.079793 30.079793s30.079793-11.967918 30.079794-30.079793V150.598005A149.118975 149.118975 0 0 0 785.025643 0.00704H182.597785A149.118975 149.118975 0 0 0 32.00682 150.598005v662.587444a149.118975 149.118975 0 0 0 150.590965 150.590965h210.81455c18.047876 0 30.079793-12.031917 30.079794-30.079793 0-18.111875-12.031917-30.143793-30.079794-30.143793H182.597785c-48.191669 0-90.367379-42.17571-90.367379-90.367379v-150.590964h301.181929z m-301.181929-511.99648C92.230406 102.406336 134.406116 60.230626 182.597785 60.230626h602.363858c48.191669 0 90.367379 42.23971 90.367379 90.367379v150.590964H92.166406V150.598005z"
            fill="currentColor"
          ></path>
        </svg>
      )
    })
    return menuList
  }

  const render = () => {
    return (
      <div className="pipeline-detail-page overflow page page-padding page-white flex-direction-column wh100">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb
            items={getBreadcrumb()}
            activeIndexes={homeStore.activeIndexes}
            onChange={(activeIndexes: Array<number> = []) => {
              pipelineStore.onResetAddConfig()
              homeStore.setActiveIndexes(activeIndexes)
            }}
          />
        </div>

        <div className="content-box flex-1">
          <Tabs
            defaultActiveKey="0"
            items={RUN_TABS}
            activeKey={runTabIndex}
            onChange={(activeKey: string = '') => {
              setRunTabIndex(activeKey)
            }}
          />
        </div>

        <RunDialog
          isReadonly={runReadonly}
          onRun={() => {
            setRunTabIndex('0')
          }}
        />

        {/* 日志 */}
        <Drawer className="logger-drawer" title="日志" onClose={() => setOpen(false)} open={open}>
          {
            pipelineStore.loggerList.length > 0 ? pipelineStore.loggerList.map((log: string = '', index: number) => {
              return (
                <p key={index} >
                  <Ansi>{log || ''}</Ansi>
                </p>
              )
            }) : (<p>暂无日志</p>)
          }
        </Drawer>
        <Loading show={pipelineStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(PipelineDetail)

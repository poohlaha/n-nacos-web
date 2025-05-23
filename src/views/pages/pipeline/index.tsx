/**
 * 流水线
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'
import { Tag, Button, Select, Input, Tooltip, Table, Space, Popconfirm } from 'antd'
import { PlusOutlined, PlayCircleOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons'
import RunDialog from '@pages/pipeline/run'
import PipelineBatchRunDialog from './batch'
import Page from '@views/modules/page'

const Pipeline = (): ReactElement => {
  const { pipelineStore, serverStore } = useStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [showBatchRunDialog, setShowBatchRunDialog] = useState(false)
  const [batchRunDatasource, setBatchRunDatasource] = useState<Array<{ [K: string]: any }>>([])
  const [queryForm, setQueryForm] = useState<{ [K: string]: any }>({ name: '', status: '' })
  const navigate = useNavigate()

  useMount(async () => {
    await onRefresh()

    // 设置 table 最大高度
    const node = document.querySelector('.pipeline-page')
    const titleNode = document.querySelector('.page-title')
    const tagsNode = document.querySelector('.tags')
    const actionsNode = document.querySelector('.actions')
    const tableHeaderNode = document.querySelector('.ant-table-header')
    if (!node) return

    const rect = node.getBoundingClientRect()
    let height = rect.height || 0

    if (titleNode) {
      let titleRect = titleNode.getBoundingClientRect()
      height -= titleRect.height
    }

    if (tagsNode) {
      let tagsRect = tagsNode.getBoundingClientRect()
      height -= tagsRect.height
    }

    if (actionsNode) {
      let actionsRect = actionsNode.getBoundingClientRect()
      height -= actionsRect.height
    }

    if (tableHeaderNode) {
      let tableHeaderRect = tableHeaderNode.getBoundingClientRect()
      height -= tableHeaderRect.height
    }

    if (height > 0) {
      let tableBodyNode = document.querySelector('.ant-table-body')
      if (tableBodyNode) {
        const tableBodyDom = tableBodyNode as HTMLDivElement
        tableBodyDom.style.maxHeight = `${height}px`
      }
    }
  })

  const onRefresh = async (form: { [K: string]: any } = {}) => {
    let query = form || {}
    if (Utils.isObjectNull(query)) {
      query = queryForm
    }
    await pipelineStore.getList('', query)
  }

  const getTagHtml = (t: string = '') => {
    let tag = pipelineStore.TAGS.find((tag: { [K: string]: any } = {}) => tag.value === t) || {}
    if (!Utils.isObjectNull(tag)) {
      return (
        <Tag className="m-ant-tag" color={tag.color || ''}>
          {tag.label || ''}
        </Tag>
      )
    }

    return <div className="tag"></div>
  }

  const getStepClassName = (index: number = 0, status: string = 'No', i: number) => {
    // index 从 1 开始

    if (index === 0) {
      return 'step-gray'
    }

    if (i + 1 > index) {
      if (status === pipelineStore.RUN_STATUS[4].value || status === pipelineStore.RUN_STATUS[5].value) {
        return 'step-failed'
      }

      return 'step-gray'
    }

    // 进行中
    if (i + 1 === index) {
      if (status === pipelineStore.RUN_STATUS[0].value) {
        return 'step-gray'
      }

      if (status === pipelineStore.RUN_STATUS[1].value) {
        return 'step-process'
      }

      if (status === pipelineStore.RUN_STATUS[2].value) {
        return 'step-process'
      }

      if (status === pipelineStore.RUN_STATUS[3].value) {
        return 'step-success'
      }

      if (status === pipelineStore.RUN_STATUS[4].value) {
        return 'step-failed'
      }

      if (status === pipelineStore.RUN_STATUS[5].value) {
        return 'step-stop'
      }

      return ''
    }

    if (i + 1 < index) {
      return 'step-success'
    }

    return 'step-gray'
  }

  const COLUMNS: Array<{ [K: string]: any }> = [
    {
      title: '流水线名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (_: any, record: { [K: string]: any } = {}) => {
        let basic = record.basic || {}
        return (
          <div
            className="flex-align-center pipeline-table-name"
            onClick={() => {
              serverStore.selectedServer = record || {}
              navigate(
                `${RouterUrls.PIPELINE.URL}${RouterUrls.PIPELINE.DETAIL.URL}?id=${Utils.encrypt(
                  encodeURIComponent(record.id || '')
                )}&serverId=${Utils.encrypt(encodeURIComponent(record.serverId || ''))}`
              )
            }}
          >
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M113.777778 0h796.444444a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m316.434963 266.94163c-13.842963-54.385778-65.592889-89.865481-120.737185-82.792297-55.182222 7.073185-96.502519 54.499556-96.44563 110.648889 0.170667 56.016593 41.453037 103.196444 96.483555 110.250667 55.030519 7.054222 106.68563-28.197926 120.69926-82.394074h306.896592c15.227259 0 27.572148 12.458667 27.572148 27.856592v110.08c0 7.395556-2.901333 14.468741-8.078222 19.683556-5.176889 5.233778-12.174222 8.154074-19.493926 8.154074h-82.640592v55.713185h82.640592a82.337185 82.337185 0 0 0 58.500741-24.462222 83.986963 83.986963 0 0 0 24.234667-59.088593v-110.08c0-46.155852-37.034667-83.569778-82.735408-83.569777H430.212741z m-134.428445 502.272h304.355556c7.68 58.17837 58.747259 100.370963 116.736 96.464592 57.988741-3.90637 103.025778-52.584296 102.968889-111.293629-0.018963-53.475556-37.69837-99.422815-89.732741-109.416297-52.053333-9.974519-103.784296 18.773333-123.259259 68.532148H295.784296c-7.319704 0-14.336-2.939259-19.512889-8.154074a27.989333 27.989333 0 0 1-8.078222-19.702518v-113.645037c0-7.395556 2.920296-14.468741 8.078222-19.683556 5.176889-5.233778 12.193185-8.154074 19.512889-8.154074h358.684445v-55.713185H295.784296a82.337185 82.337185 0 0 0-58.519703 24.462222 83.986963 83.986963 0 0 0-24.234667 59.088593v113.645037c0 46.155852 37.05363 83.569778 82.75437 83.569778z m82.754371-474.415408c0 30.757926-24.708741 55.713185-55.182223 55.713185-30.454519 0-55.163259-24.955259-55.163259-55.713185 0-30.776889 24.708741-55.713185 55.182222-55.713185 30.454519 0 55.163259 24.936296 55.16326 55.713185z m386.142814 459.586371c0 30.776889-24.689778 55.713185-55.163259 55.713185-30.454519 0-55.163259-24.936296-55.163259-55.713185 0-30.757926 24.708741-55.694222 55.182222-55.694223 30.454519 0 55.144296 24.936296 55.144296 55.694223z"
                fill="currentColor"
              ></path>
            </svg>
            <div>
              <p>{basic.name || ''}</p>
            </div>
          </div>
        )
      }
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      width: 200,
      render: (_: any, record: { [K: string]: any } = {}) => {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: record.basic?.desc || '' }}
            className="color-desc"
            style={{ whiteSpace: 'pre-line' }}
          ></div>
        )
      }
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (_: any, record: { [K: string]: any } = {}) => {
        let status =
          pipelineStore.RUN_STATUS.find(
            (status: { [K: string]: any } = {}) => status.value.toLowerCase() === (record.status || '').toLowerCase()
          ) || {}
        if (!Utils.isObjectNull(status)) {
          return (
            <Tag className="m-ant-tag" color={status.color || ''}>
              {status.label || ''}
            </Tag>
          )
        }
      }
    },
    {
      title: '运行阶段',
      dataIndex: 'step',
      key: 'step',
      width: 300,
      render: (_: any, record: { [K: string]: any } = {}) => {
        let runtime = record.runtime || {}
        let stages = []
        let stageIndex = 0
        let status = record.status
        if (Utils.isObjectNull(runtime)) {
          let processConfig = record.processConfig || {}
          stages = processConfig.stages || []
        } else {
          stages = runtime.stages || []
          let stage = runtime.stage || {}
          stageIndex = stage.stageIndex
          status = runtime.status
        }

        stages = stages.sort((stage1: { [K: string]: any } = {}, stage2: { [K: string]: any } = {}) => {
          return stage1.order - stage2.order
        })

        let arr: Array<React.ReactNode> = []
        for (let i = 0; i < stages.length; i++) {
          let s = stages[i] || {}
          if (Utils.isObjectNull(s)) {
            return <div className="step-box" />
          }

          let className = getStepClassName(stageIndex, status, i)
          let label = (s.groups || []).map((ss: { [K: string]: any }) => ss.label).join(',')
          arr.push(
            <Tooltip
              key={i}
              rootClassName="m-ant-tooltip"
              className="tooltip-question"
              placement="top"
              title={label || ''}
            >
              <div className="step-box">
                <div className={`step ${className || ''}`} />
              </div>
            </Tooltip>
          )
        }

        return <div className="steps flex-wrap">{arr}</div>
      }
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      width: 150,
      render: (_: any, record: { [K: string]: any } = {}) => {
        return getTagHtml(record.tag || '')
      }
    },
    {
      title: '上次运行时间',
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
      width: 150,
      render: (_: any, record: { [K: string]: any } = {}) => {
        return <p>{record.lastRunTime || '-'}</p>
      }
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 150,
      render: (_: any, record: { [K: string]: any } = {}) => {
        return <p>{record.runtime?.duration || '-'}</p>
      }
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_: any, record: { [K: string]: any } = {}) => {
        let buttonDisabled = pipelineStore.onDisabledRunButton(record.status || '')
        return (
          <Space size="middle">
            <a
              className={buttonDisabled ? 'disabled' : ''}
              onClick={async () => {
                await pipelineStore.onRunDialog(record.id || '', record.serverId || '', () => {
                  pipelineStore.showRunDialog = true
                  onRefresh()
                })
              }}
            >
              运行
            </a>

            <a
              onClick={() => {
                serverStore.selectedServer = record || {}
                navigate(
                  `${RouterUrls.PIPELINE.URL}${RouterUrls.PIPELINE.DETAIL.URL}?id=${Utils.encrypt(
                    encodeURIComponent(record.id || '')
                  )}&serverId=${Utils.encrypt(encodeURIComponent(record.serverId || ''))}`
                )
              }}
            >
              修改
            </a>

            {buttonDisabled ? (
              <a className={`delete ${buttonDisabled ? 'disabled' : ''}`}>删除</a>
            ) : (
              <Popconfirm
                rootClassName="m-ant-popover"
                title="温馨提示"
                description="是否删除该条记录?"
                okText="确定"
                cancelText="取消"
                onConfirm={async () => {
                  if (pipelineStore.onDisabledRunButton(record.status || '')) return
                  await pipelineStore.onDeletePipeline(record.id || '', record.serverId || '')
                }}
              >
                <a className="delete">删除</a>
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  const render = () => {
    return (
      <Page
        className="pipeline-page overflow"
        title={{
          label: RouterUrls.PIPELINE.LIST.NAME
        }}
      >
        <div className="page-wrapper content-box flex-1 flex-direction-column">
          {/* tags */}
          <div className="tags flex-align-center">
            <p className="label page-margin-right">标签</p>
            {pipelineStore.TAGS.length > 0 &&
              pipelineStore.TAGS.map((item: { [K: string]: any } = {}, index: number = 0) => {
                return (
                  <Tag className="m-ant-tag" color={item.color || 'default'} key={index}>
                    {item.label || ''}
                  </Tag>
                )
              })}
          </div>

          {/* buttons */}
          <div className="actions flex-wrap pt-4 pb-4">
            <div className="actions-left flex-1 flex-align-center page-margin-right">
              <Button
                className="mr-2 m-ant-button"
                type="primary"
                disabled={selectedRowKeys.length === 0}
                icon={<PlayCircleOutlined />}
                onClick={() => {
                  let list = getSelectedItemList()
                  setBatchRunDatasource(list)
                  setShowBatchRunDialog(true)
                }}
              >
                运行
              </Button>

              <Button
                className="m-ant-button"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  pipelineStore.onResetAddConfig()
                  navigate(`${RouterUrls.PIPELINE.URL}${RouterUrls.PIPELINE.ADD.URL}`)
                }}
              >
                新增
              </Button>
            </div>

            <div className="actions-right flex-align-center">
              {/* 状态 */}
              <Select
                className="mr-2 m-ant-select"
                rootClassName="m-ant-select-dropdown"
                placeholder="请选择运行状态"
                style={{ width: 180 }}
                allowClear
                value={Utils.isBlank(queryForm.status || '') ? undefined : queryForm.status || undefined}
                onChange={(value: string = '') => {
                  setQueryForm({
                    ...queryForm,
                    status: value || ''
                  })
                }}
                options={pipelineStore.RUN_STATUS || []}
              />

              <Input
                className="mr-2 m-ant-input"
                style={{ width: 180 }}
                placeholder="请输入流水线名称"
                maxLength={100}
                value={queryForm.name || ''}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQueryForm({
                    ...queryForm,
                    name: e.target.value || ''
                  })
                }}
              />

              {/* search */}
              <Tooltip title="查询" rootClassName="m-ant-tooltip">
                <Button
                  className="mr-2 m-ant-button"
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  onClick={async () => {
                    console.log('queryForm', queryForm)
                    if (Utils.isObjectNull(queryForm || {})) return
                    await onRefresh()
                  }}
                />
              </Tooltip>

              {/* 刷新 */}
              <Tooltip title="刷新" rootClassName="m-ant-tooltip">
                <Button
                  className="mr-2 m-ant-button"
                  shape="circle"
                  icon={<RedoOutlined />}
                  onClick={async () => {
                    await onRefresh()
                  }}
                />
              </Tooltip>

              {/* 重置 */}
              <Button
                className="m-ant-button"
                type="default"
                onClick={async () => {
                  setQueryForm({ name: '', status: '' })
                  await onRefresh({ name: '', status: '' })
                }}
              >
                重置
              </Button>
            </div>
          </div>

          <div className="list flex-1">
            <Table
              className="m-ant-table wh100"
              rowKey="id"
              columns={COLUMNS || []}
              dataSource={pipelineStore.list || []}
              scroll={{ x: 1500, y: 300 }}
              rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: any[]) => {
                  console.log('selectedRowKeys changed: ', newSelectedRowKeys)
                  setSelectedRowKeys(newSelectedRowKeys)
                }
              }}
            />
          </div>
        </div>

        <RunDialog />
        <PipelineBatchRunDialog
          open={showBatchRunDialog}
          selectedRowKeys={selectedRowKeys}
          getTagHtml={getTagHtml}
          datasource={batchRunDatasource}
          onCancel={() => {
            setShowBatchRunDialog(false)
            setSelectedRowKeys([])
          }}
          onOk={async (list: Array<{ [K: string]: any }> = []) => {
            console.log('batch run pipeline list:', list)
            if (list.length === 0) return
            setShowBatchRunDialog(false)
            setSelectedRowKeys([])
            await pipelineStore.onBatchRun(list || [])
          }}
        />
        <Loading show={pipelineStore.loading} />
      </Page>
    )
  }

  const getSelectedItemList = () => {
    if (selectedRowKeys.length === 0 || pipelineStore.list.length === 0) return []

    let selectedItemList: Array<{ [K: string]: any }> = selectedRowKeys.map(s => {
      let item = pipelineStore.list.find(l => l.id === s) || {}
      let runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
      pipelineStore.isNeedSelectedLastSelected(item || {}, runDialogProps)
      pipelineStore.onSetRadioRunProps(item || {}, runDialogProps)
      return { ...item, runDialogProps }
    })

    return selectedItemList
  }

  return render()
}

export default observer(Pipeline)

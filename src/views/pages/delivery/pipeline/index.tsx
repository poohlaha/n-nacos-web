/**
 * 流水线
 */
import React, { ReactElement, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'
import MBreadcrumb from '@views/modules/breadcrumb'
import { Tag, Button, Select, Input, Tooltip, Table, Space, Popconfirm, Modal } from 'antd'
import { PlusOutlined, PlayCircleOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons'
import RunDialog from '@pages/delivery/pipeline/run'
import PipelineBatchRunDialog from './batch'

const Pipeline: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const { pipelineStore, homeStore } = useStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [showBatchRunDialog, setShowBatchRunDialog] = useState(false)
  const [batchRunDatasource, setBatchRunDatasource] = useState<Array<{ [K: string]: any }>>([])
  const [queryForm, setQueryForm] = useState<{ [K: string]: any }>({ name: '', status: '' })
  const navigate = useNavigate()

  useMount(async () => {
    await onRefresh()
  })

  const onRefresh = async (form: { [K: string]: any } = {}) => {
    let query = form || {}
    if (Utils.isObjectNull(query)) {
      query = queryForm
    }
    let serverId = homeStore.getSelectServer().id || ''
    await pipelineStore.getList(serverId, query)
  }

  const getTagHtml = (t: string = '') => {
    let tag = pipelineStore.TAGS.find((tag: { [K: string]: any } = {}) => tag.value === t) || {}
    if (!Utils.isObjectNull(tag)) {
      return <Tag color={tag.color || ''}>{tag.label || ''}</Tag>
    }

    return <div className="tag"></div>
  }

  const tableHeaders: Array<{ [K: string]: any }> = [
    {
      title: '流水线名称',
      dataIndex: 'name',
      key: 'name',
      width: '18%',
      render: (_: any, record: { [K: string]: any } = {}) => {
        return (
          <div
            className="flex-align-center pipeline-table-name"
            onClick={() => {
              navigate(
                `${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.DETAIL_URL}?id=${Utils.encrypt(
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
            <p>{record.name || ''}</p>
          </div>
        )
      },
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: { [K: string]: any } = {}) => {
        let status =
          pipelineStore.RUN_STATUS.find(
            (status: { [K: string]: any } = {}) => status.value.toLowerCase() === (record.status || '').toLowerCase()
          ) || {}
        if (!Utils.isObjectNull(status)) {
          return <Tag color={status.color || ''}>{status.label || ''}</Tag>
        }
      },
    },
    {
      title: '运行阶段',
      dataIndex: 'step',
      key: 'step',
      width: '18%',
      render: (_: any, record: { [K: string]: any } = {}) => {
        let run = record.run || {}
        let current = run.current || {}
        let steps = current.steps || []
        let step = current.step || 0
        let status = current.status || 'No'

        let arr: Array<React.ReactNode> = []
        for (let i = 0; i < steps.length; i++) {
          let s = steps[i] || {}
          if (Utils.isObjectNull(s)) {
            return <div className="step-box" />
          }

          let className = ''
          // 未运行
          if (step === 0 || step < i + 1) {
            className = 'step-gray'
          }

          // 运行到最后一步
          if (step === steps.length - 1) {
            className = 'step-success'
          }

          // 其他运行成功
          if (i + 1 < step) {
            className = 'step-success'
          }

          if (i + 1 === step) {
            if (status === 'No') {
              className = 'step-gray'
            }

            if (status === 'Process') {
              className = 'step-process'
            }

            if (status === 'Success') {
              className = 'step-success'
            }

            if (status === 'Failed') {
              className = 'step-failed'
            }

            if (status === 'Stop') {
              className = 'step-stop'
            }
          }

          arr.push(
            <Tooltip key={s.key} className="tooltip-question" placement="top" title={s.label || ''}>
              <div className="step-box">
                <div className={`step ${className || ''}`} />
              </div>
            </Tooltip>
          )
        }

        return <div className="steps flex-wrap">{arr}</div>
      },
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (_: any, record: { [K: string]: any } = {}) => {
        return getTagHtml(record.tag || '')
      },
    },
    {
      title: '上次运行时间',
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
    },
    {
      title: '耗时',
      dataIndex: 'runTime',
      key: 'runTime',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: { [K: string]: any } = {}) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                pipelineStore.showRunDialog = true
                pipelineStore.selectItem = Utils.deepCopy(record)
                pipelineStore.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
              }}
            >
              运行
            </a>

            <a
              onClick={() => {
                pipelineStore.setAddForm(record)
                navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.ADD_URL}`)
              }}
            >
              修改
            </a>

            <Popconfirm
              title="温馨提示"
              description="是否删除该条记录?"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await pipelineStore.onDeletePipeline(record.id || '', record.serverId || '')
              }}
            >
              <a className="delete">删除</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const render = () => {
    return (
      <div className="pipeline-page overflow page page-padding page-white flex-direction-column wh100">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb
            items={homeStore.menuList}
            activeIndexes={homeStore.activeIndexes}
            onChange={(activeIndexes: Array<number> = []) => homeStore.setActiveIndexes(activeIndexes)}
          />
        </div>

        <div className="content-box">
          {/* tags */}
          <div className="tags flex-align-center">
            <p className="label page-margin-right">标签</p>
            {pipelineStore.TAGS.length > 0 &&
              pipelineStore.TAGS.map((item: { [K: string]: any } = {}, index: number = 0) => {
                return (
                  <Tag color={item.color || 'default'} key={index}>
                    {item.label || ''}
                  </Tag>
                )
              })}
          </div>

          {/* buttons */}
          <div className="actions flex-wrap page-margin-top">
            <div className="actions-left flex-1 flex-align-center page-margin-right">
              <Button
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  pipelineStore.onResetAddConfig()
                  navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.ADD_URL}`)
                }}
              >
                新增
              </Button>
            </div>

            <div className="actions-right flex-align-center">
              {/* 状态 */}
              <Select
                placeholder="请选择运行状态"
                style={{ width: 180 }}
                allowClear
                value={Utils.isBlank(queryForm.status || '') ? undefined : queryForm.status || undefined}
                onChange={(value: string = '') => {
                  setQueryForm({
                    ...queryForm,
                    status: value || '',
                  })
                }}
                options={pipelineStore.RUN_STATUS || []}
              />

              <Input
                style={{ width: 180 }}
                placeholder="请输入流水线名称"
                maxLength={100}
                value={queryForm.name || ''}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setQueryForm({
                    ...queryForm,
                    name: e.target.value || '',
                  })
                }}
              />

              {/* search */}
              <Tooltip title="查询">
                <Button
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
              <Tooltip title="刷新">
                <Button
                  shape="circle"
                  icon={<RedoOutlined />}
                  onClick={async () => {
                    await onRefresh()
                  }}
                />
              </Tooltip>

              {/* 重置 */}
              <Button
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

          <div className="list">
            <Table
              columns={tableHeaders || []}
              dataSource={pipelineStore.list || []}
              rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: any[]) => {
                  console.log('selectedRowKeys changed: ', newSelectedRowKeys)
                  setSelectedRowKeys(newSelectedRowKeys)
                },
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
      </div>
    )
  }

  const getSelectedItemList = () => {
    if (selectedRowKeys.length === 0 || pipelineStore.list.length === 0) return []

    let selectedItemList: Array<{ [K: string]: any }> = selectedRowKeys.map(s => {
      let item = pipelineStore.list.find(l => l.id === s) || {}
      let runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
      pipelineStore.isNeedSelectedLastSelected(item.run || {}, runDialogProps)
      pipelineStore.onSetRadioRunProps(item || {}, runDialogProps)
      return { ...item, runDialogProps }
    })

    return selectedItemList
  }

  return render()
}

export default observer(Pipeline)

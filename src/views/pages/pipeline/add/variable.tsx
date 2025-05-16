/**
 * 流水线: 变量
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { Input, Modal, Popconfirm, Select } from 'antd'
import MTable from '@views/modules/table'

const PipelineVariable = (): ReactElement => {
  const { pipelineStore } = useStore()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [form, setForm] = useState<{ [K: string]: any }>({})

  useMount(async () => {})

  const commonColumns = pipelineStore.getAddVariableCommonColumns() || []

  const columns: any = [
    commonColumns[0], // 变量名
    commonColumns[1], // 变量类型
    commonColumns[2], // 变量值
    {
      title: '是否禁用',
      dataIndex: 'disabled',
      key: 'disabled',
      width: '10%',
      render: (record: { [K: string]: any } = {}) => {
        let disabled = record.disabled || ''
        if (disabled === pipelineStore.SELECT_OPTIONS[1].value) {
          return <span>{pipelineStore.SELECT_OPTIONS[1].label || ''}</span>
        }

        return <span>{pipelineStore.SELECT_OPTIONS[0].label || ''}</span>
      }
    },
    {
      title: '是否必填',
      dataIndex: 'require',
      key: 'require',
      width: '10%',
      render: (record: { [K: string]: any } = {}) => {
        let require = record.require || ''
        if (require === pipelineStore.SELECT_OPTIONS[1].value) {
          return <span>{pipelineStore.SELECT_OPTIONS[1].label || ''}</span>
        }

        return <span>{pipelineStore.SELECT_OPTIONS[0].label || ''}</span>
      }
    },
    commonColumns[3], // 描述
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: '15%'
    }
  ]

  const render = () => {
    return (
      <div className="pipeline-add-variable flex-direction-column wh100">
        <div className="form">
          <div className="form-item">
            <div className="label page-margin-bottom flex-align-center">
              <p className="font-bold">启动变量</p>
            </div>
            <div className="table flex-1 flex-direction-column">
              <MTable
                dataSource={pipelineStore.addVariableList || []}
                columns={columns}
                actions={[
                  {
                    render: (item: { [K: string]: any }) => {
                      // console.log('render action item:', item)
                      return (
                        <a
                          key="update"
                          onClick={() => {
                            let f = Utils.deepCopy(item || {})
                            if (item.genre === pipelineStore.VARIABLE_OPTIONS[1].value) {
                              f.select = item.value || ''
                            } else if (item.genre === pipelineStore.VARIABLE_OPTIONS[2].value) {
                              f.input = item.value || ''
                            } else {
                              f.str = item.value || ''
                            }
                            setShowAddDialog(true)
                            setForm(f)
                          }}
                        >
                          修改
                        </a>
                      )
                    }
                  },
                  {
                    render: (item: { [K: string]: any }) => {
                      // console.log('render action item:', item)
                      return (
                        <Popconfirm
                          title="友情提醒"
                          description="确定删除该条记录?"
                          placement="top"
                          okText="确定"
                          cancelText="取消"
                          onConfirm={() => pipelineStore.onRemoveVariable(item)}
                        >
                          <a key="delete">删除</a>
                        </Popconfirm>
                      )
                    }
                  }
                ]}
              />
              <p
                className="add-row page-margin-top cursor-pointer page-margin-bottom"
                onClick={() => {
                  setForm(Utils.deepCopy(pipelineStore.addVariableDefaultForm))
                  setShowAddDialog(true)
                }}
              >
                添加一行
              </p>
            </div>
          </div>
        </div>

        <Modal
          title="添加/编辑启动变量"
          open={showAddDialog}
          onOk={async () => {
            let flag = pipelineStore.onAddVariable(form || {})
            if (flag) {
              setShowAddDialog(false)
            }
          }}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            setForm(Utils.deepCopy(pipelineStore.addVariableDefaultForm))
            setShowAddDialog(false)
          }}
          closable={false}
          maskClosable={false}
        >
          <div className="modal-body flex-direction-column page-margin-top">
            <div className="name form-item flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>变量名</p>
                <span className="flex-center">*</span>
              </div>
              <Input
                placeholder="请输入变量名"
                maxLength={20}
                value={form.name}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let f = Utils.deepCopy(form || {})
                  f.name = e.target.value || ''
                  setForm(f)
                }}
              />
            </div>

            <div className="genre form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>变量类型</p>
                <span className="flex-center">*</span>
              </div>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择变量类型"
                value={form.genre}
                onChange={value => {
                  let f = Utils.deepCopy(form || {})
                  f.genre = value || ''
                  setForm(f)
                }}
                options={pipelineStore.VARIABLE_OPTIONS || []}
              />
            </div>

            {(form.genre === pipelineStore.VARIABLE_OPTIONS[0].value ||
              form.genre === pipelineStore.VARIABLE_OPTIONS[2].value) && (
              <div className="str form-item flex-align-center page-margin-top">
                <div className="label page-margin-right flex-align-center">
                  <p>值</p>
                  <span className="flex-center">
                    {form.genre === pipelineStore.VARIABLE_OPTIONS[0].value ? '*' : ''}
                  </span>
                </div>

                <Input
                  placeholder="请输入"
                  maxLength={20}
                  value={form.genre === pipelineStore.VARIABLE_OPTIONS[2].value ? form.input : form.str}
                  allowClear
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target
                    let f = Utils.deepCopy(form || {})
                    if (form.genre === pipelineStore.VARIABLE_OPTIONS[2].value) {
                      f.input = value || ''
                    } else {
                      f.str = value || ''
                    }

                    setForm(f)
                  }}
                />
              </div>
            )}

            {form.genre === pipelineStore.VARIABLE_OPTIONS[1].value && (
              <div className="select form-item flex-align-center page-margin-top">
                <div className="label page-margin-right flex-align-center">
                  <p>值</p>
                  <span className="flex-center">*</span>
                </div>

                <Input.TextArea
                  placeholder="请输入"
                  maxLength={500}
                  value={form.select}
                  allowClear
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    const { value } = e.target
                    let f = Utils.deepCopy(form || {})
                    f.select = value || ''
                    setForm(f)
                  }}
                />
              </div>
            )}

            <div className="disable form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>是否禁用</p>
              </div>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择是否禁用"
                value={form.disabled}
                onChange={(value: string = '') => {
                  let f = Utils.deepCopy(form || {})
                  f.disabled = value || ''
                  setForm(f)
                }}
                options={pipelineStore.SELECT_OPTIONS || []}
              />
            </div>

            <div className="require form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>是否必填</p>
              </div>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择是否必填"
                value={form.require}
                onChange={(value: string = '') => {
                  let f = Utils.deepCopy(form || {})
                  f.require = value || ''
                  setForm(f)
                }}
                options={pipelineStore.SELECT_OPTIONS || []}
              />
            </div>

            <div className="desc form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>描述</p>
              </div>
              <Input.TextArea
                style={{ width: '100%' }}
                placeholder="请输入描述"
                maxLength={500}
                allowClear
                value={form.desc}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const { value } = e.target
                  let f = Utils.deepCopy(form || {})
                  f.desc = value || ''
                  setForm(f)
                }}
              />
            </div>
          </div>
        </Modal>

        <Loading show={pipelineStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(PipelineVariable)

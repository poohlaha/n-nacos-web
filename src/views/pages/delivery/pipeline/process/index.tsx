/**
 * @fileOverview TODO
 * @date 2024-03-11
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Drawer, Button, Input, Select } from 'antd'
import { IPipelineGroupProps, IPipelineStepProps, Pipeline } from '../pipeline'
import Utils from '@utils/utils'

interface IPipelineProcessProps {
  data: Array<Array<any>>
  isRun: boolean
  currentStep?: number
  currentStepStatus?: string
  onUpdateData?: (stepForm: { [K: string]: any }) => void
}

const PipelineProcess = (props: IPipelineProcessProps): ReactElement => {
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(-1) // 0: group 1: step 3: task 4: editor group
  const [groupIndex, setGroupIndex] = useState(-1)
  const [groupChildIndex, setGroupChildIndex] = useState(-1)
  const [stepIndex, setStepIndex] = useState(-1)
  const [inputGroupValue, setInputGroupValue] = useState('')
  const [stepForm, setStepForm] = useState<any>({})

  const onResetForm = () => {
    setInputGroupValue('')
    setStepForm({})
    setOpenIndex(-1)
    setGroupIndex(-1)
    setGroupChildIndex(-1)
    setStepIndex(-1)
  }

  const onUpdateStepForm = (component: { [K: string]: any } = {}) => {
    if (Utils.isObjectNull(stepForm || {})) return

    let form = Utils.deepCopy(stepForm) || {}
    let components = form.components || []
    let newComponents = components.map((comp: { [K: string]: any } = {}) => {
      if (component.name === comp.name) {
        return component
      }

      return comp
    })

    form.components = newComponents || []
    setStepForm(form)
  }

  const getDrawerFooterHtml = () => {
    return (
      <div className="footer flex-jsc-end">
        <Button
          onClick={() => {
            onResetForm()
            setOpen(false)
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          className="page-margin-left"
          onClick={() => {
            props.onUpdateData?.(stepForm)
            onResetForm()
            setOpen(false)
          }}
        >
          确定
        </Button>
      </div>
    )
  }

  const render = () => {
    let components = stepForm.components || []
    return (
      <div className="pipeline-process-page wh100">
        {!props.isRun && (
          <Pipeline
            groups={props.data || []}
            onGroupAdd={(index: number) => {
              console.log('insert group index: ', index)
            }}
            onGroupClick={(groupIndex: number, groupChildIndex: number, group: IPipelineGroupProps) => {
              console.log('on click group:', group)
              onResetForm()
              setGroupIndex(groupIndex)
              setGroupChildIndex(groupChildIndex)
              setInputGroupValue(group.title.label || '')
              setOpenIndex(4)
              setOpen(true)
            }}
            onStepAdd={(groupIndex: number, groupChildIndex: number) => {
              console.log('insert step, group index: ', groupIndex, ' group child index: ', groupChildIndex)
            }}
            onStepClick={(groupIndex: number, groupChildIndex: number, stepIndex: number, step: IPipelineStepProps) => {
              console.log('on click step:', step)
              onResetForm()
              setStepForm(Utils.deepCopy(step))
              setGroupIndex(groupIndex)
              setGroupChildIndex(groupChildIndex)
              setStepIndex(stepIndex)
              setOpenIndex(1)
              setOpen(true)
            }}
            onParallelTaskAdd={(groupIndex: number, defaultText: string = '') => {
              console.log('on add parallel task, groupIndex: ', groupIndex, ' defaultText: ', defaultText)
            }}
            onGroupDelete={(groupIndex: number, groupChildIndex: number, group: IPipelineGroupProps) => {
              console.log('on delete group:', groupIndex, groupChildIndex, group)
              onResetForm()
            }}
            onStepDelete={(
              groupIndex: number,
              groupChildIndex: number,
              stepIndex: number,
              step: IPipelineStepProps
            ) => {
              console.log('on step group:', groupIndex, groupChildIndex, stepIndex, step)
            }}
          />
        )}

        <Drawer
          title={openIndex === 1 ? '步骤设置' : '阶段设置'}
          width={500}
          maskClosable={true}
          onClose={() => {
            onResetForm()
            setOpen(false)
          }}
          open={open}
          footer={getDrawerFooterHtml()}
        >
          <div className="setting-body">
            {(openIndex === 0 || openIndex === 3 || openIndex === 4) && (
              <div className="body-item flex">
                <div className="item-content flex-1 flex-align-center">
                  <p>阶段名称:</p>
                  <Input
                    placeholder="请输入"
                    value={inputGroupValue}
                    onChange={(e: any) => setInputGroupValue(e.target.value || '')}
                  />
                </div>
              </div>
            )}

            {openIndex === 1 && (
              <div className="body-item">
                <div className="item-content flex-1 flex-align-center">
                  <p>任务名称:</p>
                  <Input placeholder="请输入" value={stepForm.label || ''} />
                </div>

                {!Utils.isBlank(stepForm.command) && (
                  <div className="item-content page-margin-top flex-align-center">
                    <p>任务命令:</p>
                    <Input.TextArea placeholder="请输入" value={stepForm.command || ''} />
                  </div>
                )}

                {components.length > 0 &&
                  components.map((component: { [K: string]: any }, index: number) => {
                    return (
                      <div className="item-content page-margin-top flex" key={index}>
                        <p>{component.label || ''}:</p>
                        <div className="item-component flex-1 flex-direction-column">
                          {component.type === 'input' && (
                            <Input
                              placeholder="请输入"
                              allowClear
                              value={component.value || ''}
                              onChange={(e: any) => {
                                let comp = Utils.deepCopy(component) || {}
                                comp.value = e.target.value || ''
                                onUpdateStepForm(comp)
                                // props.onUpdateData?.(stepForm.id, stepIndex, comp)
                              }}
                            />
                          )}

                          {component.type === 'textarea' && (
                            <Input.TextArea
                                placeholder="请输入"
                                value={component.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    let comp = Utils.deepCopy(component) || {}
                                    comp.value = e.target.value || ''
                                    onUpdateStepForm(comp)
                                }}
                            />
                          )}

                          {component.type === 'select' && (
                            <Select
                              style={{ width: '100%' }}
                              placeholder="请选择"
                              allowClear
                              value={component.value || undefined}
                              onChange={(value: string) => {
                                  let comp = Utils.deepCopy(component) || {}
                                  comp.value = value || ''
                                  onUpdateStepForm(comp)
                              }}
                              options={component.options || []}
                            />
                          )}

                            {
                                !Utils.isBlank(component.desc || '') && ( <div className="desc">{component.desc || ''}</div>)
                            }
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </Drawer>
      </div>
    )
  }

  return render()
}

export default observer(PipelineProcess)

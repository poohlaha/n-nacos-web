/**
 * 流水线运行html
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Radio, Select } from 'antd'
import MTable from '@views/modules/table'
import Utils from '@utils/utils'
import { useStore } from '@views/stores'

interface IPipelineRunDialogProps {
  isReadonly?: boolean // 是否只读
  datasource: Array<any>
  columns: Array<{ [K: string]: any }>
  dialogProps: { [K: string]: any }
  tagList: Array<{ [K: string]: string }>
  onSetVariable: (name: string, value: { [K: string]: any }) => void
  onSetProps: (name: string, value: string, tag: string) => void
  hasNeedRadioChange: boolean
  onRadioChange: (value: string) => void
  onRemarkChange: (value: string) => void
}

const PipelineRunDom: React.FC<IPipelineRunDialogProps> = (props: IPipelineRunDialogProps): ReactElement => {
  const { pipelineStore } = useStore()

  const getColumns = () => {
    let columns: { [K: string]: any } = props.columns || []
    let nameColumn: { [K: string]: any } = columns[0] || {}
    let genreColumn: { [K: string]: any } = columns[1] || {}
    let valueColumn: { [K: string]: any } = columns[2] || {}
    let descColumn: { [K: string]: any } = columns[3] || {}
    let dialogProps = props.dialogProps || {}
    let tagList = props.tagList || []

    nameColumn.needTooltip = false
    genreColumn.needTooltip = false
    valueColumn.needTooltip = false
    descColumn.needTooltip = false

    nameColumn.render = (record: { [K: string]: any } = {}) => {
      return (
        <div className="name flex-align-center">
          <p>{record.name || ''}</p>
          {record.require === 'yes' && <span className="red">*</span>}
        </div>
      )
    }

    // 更改值的显示
    valueColumn.multiLine = false
    valueColumn.render = (record: { [K: string]: any } = {}) => {
      let value = record.value
      let genre = record.genre || ''
      let name = record.name || ''

      if (props.isReadonly) {
        return <p>{value || ''}</p>
      }

      // str
      if (genre === pipelineStore.VARIABLE_OPTIONS[0].value) {
        return <p>{value || ''}</p>
      }

      // select
      if (genre === pipelineStore.VARIABLE_OPTIONS[1].value) {
        let isVariableMulti = false
        if (value && value.indexOf('\n') !== -1) {
          isVariableMulti = true
          let values = value.split('\n') || []
          // 组装 value
          value = values.map((v: string = '') => {
            return { label: v, value: v }
          })
        }

        // 数组
        if (Array.isArray(value)) {
          let h5: { [K: string]: any } = {}
          let variable = dialogProps.variable || {}
          if (tagList.length > 0) {
            if (tagList[tagList.length - 1].value === record.tag || tagList[tagList.length - 2].value === record.tag) {
              h5 = dialogProps.h5 || {}
            }
          }

          let selectValue = null
          if (isVariableMulti) {
            selectValue = variable[name] || null
          } else if (!Utils.isObjectNull(h5)) {
            selectValue = h5[name] || null
          }

          return (
            <Select
              className="m-ant-select"
              rootClassName="m-ant-select-dropdown"
              style={{ width: '100%' }}
              placeholder="请选择"
              allowClear
              showSearch
              defaultValue={selectValue}
              disabled={record.disabled === 'yes'}
              onChange={(value: string) => {
                if (isVariableMulti) {
                  setVariableValue(
                    name,
                    value,
                    record.id || '',
                    record.order || 0,
                    record.desc || '',
                    record.require,
                    record.disabled
                  )
                } else {
                  // eslint-disable-next-line react/prop-types
                  props.onSetProps?.(name, value, record.tag)
                }
              }}
              options={value || []}
            />
          )
        }
      }

      // input
      if (genre === pipelineStore.VARIABLE_OPTIONS[2].value) {
        let selectValue = record.value || ''
        return (
          <Input
            className="m-ant-input"
            style={{ width: '100%' }}
            placeholder="请输入"
            defaultValue={selectValue}
            allowClear
            onChange={e => {
              setVariableValue(name, e.target.value || '', record.id || '', record.order || 0, record.desc || '')
            }}
          />
        )
      }

      return <p></p>
    }

    return [nameColumn, genreColumn, valueColumn, descColumn]
  }

  const setVariableValue = (
    name: string = '',
    value: string = '',
    id: string = '',
    order: number = 0,
    desc: string = '',
    require: string = '',
    disabled: string = ''
  ) => {
    let v: { [K: string]: any } = {}
    if (!Utils.isBlank(value)) {
      v = {
        id: id || '',
        value: value || '',
        name,
        order,
        desc,
        require,
        disabled
      }
    }

    props.onSetVariable(name, v)
  }

  const render = () => {
    console.log('dialogProps', props.dialogProps)
    let dialogProps = props.dialogProps || {}
    return (
      <div className="run-dialog-content">
        <div className="content-item page-margin-top">
          <div className="title font-bold">启动变量</div>

          {!props.isReadonly && (
            <Radio.Group
              className="m-ant-radio-group"
              value={dialogProps.value}
              onChange={(e: any = {}) => {
                let value = e.target.value || '0'
                props.onRadioChange?.(value)
              }}
            >
              <Radio value="0" className="m-ant-radio">
                默认启动变量
              </Radio>
              <Radio value="1" className="m-ant-radio" disabled={!props.hasNeedRadioChange}>
                复用最近运行记录的启动变量
              </Radio>
            </Radio.Group>
          )}

          <MTable className="border" dataSource={props.datasource || []} columns={getColumns()} />
        </div>

        <div className="content-item page-margin-top">
          <div className="title">备注</div>
          <Input.TextArea
            className="m-ant-input"
            placeholder="请输入备注"
            maxLength={500}
            allowClear
            value={props.dialogProps?.remark || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              props.onRemarkChange?.(e.target.value || '')
            }}
          />
        </div>
      </div>
    )
  }

  return render()
}

export default observer(PipelineRunDom)

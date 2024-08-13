/**
 * 批量运行流水线
 */
import React, { ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Utils from '@utils/utils'
import { Modal } from 'antd'
import PipelineRunDom from '@pages/delivery/pipeline/run/dom'
import MAnchor from '@views/components/anchor'

interface IPipelineBatchRunDialogProps {
  open: boolean
  selectedRowKeys: any[]
  onCancel: () => void
  onOk: (data: Array<{ [K: string]: any }>) => void
  getTagHtml: Function
  datasource: Array<{ [K: string]: any }>
}

const PipelineBatchRunDialog: React.FC<IPipelineBatchRunDialogProps> = (
  props: IPipelineBatchRunDialogProps
): ReactElement => {
  const { pipelineStore, homeStore } = useStore()
  const [batchRunDatasource, setBatchRunDatasource] = useState<Array<{ [K: string]: any }>>([])

  useEffect(() => {
    if (props.datasource.length > 0) {
      setBatchRunDatasource(props.datasource)
    }
  }, [props.datasource])

  const onValidate = () => {
    if (batchRunDatasource.length === 0) return false
    for (let item of batchRunDatasource) {
      let name = item.basic.name || ''
      let flag = pipelineStore.onValidateRun(item, item.runDialogProps || {}, name)
      if (!flag) {
        return false
      }
    }

    return true
  }

  const render = () => {
    return (
      <Modal
        open={props.open}
        title="批量运行流水线"
        className="batch-run-dialog"
        cancelText="取消"
        okText="确认"
        maskClosable={false}
        destroyOnClose={true}
        width={850}
        onCancel={() => {
          props.onCancel?.()
        }}
        style={{
          height: 550,
        }}
        onOk={() => {
          let flag = onValidate()
          props.onOk?.(flag ? batchRunDatasource : [])
        }}
      >
        <div className="batch-run flex-align-start">
          <MAnchor
            columns={getRunColumns(batchRunDatasource)}
            contents={getRunProps(Utils.deepCopy(batchRunDatasource) || [])}
          />
        </div>
      </Modal>
    )
  }

  const getRunProps = (selectedItemList: Array<{ [K: string]: any }> = []) => {
    if (selectedItemList.length === 0) return []
    console.log('selectedItemList:', selectedItemList)

    let list: Array<any> = []
    selectedItemList.forEach((selectItem, index) => {
      let basic = selectItem.basic || {}
      let items = pipelineStore.getDialogOpenProps(selectItem || {}, false) || []
      list.push(
        <div className="run-box" id={`#pipeline${index}`} key={index}>
          <div className="name-box flex">
            <p className="title font-bold page-margin-right">{basic.name || ''}</p>
            {props.getTagHtml?.(basic.tag || '')}
          </div>

          <PipelineRunDom
            datasource={items}
            columns={pipelineStore.getAddVariableCommonColumns() || []}
            tagList={pipelineStore.TAGS || []}
            dialogProps={selectItem.runDialogProps || {}}
            hasNeedRadioChange={pipelineStore.hasRadioNeedChange(selectItem || {})}
            onSetProps={(name: string, value: string, tag: string) => {
              if (tag === pipelineStore.TAGS[pipelineStore.TAGS.length - 1].value) {
                selectItem.runDialogProps.h5[name] = value || ''
                setBatchRunDatasource(selectedItemList || [])
              }
            }}
            onSetVariable={(name: string, value: { [K: string]: any } = {}) => {
              selectItem.runDialogProps.variable[name] = value || {}
              setBatchRunDatasource(selectedItemList || [])
            }}
            onRadioChange={(value: string = '0') => {
              if (value === '0') {
                selectItem.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
              } else {
                selectItem.runDialogProps.value = '1'
                pipelineStore.onSetRadioRunProps(selectItem || {}, selectItem.runDialogProps || {})
              }

              console.log(selectedItemList)
              setBatchRunDatasource(selectedItemList || [])
            }}
            onRemarkChange={(value: string = '') => {
              selectItem.runDialogProps.remark = value || ''
              setBatchRunDatasource(selectedItemList || [])
            }}
          />
        </div>
      )
    })

    return list
  }

  const getRunColumns = (selectedItemList: Array<{ [K: string]: any }> = []) => {
    if (selectedItemList.length === 0) return []

    let list: Array<any> = []
    selectedItemList.forEach((s, index) => {
      let basic = s.basic || {}
      list.push({
        key: `part-${index}`,
        href: `#pipeline${index}`,
        title: <div className="name">{basic.name || ''}</div>,
      })
    })

    return list
  }

  return render()
}

export default observer(PipelineBatchRunDialog)

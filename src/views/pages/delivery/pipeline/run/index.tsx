/**
 * 流水线运行框
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import { Modal } from 'antd'
import Utils from '@utils/utils'
import PipelineRunDom from './dom'

interface IPipelineRunDialogProps {
  isReadonly?: boolean // 是否只读
  onRun?: Function
}

const PipelineRunDialog: React.FC<IPipelineRunDialogProps> = (props: IPipelineRunDialogProps): ReactElement => {
  const { pipelineStore } = useStore()
  const [datasource, setDatasource] = useState<Array<{ [K: string]: any }>>([])

  const render = () => {
    let selectItem = pipelineStore.selectItem || {}
    let basic = selectItem.basic || {}
    let isReadonly = props.isReadonly
    if (isReadonly === undefined || isReadonly === null) {
      isReadonly = false
    }
    return (
      <Modal
        open={pipelineStore.showRunDialog}
        title={`运行流水线: ${basic.name || ''}`}
        className="run-dialog"
        cancelText="取消"
        okText="确认"
        width={700}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => {
          pipelineStore.showRunDialog = false
          pipelineStore.selectItem = {}

          let value = pipelineStore.runDialogProps.value || '0'
          pipelineStore.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
          pipelineStore.runDialogProps.value = value
          // pipelineStore.onSetRadioRunProps(pipelineStore.detailInfo || {}, pipelineStore.runDialogDefaultProps)
        }}
        onOk={async () => {
          let flag = pipelineStore.onValidateRun(isReadonly ? pipelineStore.selectItem || {} : {})
          if (!flag) {
            return
          }
          pipelineStore.showRunDialog = false
          props.onRun?.()
          await pipelineStore.onRun(isReadonly)
        }}
        afterOpenChange={(open: boolean) => {
          if (open) {
            console.log('selectItem:', pipelineStore.selectItem)
            let list = pipelineStore.getDialogOpenProps(pipelineStore.selectItem || {}, isReadonly)
            setDatasource(list)
          } else {
            setDatasource([])
          }
        }}
      >
        <PipelineRunDom
          isReadonly={isReadonly}
          datasource={datasource}
          columns={pipelineStore.getAddVariableCommonColumns() || []}
          dialogProps={pipelineStore.runDialogProps}
          tagList={pipelineStore.TAGS || []}
          hasNeedRadioChange={pipelineStore.hasRadioNeedChange(pipelineStore.detailInfo || {})}
          onSetProps={(name: string, value: string, tag: string) => {
            // H5
            if (tag === pipelineStore.TAGS[pipelineStore.TAGS.length - 1].value) {
              pipelineStore.runDialogProps.h5[name] = value || ''
            }
          }}
          onSetVariable={(name: string, value: { [K: string]: any } = {}) => {
            pipelineStore.runDialogProps.variable[name] = value || {}
          }}
          onRadioChange={(value: string = '0') => {
            if (value === '0') {
              pipelineStore.runDialogProps = Utils.deepCopy(pipelineStore.runDialogDefaultProps)
            } else {
              pipelineStore.onSetRadioRunProps(pipelineStore.detailInfo || {}, pipelineStore.runDialogDefaultProps)
            }

            pipelineStore.runDialogProps.value = value
          }}
          onRemarkChange={(value: string = '') => {
            pipelineStore.runDialogProps.remark = value || ''
          }}
        />
        <Loading show={pipelineStore.loading} />
      </Modal>
    )
  }

  return render()
}

export default observer(PipelineRunDialog)

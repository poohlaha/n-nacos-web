/**
 * 流水线: 流程
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'

interface IPipelineProcess {
  processList: Array<{ [K: string]: any }>
  isRun: boolean
  currentStep?: number
  currentStepStatus?: string
}

const PipelineProcess: React.FC<IPipelineProcess> = (props: IPipelineProcess): ReactElement => {
  const getStageHtml = (className: string = '', leftNode: React.ReactNode = null, name: string = '') => {
    return (
      <div className={`stage-box position-relative ${className || ''}`}>
        <div className="stage-wrapper wh100 position-relative">
          <div className="stage flex-center wh100 position-relative">
            {leftNode && <div className="state-left flex-align-center">{leftNode}</div>}

            <p className="title font-bold">{name || ''}</p>
          </div>
        </div>
      </div>
    )
  }

  const getStageGroupHtml = (className: string = '', leftNode: React.ReactNode = null, name: string = '') => {
    return (
      <div className={`stage-group position-relative ${className || ''}`} key={name || ''}>
        <div className="stage-group-wrapper wh100 position-relative">
          <div className="stage-group-arrow-box flex-center wh100 position-relative">
            <div className="stage-content">
              <div className="stage flex wh100 position-relative">
                {leftNode && <div className="state-group-left flex-center">{leftNode}</div>}

                <p className="title font-bold flex-center flex-1">
                  <span className="over-ellipsis">{name || ''}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getRunStepClassName = (index: number) => {
    let currentStep = props.currentStep || 0
    let currentStepStatus = props.currentStepStatus || 'No'
    if (currentStep > index) {
      return 'step-success border-success'
    }

    if (currentStep !== index) {
      return
    }

    if (currentStepStatus === 'No') {
      return 'step-no'
    }

    if (currentStepStatus === 'Process') {
      return 'step-process border-process'
    }

    if (currentStepStatus === 'Success') {
      return 'step-success border-success'
    }

    if (currentStepStatus === 'Failed') {
      return 'step-failed border-failed'
    }

    if (currentStepStatus === 'Stop') {
      return 'step-stop border-failed'
    }

    return ''
  }

  const getRunStageGroupHtml = (className: string = '', name: string = '', time: string = '', index: number) => {
    let cls = getRunStepClassName(index) || ''
    return (
      <div className={`stage-run-group stage-group position-relative ${className || ''}`} key={name || ''}>
        <div className="stage-group-wrapper wh100 position-relative">
          <div className="stage-group-arrow-box wh100 position-relative">
            <div className={`stage-content h100 ${cls || ''}`}>
              <div className="stage flex wh100 position-relative">
                <div className="content flex-jsc-center w100 flex-1 flex-direction-column">
                  <span className="over-two-ellipsis">{name || ''}</span>
                  <div className="content-bottom flex-jsc-end">
                    <p className="time">{time}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const render = () => {
    let processList = props.processList || []
    return (
      <div className="pipeline-add-process flex-direction-column wh100">
        <div className="process-box flex wh100 overflow">
          {/* @ts-ignore 开始  */}
          {getStageHtml('start', <PlayCircleOutlined />, '开始')}

          {!props.isRun &&
            processList.length > 0 &&
            processList.map((item: { [K: string]: any } = {}, index: number) => {
              return getStageGroupHtml('step', <p>{item.key || ''}</p>, item.label || '')
            })}

          {props.isRun &&
            processList.length > 0 &&
            processList.map((item: { [K: string]: any } = {}, index: number) => {
              return getRunStageGroupHtml('step', item.label || '', '0秒', index + 1)
            })}

          {/* @ts-ignore 结束 */}
          {getStageGroupHtml('end', <CheckCircleOutlined />, '结束')}
        </div>
      </div>
    )
  }

  return render()
}

export default observer(PipelineProcess)

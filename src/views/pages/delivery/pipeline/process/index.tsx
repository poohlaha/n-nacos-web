/**
 * @fileOverview TODO
 * @date 2024-03-11
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Pipeline } from '../pipeline'

interface IPipelineProcessProps {
  data: Array<Array<any>>
  isRun: boolean
  currentStep?: number
  currentStepStatus?: string
}

const PipelineProcess = (props: IPipelineProcessProps): ReactElement => {
  const render = () => {
    return (
      <div className="pipeline-process-page wh100">
        {
          !props.isRun && (
                <Pipeline
                    groups={props.data || []}
                />
            )
        }
      </div>
    )
  }

  return render()
}

export default observer(PipelineProcess)

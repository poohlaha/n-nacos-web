/**
 * @fileOverview process
 * @date 2023-07-06
 * @author poohlaha
 */
import React, {Fragment, ReactElement, useRef} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import {Card} from 'antd'


const Process: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {monitorStore} = useStore()

  useMount(async () => {
    await monitorStore.getList()
  })

  const render = () => {
    return (
      <div className="process-page w100 min-h100">
        <Card></Card>
      </div>
    )
  }

  return render();
}

export default observer(Process)

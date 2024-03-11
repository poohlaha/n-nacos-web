/**
 * @fileOverview dashboard
 * @date 2023-07-05
 * @author poohlaha
 */
import React, {Fragment, ReactElement, useState} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import { Card, Descriptions, Button } from 'antd'
import Loading from '@views/components/loading/loading'
import { TOAST } from '@utils/base'

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {dashboardStore, mainStore} = useStore()

  useMount(async () => {

  })


  const render = () => {
    return (
      <div className="dashboard-page page-padding w100 min-h100">
        <p>Dashboard</p>
        <Loading show={dashboardStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(Dashboard)

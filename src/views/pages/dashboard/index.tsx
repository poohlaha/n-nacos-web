/**
 * @fileOverview dashboard
 * @date 2023-07-05
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import Page from '@views/modules/page'

const Dashboard = (): ReactElement => {
  const { dashboardStore } = useStore()

  useMount(async () => {})

  const render = () => {
    return (
      <Page className="dashboard-page p-4">
        <p className="font-bold text-xl">Dashboard</p>
        <Loading show={dashboardStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

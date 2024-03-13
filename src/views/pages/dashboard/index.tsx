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
import Page from '@views/components/page'

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const { dashboardStore, mainStore } = useStore()

  useMount(async () => {})

  const render = () => {
    return (
      <Page className="dashboard-page" needNavigation={false}>
        <p>Dashboard</p>
        <Loading show={dashboardStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

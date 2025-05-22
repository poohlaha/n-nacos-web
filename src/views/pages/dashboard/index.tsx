/**
 * @fileOverview dashboard
 * @date 2023-07-05
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'

const Dashboard = (): ReactElement => {
  const { dashboardStore } = useStore()

  const render = () => {
    return (
      <Page
        className="dashboard-page"
        title={{
          label: RouterUrls.DASHBOARD.NAME || ''
        }}
      >
        <Loading show={dashboardStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

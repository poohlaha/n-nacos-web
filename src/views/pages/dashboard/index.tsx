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
import RouterUrls from '@route/router.url.toml'

const Dashboard = (): ReactElement => {
  const { dashboardStore } = useStore()

  useMount(async () => {})

  const render = () => {
    return (
      <Page className="dashboard-page">
        {/* title */}
        <div className="page-title flex-align-center">
          <p className="flex-1 font-bold text-xl">{RouterUrls.DASHBOARD.NAME}</p>
        </div>

        <Loading show={dashboardStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

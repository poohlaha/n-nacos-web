/**
 * @fileOverview Home
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import { USER } from '@utils/base'
import { useNavigate } from 'react-router'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import Left from '@pages/main/left'
import Right from '@pages/main/right'

const Home = (): ReactElement => {
  const { homeStore } = useStore()
  const navigate = useNavigate()

  useMount(() => {
    homeStore.userInfo = USER.getUserInfo() || {}
    homeStore.getSelectedKeysByUrl()
  })

  const render = () => {
    return (
      <Page
        className="home-page wh100 overflow-hidden background"
        contentClassName="flex-direction-column !p-0"
        loading={homeStore.loading}
      >
        {/* 导航条
        <Navigation
          userName={homeStore.userInfo.userName || ''}
          onLogout={async () => {}}
          onUpdatePwd={() => {}}
          onHome={() => {
            homeStore.selectedMenuKeys = [RouterUrls.DASHBOARD.URL]
            navigate(RouterUrls.DASHBOARD.URL)
          }}
        />
         */}

        {/* main */}
        <main className="flex-1 w100 overflow-hidden flex">
          <Left
            userName={homeStore.userInfo.userName || ''}
            onLogout={async () => {}}
            onUpdatePwd={() => {}}
            onHome={() => {
              homeStore.selectedMenuKeys = [RouterUrls.DASHBOARD.URL]
              navigate(RouterUrls.DASHBOARD.URL)
            }}
          />
          <Right />
        </main>
      </Page>
    )
  }

  return render()
}

export default observer(Home)

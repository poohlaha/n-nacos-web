/**
 * 右侧页面
 */
import React, { ReactElement, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Utils from '@utils/utils'
import Loading from '@views/components/loading/loading'
import ScrollToTop from '@router/scrollToTop'
import Page from '@views/components/page'

const Right: React.FC<IRouterProps> = (): ReactElement => {
  const { homeStore } = useStore()

  const getRightRoutes = () => {
    let urls: Array<{ [K: string]: any }> = []
    if (homeStore.menuList.length === 0) return []

    homeStore.menuList.map((item: { [K: string]: any }, index: number) => {
      let children = item.children || []
      if (children.length === 0) {
        if (!Utils.isBlank(item.url)) {
          urls.push({
            path: item.url,
            component: item.component,
          })
        }
      } else {
        for (let child of children) {
          if (!Utils.isBlank(child.url)) {
            urls.push({
              path: child.url,
              component: child.component,
            })
          }
        }
      }
    })

    return urls
  }

  const getRoutes = (routes: { [K: string]: any } = {}) => {
    return (
      <Routes>
        {routes.length > 0 &&
          routes.map((route: { [K: string]: any }, index: number) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Suspense fallback={<Loading show={true} />}>
                    <ScrollToTop />
                    <route.component />
                  </Suspense>
                }
              ></Route>
            )
          })}
      </Routes>
    )
  }

  const render = () => {
    let rightRoutes = getRightRoutes() || []
    let otherSubRoutes = homeStore.getOtherSubRoutes() || []
    let routes = rightRoutes.concat(otherSubRoutes)
    return (
      <Page className="right" needNavigation={false} pageBodyNeedPadding={false}>
        {getRoutes(routes)}
      </Page>
    )
  }

  return render()
}

export default observer(Right)

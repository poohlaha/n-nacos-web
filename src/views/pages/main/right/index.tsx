/**
 * @fileOverview Home Right
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { lazy, ReactElement, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { Route, Routes } from 'react-router'
import Loading from '@views/components/loading/loading'
import ScrollToTop from '@router/scrollToTop'
import { useStore } from '@views/stores'
import RouterUrls from '@route/router.url.toml'
import ServerDetail from '@pages/server/detail'

const Right = (): ReactElement => {
  const { homeStore } = useStore()

  const getNoteChildren = () => {
    return [
      {
        key: RouterUrls.NOTE.DETAIL.KEY,
        label: RouterUrls.NOTE.DETAIL.NAME,
        url: RouterUrls.NOTE.DETAIL.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'noteDetail' */ '@views/pages/note/detail'))
      },
      {
        key: RouterUrls.NOTE.EDIT.KEY,
        label: RouterUrls.NOTE.EDIT.NAME,
        url: RouterUrls.NOTE.EDIT.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'noteEdit' */ '@views/pages/note/edit'))
      },
      {
        key: RouterUrls.NOTE.TAG.KEY,
        label: RouterUrls.NOTE.TAG.NAME,
        url: RouterUrls.NOTE.TAG.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'noteTag' */ '@views/pages/note/tag'))
      },
      {
        key: RouterUrls.NOTE.TAGDETAIL.KEY,
        label: RouterUrls.NOTE.TAGDETAIL.NAME,
        url: RouterUrls.NOTE.TAGDETAIL.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'noteTagDetail' */ '@views/pages/note/tag/detail'))
      },
      {
        key: RouterUrls.PIPELINE.ADD.KEY,
        label: RouterUrls.PIPELINE.ADD.NAME,
        url: RouterUrls.PIPELINE.ADD.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'pipelineAdd' */ '@views/pages/pipeline/add'))
      },
      {
        key: RouterUrls.PIPELINE.DETAIL.KEY,
        label: RouterUrls.PIPELINE.DETAIL.NAME,
        url: RouterUrls.PIPELINE.DETAIL.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'pipelineDetail' */ '@views/pages/pipeline/detail'))
      },
      {
        key: RouterUrls.SERVER.DETAIL.KEY,
        label: RouterUrls.SERVER.DETAIL.NAME,
        url: RouterUrls.SERVER.DETAIL.URL,
        icon: null,
        component: ServerDetail
      },
      {
        key: RouterUrls.SETTING.SYSTEM.KEY,
        label: RouterUrls.SETTING.SYSTEM.NAME,
        url: RouterUrls.SETTING.SYSTEM.URL,
        icon: null,
        component: lazy(() => import(/* webpackChunkName:'setting' */ '@views/pages/setting/system'))
      }
    ]
  }

  const getRoutes = () => {
    const menuList = homeStore.MENU_LIST || []
    if (menuList.length === 0) return []

    const generateRoutes = (menuList: any[], parentPath: string = '') => {
      return menuList.flatMap((route: { [K: string]: any } = {}) => {
        if (!route.component && (route.children || []).length === 0) {
          console.warn(`⚠️ 组件未定义: ${route.key} (path: ${route.url})`)
          return []
        }

        let routeList: any[] = []
        const fullPath = `${parentPath}${route.url}`
        if (route.component) {
          routeList.push(
            <Route
              key={route.key}
              path={fullPath}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component />
                </Suspense>
              }
            />
          )
        }

        // 处理子菜单
        if (route.children) {
          routeList = [...routeList, ...generateRoutes(route.children || [], fullPath)]
        }

        // 处理详情页
        /*
        if (route.url) {
          routeList.push(
            <Route
              key={`${fullPath}-details`}
              path={`${fullPath}/:id`}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component />
                </Suspense>
              }
            />
          )
        }
         */

        return routeList
      })
    }

    let routeList = generateRoutes(menuList) || []

    // 添加 dashboard
    /*
    routeList.push(
      <Route
        key="dashboard"
        path="/"
        element={
          <Suspense fallback={<Loading show />}>
            <ScrollToTop />
            <Dashboard />
          </Suspense>
        }
      />
    )
     */

    /**
     * 添加详情页面
     */
    let noteChildren = getNoteChildren()
    for (const child of noteChildren) {
      routeList.push(
        <Route
          key={`${RouterUrls.NOTE.KEY}-${child.key}`}
          path={`${child.url}`}
          element={
            <Suspense fallback={<Loading show />}>
              <ScrollToTop />
              <child.component />
            </Suspense>
          }
        />
      )
    }

    console.log('routes:', routeList)
    return <Routes>{routeList}</Routes>
  }

  const render = () => {
    return <div className="right overflow-y-auto flex-1 w100 position-relative flex-jsc-center">{getRoutes()}</div>
  }

  return render()
}

export default observer(Right)

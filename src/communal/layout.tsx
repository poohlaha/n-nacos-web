/**
 * @fileOverview layout
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router'
import { RouteInterface } from '@router/router.interface'
import NotFound from '@route/not-found'
import ScrollToTop from '@router/scrollToTop'
import { routes } from '@route/router'
import Loading from '../views/components/loading'
import Utils from '@utils/utils'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import '@assets/styles/common/tailwind.css'
import '@assets/styles/theme/index.less'
import RouterUrls from '@route/router.url.toml'

import '@ant-design/v5-patch-for-react-19'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs'
import useMount from '@hooks/useMount'

const { Suspense } = React

const RenderRoutes = (routes: RouteInterface[]) => {
  // 判断没用的路由, 跳转到404
  let usedRoutes: Array<RouteInterface> = []
  for (let router of routes) {
    if (!Utils.isBlank(router.path) || router.component !== null) {
      usedRoutes.push(router)
    }
  }

  if (usedRoutes.length > 0) {
    return (
      <Routes>
        {routes.map((route: RouteInterface) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component routes={route.routes || []} />
                </Suspense>
              }
            ></Route>
          )
        })}

        <Route path="*" element={<Navigate to={RouterUrls.NOT_FOUND_URL} />} />
      </Routes>
    )
  }
  return <Route element={<NotFound />} />
}

// 切换皮肤
const switchSkin = (skin: string = '', font: { [K: string]: any } = {}) => {
  /*
  let classList = document.body.classList || []
  const remove = () => {
    if (skin === CONSTANT.SKINS[0]) {
      classList.remove(CONSTANT.SKINS[1])
    } else {
      classList.remove(CONSTANT.SKINS[0])
    }
  }
   */

  document.body.setAttribute('class', '')
  document.body.setAttribute('class', `${skin} ${font.fontFamily || ''}`)
}

const Layout = (): ReactElement => {
  const { commonStore, systemStore } = useStore()

  useEffect(() => {
    switchSkin(commonStore.skin, systemStore.font || {})
  }, [commonStore.skin, systemStore.font.fontFamily])

  useMount(() => {
    commonStore.onGetSkin()
  })

  const px2rem = px2remTransformer({
    rootValue: 16 // 32px = 1rem; @default 16
  })

  const render = () => {
    return (
      <StyleProvider transformers={[px2rem]}>
        <ConfigProvider locale={zhCN}>{RenderRoutes(routes)}</ConfigProvider>
      </StyleProvider>
    )
  }

  return render()
}

export default observer(Layout)

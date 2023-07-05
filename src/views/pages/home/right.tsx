/**
 * 右侧页面
 */
import React, {ReactElement, Suspense} from 'react'
import { Route, Routes } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Utils from '@utils/utils'
import RouterUrls from '@route/router.url.toml'
import Loading from '@views/components/loading/loading'
import ScrollToTop from '@router/scrollToTop'

const Right: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const {leftStore, commonStore} = useStore()

  const getUrls = () => {
    let urls: Array<{[K: string]: any}> = []
    if (leftStore.menuList.length === 0) return []

    leftStore.menuList.map((item: {[K: string]: any}, index: number) => {
      let children = item.children || []
      if (children.length === 0) {
        if (!Utils.isBlank(item.url)) {
          urls.push({
            path: `${RouterUrls.MAIN_URL}${item.url}`,
            component: item.component
          })
        }
      } else {
        for(let child of children) {
          if (!Utils.isBlank(child.url)) {
            urls.push({
              path: `${RouterUrls.MAIN_URL}${child.url}`,
              component: child.component
            })
          }
        }
      }
    })

    return urls
  }
  const render = () => {
    let urls = getUrls();
    console.log("urls", urls)
    return (
      <div className="right flex-1">
        {
          <Routes>
            {
              urls.length > 0 && urls.map((route: {[K: string]: any}, index: number) => {
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
                  >
                  </Route>
                )
              })
            }
          </Routes>
        }

        <Loading show={commonStore.loading} />
      </div>
    )
  }

  return render();
}

export default observer(Right)

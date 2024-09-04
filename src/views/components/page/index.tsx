/**
 * @fileOverview page
 * @date 2024-03-13
 * @author poohlaha
 */
import React, { PropsWithChildren, ReactElement } from 'react'
import Navigation from '@pages/home/navigation'
import MBreadcrumb from '@views/modules/breadcrumb'
import Utils from '@utils/utils'
import RouterUrls from '@route/router.url.toml'
import { useStore } from '@views/stores'
import { INavigationProps } from '@views/components/page/type'

interface IPageProps {
  className?: string // 样式名称
  pageBodyClassName?: string // page-content 样式
  pageBodyNeedPadding?: boolean // page-content 是否需要 padding
  needNavigation?: boolean // 是否需要导航
  navigationProps?: INavigationProps
  needBreadcrumb?: boolean // 是否面包屑
  breadCrumbItemList?: Array<{ [K: string]: any }> // 面包屑列表
}

const Page = (props: PropsWithChildren<IPageProps>): ReactElement => {
  const { homeStore } = useStore()

  const getPropsDefaultValue = (propName: any, defaultValue: any) => {
    // @ts-ignore
    let prop = props[propName]
    if (prop === undefined || prop === null) {
      return defaultValue
    }

    return prop
  }

  const getBreadcrumbItems = () => {
    let list = Utils.deepCopy(homeStore.menuList || []) || []
    if (list.length === 0) return list

    let breadCrumbItemList = props.breadCrumbItemList || []
    let url = homeStore.getUrl() || ''
    if (Utils.isBlank(url)) return []

    let index = url.indexOf('?')
    if (index !== -1) {
      url = url.substring(0, index)
    }

    let menus: Array<{ [K: string]: any }> = []
    let otherRoutes = homeStore.getOtherSubRoutes() || []
    for (let item of list) {
      let itemUrl = item.url || ''
      if (itemUrl === url) {
        menus.push(item)
        break
      }

      let children = item.children || []
      let child = children.find((child: { [K: string]: any } = {}) => url === child.url) || {}

      if (!Utils.isObjectNull(child)) {
        menus.push(item)
        menus.push(child)
        break
      }

      if (breadCrumbItemList.length > 0) {
        menus = menus.concat(breadCrumbItemList)
        break
      }

      // 查找其他路由
      let route: { [K: string]: any } = otherRoutes.find((route: { [K: string]: any } = {}) => route.path === url) || {}
      if (!Utils.isObjectNull(route)) {
        // 查找其父节点
        let routeParent = list.find((l: { [K: string]: any } = {}) => route.belong === l.key) || {}
        if (Utils.isObjectNull(routeParent)) {
          menus.push(route)
          break
        } else {
          menus.push(routeParent)
          menus.push(route)
          break
        }
      }
    }

    if (menus.length === 0) return []

    if (url !== RouterUrls.DASHBOARD_URL) {
      menus.unshift(list[0])
    }

    return menus
  }

  const getBreadcrumb = () => {
    return (
      <div className="breadcrumb-top flex-align-center">
        <MBreadcrumb items={getBreadcrumbItems() || []} onChange={() => {}} />
      </div>
    )
  }

  const render = () => {
    let pageBodyNeedPadding = getPropsDefaultValue('pageBodyNeedPadding', true)
    let needNavigation = getPropsDefaultValue('needNavigation', true)
    let needBreadcrumb = getPropsDefaultValue('needBreadcrumb', false)

    return (
      <div className={`page flex-direction-column wh100 ${props.className || ''}`}>
        {/* 导航栏 */}
        {needNavigation && <Navigation {...props.navigationProps} />}

        <div
          className={`page-content position-relative overflow ${pageBodyNeedPadding ? 'page-padding' : ''} flex-1 ${
            props.pageBodyClassName || ''
          }`}
        >
          {needBreadcrumb && getBreadcrumb()}
          {props.children}
        </div>
      </div>
    )
  }

  return render()
}

export default Page

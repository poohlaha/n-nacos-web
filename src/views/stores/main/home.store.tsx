/**
 * @fileOverview home store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import {lazy} from 'react'
import RouterUrls from '@route/router.url.toml'
import React from 'react'
import Utils from '@utils/utils'
import {CONSTANT, SYSTEM} from '@config/index'

class HomeStore extends BaseStore {
  readonly menuList = [
    {
      name: '控制台',
      key: 'dashboard',
      icon: <svg key="dashboard-svg" className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M902.016 130.016H123.008q-23.008 0-40 16.992t-16.992 40v480q0 24 16.992 40.512t40 16.512H480v108h-147.008q-12.992 0-22.496 9.504t-9.504 22.496 9.504 22.016 22.496 8.992h358.016q12.992 0 22.496-8.992t9.504-22.016-9.504-22.496-22.496-9.504h-148v-108h359.008q24 0 40.512-16.512t16.512-40.512v-480q0-23.008-16.512-40t-40.512-16.992zM896 192.992v468H128.992V192.992H896z"></path></svg>,
      url: RouterUrls.DASHBOARD_URL,
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@pages/dashboard/index'))
    },
    {
      name: '监控',
      key: 'monitor',
      children: [
        {
          name: '服务器信息',
          key: 'serverInfo',
          icon: <svg key="server-info-svg" className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M900.788 448.274V287.975L512.929 64.038l-134.904 77.896c-11.073-10.496-25.93-17.043-42.347-17.043-34.026 0-61.736 27.689-61.736 61.736 0 4.951 0.74 9.704 1.846 14.322l-150.675 87.026v447.83l133.107 76.82c-1.772 5.744-3.003 11.719-3.003 18.037 0 34.048 27.711 61.736 61.736 61.736 17.816 0 33.772-7.709 45.052-19.828l150.923 87.128 387.86-223.937V565.57c25.055-7.861 43.418-31.023 43.418-58.648s-18.362-50.787-43.418-58.648zM335.677 157.923c15.831 0 28.704 12.851 28.704 28.704s-12.873 28.704-28.704 28.704-28.704-12.851-28.704-28.704 12.873-28.704 28.704-28.704z m-18.724 701.442c-15.831 0-28.704-12.851-28.704-28.704 0-15.854 12.873-28.704 28.704-28.704 15.831 0 28.704 12.851 28.704 28.704 0.001 15.854-12.872 28.704-28.704 28.704z m547.624-144.448L512.929 917.922 377.76 839.863c0.458-3.025 0.93-6.05 0.93-9.202 0-34.048-27.711-61.736-61.736-61.736-14.529 0-27.727 5.258-38.287 13.692l-117.342-67.745V308.819l132.934-76.734c10.979 10.011 25.434 16.279 41.42 16.279 34.026 0 61.736-27.689 61.736-61.736 0-4.546-0.566-8.948-1.501-13.215l117.017-67.598L864.579 308.82v139.326c-25.273 7.725-43.843 30.998-43.843 58.777 0 27.78 18.569 51.052 43.843 58.777v149.217z m17.893-179.291c-15.831 0-28.704-12.851-28.704-28.704s12.873-28.704 28.704-28.704c15.831 0 28.704 12.851 28.704 28.704s-12.872 28.704-28.704 28.704zM287.598 694.595h445.666V333.629H287.598v360.966z m33.032-327.934h379.602v130.935H320.63V366.661z m0 163.967h379.602v130.935H320.63V530.628z m306.605-122.86c-12.486 0-22.61 10.124-22.61 22.61 0 12.489 10.124 22.61 22.61 22.61 12.489 0 22.61-10.121 22.61-22.61 0-12.486-10.121-22.61-22.61-22.61z m1.91 168.632c-12.486 0-22.61 10.124-22.61 22.61 0 12.489 10.124 22.61 22.61 22.61s22.61-10.121 22.61-22.61c0-12.486-10.124-22.61-22.61-22.61zM362.891 447.518H553.31v-33.032H362.891v33.032z m0 166.617H553.31v-33.032H362.891v33.032z" fill="currentColor"></path></svg>,
          url: RouterUrls.MONITOR.SERVER_URL,
          component: lazy(() => import(/* webpackChunkName:'pipelineList' */ '@pages/monitor/server'))
        }
      ]
    },
    {
      name: '持续交付',
      key: 'pipeline',
      children: [
        {
          name: '流水线',
          key: 'pipelineList',
          icon: <svg key="pipeline-list-svg" className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M204.8 51.2a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4zM819.2 665.6a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z" fill="currentColor"></path><path d="M818.9952 153.6c81.92 0 148.8896 63.9488 153.5488 144.5888L972.8 307.2v102.4a153.7024 153.7024 0 0 1-144.7424 153.344l-9.0624 0.256H205.0048a51.2 51.2 0 0 0-50.944 45.2096L153.7024 614.4v102.4a51.2 51.2 0 0 0 45.312 50.8416l5.9904 0.3584h510.1568v102.4H205.0048a153.7024 153.7024 0 0 1-153.5488-144.5888L51.2 716.8v-102.4a153.7024 153.7024 0 0 1 144.7424-153.344L205.0048 460.8h613.9904a51.2 51.2 0 0 0 50.944-45.2096L870.2976 409.6V307.2a51.2 51.2 0 0 0-45.312-50.8416L818.9952 256H258.1504V153.6h560.8448z" fill="currentColor"></path></svg>,
          url: RouterUrls.PIPELINE.URL,
          component: lazy(() => import(/* webpackChunkName:'pipelineList' */ '@pages/delivery/pipeline/index'))
        }
      ]
    }
  ]

  @observable activeIndexes: Array<number> = [] // 激活的索引

  constructor() {
    super()
  }

  /**
   * 获取其他子路由
   */
  getOtherSubRoutes() {
    return [
      {
        key: 'pipelineAdd',
        path: RouterUrls.PIPELINE.ADD_URL,
        belong: 'pipeline',
        component: lazy(() => import(/* webpackChunkName:'pipelineAdd' */ '@pages/delivery/pipeline/add'))
      },
      {
        key: 'pipelineDetail',
        path: RouterUrls.PIPELINE.DETAIL_URL,
        belong: 'pipeline',
        component: lazy(() => import(/* webpackChunkName:'pipelineDetail' */ '@pages/delivery/pipeline/detail')),
      }
    ]
  }

  getMonition = () => {
    return {
      name: 'Monitor',
      children: [
        {
          name: 'Process',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M197.01 502.2h74.84l47.26 71.48a39.096 39.096 0 0 0 36.53 17.47 39.287 39.287 0 0 0 32.64-23.98l59.55-141.67 65.73 150.04a39.327 39.327 0 0 0 36.05 23.61h1.11c16.04-0.57 30.17-10.72 35.82-25.74l52.19-140.8 27.31 64.8c6.13 14.63 20.46 24.14 36.32 24.12h134.16c10.45 0.01 20.47-4.14 27.85-11.52a39.297 39.297 0 0 0 11.51-27.84 39.302 39.302 0 0 0-11.52-27.82 39.321 39.321 0 0 0-27.84-11.51H728.51l-55.9-132.33c-6.31-14.82-21.02-24.32-37.13-23.98-16.16 0.37-30.45 10.56-36.05 25.7l-52.8 142.65-63.4-144.74a39.493 39.493 0 0 0-36.29-23.61c-15.75 0.11-29.93 9.58-36.05 24.08l-66.61 158.54-18.33-27.9a39.258 39.258 0 0 0-32.85-17.71h-96.01a39.368 39.368 0 0 0-27.86 11.51 39.321 39.321 0 0 0-11.54 27.82 39.353 39.353 0 0 0 11.51 27.89 39.464 39.464 0 0 0 27.88 11.58l-0.07-0.14z m748.33 256.29H78.86V128.82h866.48v629.67z m0-708.36H78.86C35.37 50.18 0.14 85.4 0.1 128.86v629.67c0.06 43.44 35.28 78.64 78.76 78.7h866.48c43.47-0.06 78.7-35.26 78.76-78.7V128.86c-0.04-43.46-35.27-78.68-78.76-78.73z m-719.6 859.95h576.89c17.7 0 32.05 14.34 32.05 32.02 0 17.69-14.35 32.02-32.05 32.02H225.74c-17.7 0-32.05-14.34-32.05-32.02 0-17.68 14.35-32.02 32.05-32.02z" fill="currentColor"></path></svg>,
          url: RouterUrls.PROCESS_URL,
          component: lazy(() => import(/* webpackChunkName:'process' */ '@pages/monitor/process'))
        },
        {
          name: 'Command',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M355.400383 504.697687c-3.620457-8.68787-13.598716-12.794397-22.286586-9.17394L121.278157 583.816652c-13.857613 5.77554-14.017248 25.350364-0.255827 31.351032l211.390501 92.178399c8.627495 3.761674 18.671245-0.182149 22.432918-8.809643 3.761674-8.627495-0.182149-18.671245-8.809643-22.432918L171.282015 599.899956l174.944428-72.916706C354.914312 523.362792 359.02084 513.384533 355.400383 504.697687z" fill="currentColor"></path><path d="M921.386948 583.816652 709.551308 495.523747c-8.68787-3.620457-18.665105 0.48607-22.286586 9.17394-3.620457 8.68787 0.48607 18.665105 9.17394 22.286586l174.944428 72.916706-174.755116 76.202543c-8.627495 3.761674-12.571317 13.805424-8.809643 22.432918 3.761674 8.627495 13.805424 12.571317 22.432918 8.809643l211.390501-92.178399C935.403173 609.167017 935.24456 589.592192 921.386948 583.816652z" fill="currentColor"></path><path d="M571.71401 367.050724c-9.051143-2.579755-18.479887 2.666736-21.059642 11.718903l-119.67566 419.944398c-2.579755 9.051143 2.666736 18.48091 11.718903 21.059642s18.479887-2.666736 21.059642-11.718903l119.67566-419.944398C586.012667 379.059222 580.766177 369.630479 571.71401 367.050724z" fill="currentColor"></path><path d="M0.021489 0l0 1022.506996 1022.506996 0L1022.528486 204.501604l0-34.08326L1022.528486 0 0.021489 0zM34.104749 988.423737 34.104749 204.501604l17.042141 0 937.298336 0 0 783.922133L34.104749 988.423737zM988.445226 170.417321 51.14689 170.417321 34.104749 170.417321 34.104749 34.08326l954.339454 0L988.444203 170.417321z" fill="currentColor"></path></svg>,
          url: RouterUrls.COMMAND_URL,
          component: lazy(() => import(/* webpackChunkName:'command' */ '@pages/monitor/command'))
        },
        {
          name: 'Directory',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M42.666667 42.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h896a42.666667 42.666667 0 0 1 42.666667 42.666667v938.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V42.666667z m85.333333 42.666666v853.333334h810.666667V85.333333H128z" fill="currentColor"></path><path d="M542.165333 225.834667a42.666667 42.666667 0 0 1 0 60.330666l-170.666666 170.666667a42.666667 42.666667 0 0 1-60.330667 0l-85.333333-85.333333a42.666667 42.666667 0 0 1 60.330666-60.330667L341.333333 366.336l140.501334-140.501333a42.666667 42.666667 0 0 1 60.330666 0zM853.333333 725.333333a42.666667 42.666667 0 0 1-42.666666 42.666667h-213.333334a42.666667 42.666667 0 1 1 0-85.333333h213.333334a42.666667 42.666667 0 0 1 42.666666 42.666666zM853.333333 384a42.666667 42.666667 0 0 1-42.666666 42.666667h-213.333334a42.666667 42.666667 0 1 1 0-85.333334h213.333334a42.666667 42.666667 0 0 1 42.666666 42.666667zM362.666667 640a64 64 0 1 0 0 128 64 64 0 0 0 0-128zM213.333333 704a149.333333 149.333333 0 1 1 298.666667 0 149.333333 149.333333 0 0 1-298.666667 0z" fill="currentColor"></path></svg>,
          url: RouterUrls.DIRECTORY_URL,
          component: lazy(() => import(/* webpackChunkName:'directory' */ '@pages/monitor/directory'))
        }
      ]
    }
  }

  getConfiguration() {
    return {
      name: 'Configuration',
      children: [
        {
          name: 'Nginx',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0L68.48 256v512L512 1024l443.52-256V256L512 0z m256 707.84c0 30.08-27.562667 55.04-65.237333 55.04-26.922667 0-57.642667-10.88-76.842667-34.56l-256-304.682667v284.16c0 30.762667-24.32 55.04-54.357333 55.04H312.32c-30.762667 0-55.04-25.6-55.04-55.04V316.16c0-30.08 26.88-55.04 64-55.04 27.562667 0 58.88 10.88 78.08 34.56l254.72 304.682667V316.16c0-30.762667 25.6-55.04 55.04-55.04h3.2c30.72 0 55.04 25.6 55.04 55.04v391.68H768z" fill="currentColor"></path></svg>,
          url: RouterUrls.NGINX_URL,
          component: lazy(() => import('@pages/configuration/nginx'))
        }
      ]
    }
  }

  initMenu() {
    let activeIndexes = this.getCache() || []
    if (typeof activeIndexes === 'string') {
      activeIndexes = JSON.parse(activeIndexes)
    }

    this.activeIndexes = activeIndexes.length === 0 ? [0] : activeIndexes

    if (this.activeIndexes.length === 1) {
      let index = this.activeIndexes[0]
      if (index > this.menuList.length) {
        index = 0
        this.activeIndexes = [0]
      }
      return this.menuList[index].url || ''
    }

    let menuId = this.activeIndexes[0]
    let childMenuId = this.activeIndexes[1]
    let menu = this.menuList[menuId]
    let menuChildren = menu.children || []
    let menuSubChildren = this.getOtherSubRoutes().filter(m => m.belong === menu.key) || []
    if (menuChildren.length === 0 && menuSubChildren.length === 0) {
      this.activeIndexes = [0]
      return this.menuList[0].url || ''
    }

    let menuUrl = menu.url || ''
    let url = ''
    // 根据 url 查找
    if (menuSubChildren.length > 0) {
      for (let m of menuSubChildren) {
        let subUrl = `${menuUrl}${m.path}`
        if (window.location.href.indexOf(subUrl) !== -1) {
          url = this.getRelativePath(window.location.href) || ''
          url = url.replace(RouterUrls.HOME_URL, '')
          break
        }
      }
    }

    if (Utils.isBlank(url)) {
      if (menuChildren.length > 0) {
        url = menuChildren[childMenuId].url || ''
      }
    }

    return url
  }

  @action
  setCache() {
    Utils.setLocal(CONSTANT.MENU_CACHE, this.activeIndexes)
  }

  @action
  getCache() {
    return Utils.getLocal(CONSTANT.MENU_CACHE)
  }

  @action
  setActiveIndexes(activeIndexes: Array<number> = []) {
    if (activeIndexes.length === 0) return
    this.activeIndexes = activeIndexes
    this.setCache()
  }

  @action
  reset() {
    this.activeIndexes = []
    this.setCache()
  }

  /**
   * 获取选中的服务器
   */
  @action
  getSelectServer() {
    let serverCache = Utils.getLocal(SYSTEM.SERVER_TOKEN_NAME)
    if (typeof serverCache === 'string') {
      return JSON.parse(serverCache) || {}
    }

    return serverCache || {}
  }
}

export default new HomeStore()

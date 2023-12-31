/**
 * @fileOverview main left store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import {lazy} from 'react'
import RouterUrls from '@route/router.url.toml'
import React from 'react'
import Utils from '@utils/utils'
import { CONSTANT } from '@config/index'

class LeftStore extends BaseStore {
  readonly menuList = [
    {
      name: 'Dashboard',
      icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M902.016 130.016H123.008q-23.008 0-40 16.992t-16.992 40v480q0 24 16.992 40.512t40 16.512H480v108h-147.008q-12.992 0-22.496 9.504t-9.504 22.496 9.504 22.016 22.496 8.992h358.016q12.992 0 22.496-8.992t9.504-22.016-9.504-22.496-22.496-9.504h-148v-108h359.008q24 0 40.512-16.512t16.512-40.512v-480q0-23.008-16.512-40t-40.512-16.992zM896 192.992v468H128.992V192.992H896z"></path></svg>,
      url: RouterUrls.DASHBOARD_URL,
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@pages/dashboard/index'))
    },
    {
      name: 'Monitor',
      children: [
        {
          name: 'Process',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M197.01 502.2h74.84l47.26 71.48a39.096 39.096 0 0 0 36.53 17.47 39.287 39.287 0 0 0 32.64-23.98l59.55-141.67 65.73 150.04a39.327 39.327 0 0 0 36.05 23.61h1.11c16.04-0.57 30.17-10.72 35.82-25.74l52.19-140.8 27.31 64.8c6.13 14.63 20.46 24.14 36.32 24.12h134.16c10.45 0.01 20.47-4.14 27.85-11.52a39.297 39.297 0 0 0 11.51-27.84 39.302 39.302 0 0 0-11.52-27.82 39.321 39.321 0 0 0-27.84-11.51H728.51l-55.9-132.33c-6.31-14.82-21.02-24.32-37.13-23.98-16.16 0.37-30.45 10.56-36.05 25.7l-52.8 142.65-63.4-144.74a39.493 39.493 0 0 0-36.29-23.61c-15.75 0.11-29.93 9.58-36.05 24.08l-66.61 158.54-18.33-27.9a39.258 39.258 0 0 0-32.85-17.71h-96.01a39.368 39.368 0 0 0-27.86 11.51 39.321 39.321 0 0 0-11.54 27.82 39.353 39.353 0 0 0 11.51 27.89 39.464 39.464 0 0 0 27.88 11.58l-0.07-0.14z m748.33 256.29H78.86V128.82h866.48v629.67z m0-708.36H78.86C35.37 50.18 0.14 85.4 0.1 128.86v629.67c0.06 43.44 35.28 78.64 78.76 78.7h866.48c43.47-0.06 78.7-35.26 78.76-78.7V128.86c-0.04-43.46-35.27-78.68-78.76-78.73z m-719.6 859.95h576.89c17.7 0 32.05 14.34 32.05 32.02 0 17.69-14.35 32.02-32.05 32.02H225.74c-17.7 0-32.05-14.34-32.05-32.02 0-17.68 14.35-32.02 32.05-32.02z" fill="currentColor"></path></svg>,
          url: RouterUrls.PROCESS_URL,
          component: lazy(() => import(/* webpackChunkName:'process' */ '@pages/monitor/process'))
        },
        {
          name: 'Command',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M355.400383 504.697687c-3.620457-8.68787-13.598716-12.794397-22.286586-9.17394L121.278157 583.816652c-13.857613 5.77554-14.017248 25.350364-0.255827 31.351032l211.390501 92.178399c8.627495 3.761674 18.671245-0.182149 22.432918-8.809643 3.761674-8.627495-0.182149-18.671245-8.809643-22.432918L171.282015 599.899956l174.944428-72.916706C354.914312 523.362792 359.02084 513.384533 355.400383 504.697687z" fill="currentColor"></path><path d="M921.386948 583.816652 709.551308 495.523747c-8.68787-3.620457-18.665105 0.48607-22.286586 9.17394-3.620457 8.68787 0.48607 18.665105 9.17394 22.286586l174.944428 72.916706-174.755116 76.202543c-8.627495 3.761674-12.571317 13.805424-8.809643 22.432918 3.761674 8.627495 13.805424 12.571317 22.432918 8.809643l211.390501-92.178399C935.403173 609.167017 935.24456 589.592192 921.386948 583.816652z" fill="currentColor"></path><path d="M571.71401 367.050724c-9.051143-2.579755-18.479887 2.666736-21.059642 11.718903l-119.67566 419.944398c-2.579755 9.051143 2.666736 18.48091 11.718903 21.059642s18.479887-2.666736 21.059642-11.718903l119.67566-419.944398C586.012667 379.059222 580.766177 369.630479 571.71401 367.050724z" fill="currentColor"></path><path d="M0.021489 0l0 1022.506996 1022.506996 0L1022.528486 204.501604l0-34.08326L1022.528486 0 0.021489 0zM34.104749 988.423737 34.104749 204.501604l17.042141 0 937.298336 0 0 783.922133L34.104749 988.423737zM988.445226 170.417321 51.14689 170.417321 34.104749 170.417321 34.104749 34.08326l954.339454 0L988.444203 170.417321z" fill="currentColor"></path></svg>,
          url: RouterUrls.COMMAND_URL,
          component: lazy(() => import(/* webpackChunkName:'command' */ '@pages/monitor/command'))
        }
      ]
    },
    {
      name: 'Configuration',
      children: [
        {
          name: 'Nginx',
          icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0L68.48 256v512L512 1024l443.52-256V256L512 0z m256 707.84c0 30.08-27.562667 55.04-65.237333 55.04-26.922667 0-57.642667-10.88-76.842667-34.56l-256-304.682667v284.16c0 30.762667-24.32 55.04-54.357333 55.04H312.32c-30.762667 0-55.04-25.6-55.04-55.04V316.16c0-30.08 26.88-55.04 64-55.04 27.562667 0 58.88 10.88 78.08 34.56l254.72 304.682667V316.16c0-30.762667 25.6-55.04 55.04-55.04h3.2c30.72 0 55.04 25.6 55.04 55.04v391.68H768z" fill="currentColor"></path></svg>,
          url: RouterUrls.NGINX_URL,
          component: lazy(() => import(/* webpackChunkName:'nginx' */ '@pages/configuration/nginx'))
        }
      ]
    }
  ]

  @observable activeIndexes: Array<number> = []; // 激活的索引

  constructor() {
    super()
    let activeIndexes = this.getCache() || []
    if (typeof activeIndexes === 'string') {
      activeIndexes = JSON.parse(activeIndexes)
    }

    this.activeIndexes = activeIndexes.length === 0 ? [0] : activeIndexes
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
}

export default new LeftStore()

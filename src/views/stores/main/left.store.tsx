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

class LeftStore extends BaseStore {
  readonly menuList = [
    {
      name: 'Dashboard',
      icon: <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M902.016 130.016H123.008q-23.008 0-40 16.992t-16.992 40v480q0 24 16.992 40.512t40 16.512H480v108h-147.008q-12.992 0-22.496 9.504t-9.504 22.496 9.504 22.016 22.496 8.992h358.016q12.992 0 22.496-8.992t9.504-22.016-9.504-22.496-22.496-9.504h-148v-108h359.008q24 0 40.512-16.512t16.512-40.512v-480q0-23.008-16.512-40t-40.512-16.992zM896 192.992v468H128.992V192.992H896z"></path></svg>,
      url: RouterUrls.DASHBOARD_URL,
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@pages/dashboard/index'))
    },
    {
      name: '配置',
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
    this.activeIndexes = [0] // 默认激活 dashboard
  }
}

export default new LeftStore()

/**
 * @fileOverview main left store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import {lazy} from 'react'
import RouterUrls from '@route/router.url.toml'

class LeftStore extends BaseStore {
  readonly menuList = [
    {
      name: 'Dashboard',
      url: RouterUrls.DASHBOARD_URL,
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@pages/dashboard/index'))
    },
    {
      name: '配置',
      children: [
        {
          name: 'Nginx',
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

/**
 * @fileOverview dashboard store
 * @date 2023-07-05
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import BackUrls from '@route/router.back.toml'
import React from 'react'

class DashboardStore extends BaseStore {
  @observable systemInfo: {[K: string]: any} = {} // 系统信息

  /**
   * 获取系统信息
   */
  @action
  async getSystemInfo() {
    this.loading = true
    this.systemInfo = {}
    return await $http.post({
      url: BackUrls.GET_SYSTEM_INFO_URL,
      data: {
        data: ['cpu', 'dist'],
        request: 'system'
      },
      success: (res: {[K: string]: any} = {}) => {
        this.loading = false
        this.systemInfo = res
      },
      fail: () => this.loading = false
    })
  }
}

export default new DashboardStore()

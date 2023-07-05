/**
 * @fileOverview nginx store
 * @date 2023-07-04
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import {lazy} from 'react'
import RouterUrls from '@route/router.url.toml'
import React from 'react'
import BackUrls from "@route/router.back.toml";

class NginxStore extends BaseStore {

  @observable fileData: {[K: string]: any} = {} // 系统信息

  /**
   * 获取系统信息
   */
  @action
  async getFileData(callback?: any) {
    this.loading = true
    this.fileData = {}
    return await $http.post({
      url: BackUrls.GET_QUERY_DATA,
      data: {
        data: ['file'],
        request: 'nginx'
      },
      success: (res: {[K: string]: any} = {}) => {
        this.loading = false
        this.fileData = res
        callback?.()
      },
      fail: () => this.loading = false
    })
  }

}

export default new NginxStore()

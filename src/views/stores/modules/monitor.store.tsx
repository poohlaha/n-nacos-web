/**
 * @fileOverview monitor store
 * @date 2023-07-06
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import BackUrls from "@route/router.back.toml";

class MonitorStore extends BaseStore {

  @observable data: Array<{[K: string]: any}> = []

  /**
   * 获取监控信息
   */
  @action
  async getList() {
    this.loading = true
    return await $http.post({
      url: BackUrls.GET_MONITOR_PROCESS_URL,
      data: {
        process_names: ['nginx'],
        request: 'monitor'
      },
      success: (res: Array<{[K: string]: any}> = []) => {
        this.loading = false
        this.data = res
      },
      fail: () => this.loading = false
    })
  }

}

export default new MonitorStore()

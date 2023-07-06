/**
 * @fileOverview monitor store
 * @date 2023-07-06
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import BackUrls from "@route/router.back.toml";

class MonitorStore extends BaseStore {

  @observable processes: Array<{[K: string]: any}> = []
  @observable processList: Array<{[K: string]: any}> = []
  @observable addProcesses: Array<string> = []

  /**
   * 获取监控信息
   */
  @action
  async getList() {
    this.loading = true
    this.processList = []
    this.processes = []
    return await $http.post({
      url: BackUrls.GET_MONITOR_PROCESS_URL,
      data: {
        process_names: ['nginx'].concat(this.addProcesses),
        request: 'monitor'
      },
      success: (res: {[K: string]: any} = {}) => {
        this.loading = false
        this.processes = res.processes || []
        this.processList = res.process_list || []
      },
      fail: () => this.loading = false
    })
  }

  @action
  onSelectProcessChange(value: Array<string> = []) {
    this.addProcesses = value || []
  }
}

export default new MonitorStore()

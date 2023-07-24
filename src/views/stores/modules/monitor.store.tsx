/**
 * @fileOverview monitor store
 * @date 2023-07-06
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import BackUrls from '@route/router.back.toml'
import {TOAST} from '@utils/base'
import Utils from '@utils/utils'

class MonitorStore extends BaseStore {

  @observable processes: Array<{[K: string]: any}> = []
  @observable processList: Array<{[K: string]: any}> = []
  @observable addProcesses: Array<string> = []

  constructor() {
    super()
  }

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
        user_id: this.userId || '',
        request: 'monitor'
      },
      success: (res: {[K: string]: any} = {}) => {
        this.loading = false
        this.processes = res.processes || []
        this.processList = res.process_list || []
        this.addProcesses = res.processes.map((process: {[K: string]: any}) => process.name)
      },
      fail: () => this.loading = false
    })
  }

  @action
  onSelectProcessChange(value: Array<string> = []) {
    this.addProcesses = this.addProcesses.concat(value || [])
  }

  /**
   * 结束进程
   */
  @action
  async onKillProcess(processName: string, pidList: Array<string>) {
    this.loading = true
    return await $http.post({
      url: BackUrls.KILL_PROCESS_LIST_URL,
      data: {
        process_ids: pidList || '',
        request: 'monitor'
      },
      success: async (res: Array<{[K: string]: any}> = []) => {
        this.loading = false
        if (res.length > 0) {
          let errorMsg = ''
          for(let result of res) {
            errorMsg += (result.error + '\n')
          }

          TOAST.show({ message: errorMsg, type: 4 })
        } else {
          await this.getList()
        }
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 添加进程
    */
  async onAddProcesses(callback: Function) {
    this.loading = true
    return await $http.post({
      url: BackUrls.ADD_PROCESS_URL,
      data: {
        user_id: this.userId,
        process_names: this.addProcesses || [],
        request: 'monitor'
      },
      success: async (res: Array<{[K: string]: any}> = []) => {
        this.loading = false
        callback?.()
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 移除进程
   */
  @action
  async onRemoveProcess(processName: string) {
    if (this.addProcesses.length === 0 || Utils.isBlank(processName)) return
    this.loading = true
    return await $http.post({
      url: BackUrls.REMOVE_PROCESS_URL,
      data: {
        user_id: this.userId,
        process_names: [processName],
        request: 'monitor'
      },
      success: async (res: Array<{[K: string]: any}> = []) => {
        this.loading = false
        await this.getList()
      },
      fail: () => this.loading = false
    })
  }
}

export default new MonitorStore()

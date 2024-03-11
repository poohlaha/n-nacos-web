/**
 * @fileOverview dashboard store
 * @date 2023-07-05
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'

class ServerStore extends BaseStore {
  @observable serverInfo: {[K: string]: any} = {} // 服务器信息
  @observable monitorInfo: {[K: string]: any} = {} // 监控信息
  @observable isStartMonitor: boolean = false // 是否启用监听
  @observable monitorListenInfo: {[K: string]: any} = {
    cpuInfo: {}, // cpu 信息
    diskInfo: [], // 磁盘信息
    os: {}, // 系统信息
    homeDir: '', // 用户主目录
  } // 监听结果

  @observable memUsedList: Array<{[K: string]: any}> = [] // 内存使用率
  @observable cpuUsedList: Array<{[K: string]: any}> = [] // CPU使用率

  /**
   * 启动监控
   */
  @action
  async startMonitor(serverId: string = '') {
    try {
      this.loading = true
      let result: {[K: string]: any} = await invoke('start_monitor',{id: serverId});
      console.log('start monitor result:', result)
      this.loading = false
      let flag = this.analysisResult(result, '启动监控失败')
      this.isStartMonitor = flag
    } catch (e) {
      this.loading = false
      TOAST.show({message: e, type: 4})
      throw new Error(e)
    }
  }

  /**
   * 停止监控
   */
  @action
  async stopMonitor() {
    try {
      this.loading = true
      let result: {[K: string]: any} = await invoke('stop_monitor',{});
      console.log('stop monitor result:', result)
      this.loading = false
      let flag = this.analysisResult(result, '停止监控失败')
      if (flag) {
        this.isStartMonitor = false
      }
    } catch (e) {
      this.loading = false
      TOAST.show({message: e, type: 4})
      throw new Error(e)
    }
  }
}

export default new ServerStore()

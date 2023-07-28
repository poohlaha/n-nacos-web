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
  @observable commandList: Array<{[K: string]: any}> = []
  @observable addProcesses: Array<string> = []
  @observable commandForm: {[K: string]: string} = {
    name: '',
    exec: ''
  }

  constructor() {
    super()
  }

  /**
   * 获取监控信息
   */
  @action
  async getProcessList() {
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
          await this.getProcessList()
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
      success: async (res: Array<{[K: string]: any}> = [], resData: {[K: string]: any} = {}) => {
        this.loading = false
        if (resData.code !== 200) {
          TOAST.show({ message: '移除进程失败!', type: 4 })
          return false
        }
        await this.getProcessList()
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 命令行提交
   */
  async onCommandSubmit() {
    if (Utils.isBlank(this.commandForm.name)) {
      TOAST.show({ message: '名称不能为空!', type: 4 })
      return
    }

    if (Utils.isBlank(this.commandForm.exec)) {
      TOAST.show({ message: '脚本不能为空!', type: 4 })
      return
    }
    await $http.post({
      url: BackUrls.ADD_COMMAND_URL,
      data: {
        user_id: this.userId,
        name: this.commandForm.name || '',
        exec: this.commandForm.exec || '',
        request: 'monitor'
      },
      success: async (res: {[K: string]: any} = {}, resData: {[K: string]: any} = {}) => {
        if (resData.code !== 200) {
          TOAST.show({ message: '添加命令失败!', type: 4 })
          return false
        }

        this.loading = false
        this.commandForm.name = ''
        this.commandForm.exec = ''
        await this.getCommandList()
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 移除命令
   */
  @action
  async onRemoveCommand(id: string) {
    if (Utils.isBlank(id)) return
    this.loading = true
    return await $http.post({
      url: BackUrls.REMOVE_COMMAND_URL,
      data: {
        id,
        request: 'monitor'
      },
      success: async (res: Array<{[K: string]: any}> = [], resData: {[K: string]: any} = {}) => {
        this.loading = false
        if (resData.code !== 200) {
          TOAST.show({ message: '移除命令失败!', type: 4 })
          return false
        }
        await this.getCommandList()
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 执行命令
   */
  @action
  async onExecCommand(id: string) {
    if (Utils.isBlank(id)) return
    this.loading = true
    return await $http.post({
      url: BackUrls.EXEC_COMMAND_URL,
      data: {
        id,
        request: 'monitor'
      },
      success: async (res: Array<{[K: string]: any}> = [], resData: {[K: string]: any} = {}) => {
        this.loading = false
        if (resData.code !== 200) {
          TOAST.show({ message: '执行命令失败!', type: 4 })
          return false
        }
      },
      fail: () => this.loading = false
    })
  }

  /**
   * 获取命令行列表
   */
  async getCommandList() {
    this.loading = true
    this.commandList = []
    return await $http.post({
      url: BackUrls.GET_COMMAND_LIST_URL,
      data: {
        user_id: this.userId || '',
        request: 'monitor'
      },
      success: (res: {[K: string]: any} = {}) => {
        this.loading = false
        let commandList = res.data || []
        this.commandList = commandList.map((c: {[K: string]: string}, index: number) => {
          let key = index
          let exec = c.exec.replace('\n', '\\n')
          return {...c, key, exec}
        })
      },
      fail: () => this.loading = false
    })
  }
}

export default new MonitorStore()

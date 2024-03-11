/**
 * @fileOverview monitor store
 * @date 2023-07-06
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import { TOAST } from '@utils/base'
import Utils from '@utils/utils'
import { invoke } from '@tauri-apps/api/core'

class MonitorStore extends BaseStore {
  @observable processes: Array<{ [K: string]: any }> = []
  @observable processList: Array<{ [K: string]: any }> = []
  @observable commandList: Array<{ [K: string]: any }> = []
  @observable addProcesses: Array<string> = []
  @observable commandForm: { [K: string]: string } = {
    name: '',
    exec: '',
  }
  @observable execCommand: string = ''

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
    let result: { [K: string]: any } = await invoke('get_monitor_process_list', { userId: this.userId })
    console.log('result:', result)
    this.loading = false
    let data = this.analysisResult(result, '') || {}
    this.processes = data.processes || []
    this.processList = data.process_list || []
    this.addProcesses = this.processes.map((process: { [K: string]: any }) => process.name)
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
    let result: { [K: string]: any } = await invoke('kill_monitor_process', {
      userId: this.userId,
      processIds: pidList || [],
    })
    console.log('result:', result)
    this.loading = false
    this.analysisResult(result, '结束进程失败!') || {}
    if (result.code === 200) {
      await this.getProcessList()
    }
  }

  /**
   * 添加进程
   */
  async onAddProcesses(callback: Function) {
    this.loading = true
    let result: { [K: string]: any } = await invoke('add_monitor_process', {
      userId: this.userId,
      processNames: this.addProcesses || [],
    })
    console.log('result:', result)
    this.loading = false
    this.analysisResult(result, '添加进程失败!') || {}
    if (result.code === 200) {
      callback?.()
      await this.getProcessList()
    }
  }

  /**
   * 移除进程
   */
  @action
  async onRemoveProcess(processName: string) {
    if (this.addProcesses.length === 0 || Utils.isBlank(processName)) return
    this.loading = true
    let result: { [K: string]: any } = await invoke('remove_monitor_process', {
      userId: this.userId,
      processNames: [processName],
    })
    console.log('result:', result)
    this.loading = false
    this.analysisResult(result, '移除进程失败!') || {}
    if (result.code === 200) {
      await this.getProcessList()
    }
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

    this.loading = true
    let result: { [K: string]: any } = await invoke('add_monitor_command', {
      userId: this.userId,
      name: this.commandForm.name || '',
      exec: this.commandForm.exec || '',
    })
    console.log('result:', result)
    this.loading = false

    this.analysisResult(result, '添加命令失败')
    this.commandForm.name = ''
    this.commandForm.exec = ''
    if (result.code === 200) {
      await this.getCommandList()
    }
  }

  /**
   * 移除命令
   */
  @action
  async onRemoveCommand(id: string) {
    if (Utils.isBlank(id)) return
    this.loading = true
    let result: { [K: string]: any } = await invoke('delete_monitor_command', { userId: this.userId, id })
    console.log('result:', result)
    this.loading = false
    this.analysisResult(result, '移除命令失败!')
    if (result.code === 200) {
      await this.getCommandList()
    }
  }

  /**
   * 执行命令
   */
  @action
  async onExecCommand(text: string, id: string, callback: any = null, failedCallback: any = null) {
    if (Utils.isBlank(id)) return
    this.loading = true
    let result: { [K: string]: any } = await invoke('exec_monitor_command', { userId: this.userId, id })
    console.log('result:', result)
    this.loading = false
    this.analysisResult(result, '执行命令失败!')
    if (result.code === 200) {
      this.execCommand = text || ''
      // await this.getCommandList()
      callback?.()
    } else {
      failedCallback?.()
    }
  }

  /**
   * 获取命令行列表
   */
  async getCommandList() {
    this.loading = true
    this.commandList = []
    let result: { [K: string]: any } = await invoke('get_monitor_command_list', { userId: this.userId })
    console.log('result:', result)
    this.loading = false
    const commandList = this.analysisResult(result, '') || []
    this.commandList = commandList.map((c: { [K: string]: string }, index: number) => {
      let key = index
      let exec = c.exec.replace(/\n/g, '\\n') || ''
      exec = exec.replace(/&&/g, '\\n') || ''
      return { ...c, key, exec }
    })

    console.log('command list', this.commandList)
  }
}

export default new MonitorStore()

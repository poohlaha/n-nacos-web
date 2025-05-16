/**
 * @fileOverview dashboard store
 * @date 2023-07-05
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'
import { info } from '@tauri-apps/plugin-log'
import Utils from '@utils/utils'

class ServerStore extends BaseStore {
  @observable serverInfo: { [K: string]: any } = {} // 服务器信息
  @observable monitorInfo: { [K: string]: any } = {} // 监控信息
  @observable isStartMonitor: boolean = false // 是否启用监听
  @observable monitorListenInfo: { [K: string]: any } = {
    cpuInfo: {}, // cpu 信息
    diskInfo: [], // 磁盘信息
    os: {}, // 系统信息
    homeDir: '' // 用户主目录
  } // 监听结果

  @observable memUsedList: Array<{ [K: string]: any }> = [] // 内存使用率
  @observable cpuUsedList: Array<{ [K: string]: any }> = [] // CPU使用率

  readonly PORT_REG = /^\d*$/

  // 服务器列表
  @observable list: Array<{ [K: string]: any }> = []

  // 是否显示添加|编辑对话框
  @observable showAddDialog: boolean = false

  // 表单
  readonly defaultForm: { [K: string]: any } = {
    id: '',
    ip: '',
    port: '22',
    account: '',
    pwd: '',
    name: '',
    desc: '',
    error: ''
  }

  @observable form = Utils.deepCopy(this.defaultForm)
  // 选中的服务器
  @observable selectedServer: { [K: string]: any } = {}

  /**
   * 获取服务器列表
   */
  @action
  async getList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_server_list', {})) || {}
      this.loading = false
      let data = this.handleResult(result) || []
      this.list = (data || []).map((item: { [K: string]: any } = {}, index: number) => {
        return { ...item, key: index + 1, label: item.name || '', value: item.id || '' }
      })
      console.log('get server list result:', result)
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 删除服务器
   */
  @action
  async deleteServer(id: string) {
    try {
      console.log('delete server params:', id)
      await info(`delete server params: ${id}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('delete_server', { id })) || {}
      this.loading = false
      console.log('delete server result:', result)
      let success = this.handleResult(result)
      if (success) {
        this.showAddDialog = false
        this.form = Utils.deepCopy(this.defaultForm)
        TOAST.show({ message: '删除服务器成功', type: 2 })
        setTimeout(() => {
          this.getList()
        }, 500)
      }
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 添加|编辑
   */
  @action
  async onSave() {
    let id = (this.form.id || '').trim()
    let ip = (this.form.ip || '').trim()
    let port = this.form.port || ''
    let account = (this.form.account || '').trim()
    let pwd = (this.form.pwd || '').trim()
    let name = (this.form.name || '').trim()
    let desc = (this.form.desc || '').trim()

    if (Utils.isBlank(ip)) {
      // this.form.error = 'error'
      TOAST.show({ message: '请输入服务器IP', type: 4 })
      return
    }

    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipv4Regex.test(ip)) {
      //this.form.error = 'error'
      TOAST.show({ message: '请输入正确的服务器IP', type: 4 })
      return
    }

    if (typeof port !== 'number') {
      if (Utils.isBlank(port)) {
        port = '22'
      } else if (!this.PORT_REG.test(port)) {
        // this.form.error = 'error'
        TOAST.show({ message: '请输入正确的服务器端口', type: 4 })
        return
      }
    }

    if (Utils.isBlank(account)) {
      //this.form.error = 'error'
      TOAST.show({ message: '请输入服务器账号', type: 4 })
      return
    }

    if (Utils.isBlank(pwd)) {
      //this.form.error = 'error'
      TOAST.show({ message: '请输入服务器密码', type: 4 })
      return
    }

    this.form.error = ''
    this.loading = true
    let server: { [K: string]: any } = {
      id,
      ip,
      port: parseInt(port),
      account,
      pwd,
      name,
      desc
    }

    try {
      let cmd = !Utils.isBlank(id) ? 'update_server' : 'insert_server'
      console.log('save server params:', server, 'cmd:', cmd)
      await info(`save server params: ${JSON.stringify({ server, cmd })}`)
      let result: { [K: string]: any } = (await invoke(cmd, { server })) || {}
      this.loading = false
      console.log('save server result:', result)
      let success = this.handleResult(result)
      if (success) {
        this.showAddDialog = false
        this.form = Utils.deepCopy(this.defaultForm)
        TOAST.show({ message: '保存服务器成功', type: 2 })
        setTimeout(() => {
          this.getList()
        }, 500)
      }
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 启动监控
   */
  @action
  async startMonitor(serverId: string = '') {
    try {
      this.loading = true
      let result: { [K: string]: any } = await invoke('start_monitor', { id: serverId })
      console.log('start monitor result:', result)
      this.loading = false
      let flag = this.analysisResult(result, '启动监控失败')
      this.isStartMonitor = flag
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: e, type: 4 })
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
      let result: { [K: string]: any } = await invoke('stop_monitor', {})
      console.log('stop monitor result:', result)
      this.loading = false
      let flag = this.analysisResult(result, '停止监控失败')
      if (flag) {
        this.isStartMonitor = false
      }
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: e, type: 4 })
      throw new Error(e)
    }
  }
}

export default new ServerStore()

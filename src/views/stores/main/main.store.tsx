/**
 * @fileOverview main store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import Utils from '@utils/utils'
import { invoke } from '@tauri-apps/api/core'
import { info } from '@tauri-apps/plugin-log'
import {TOAST} from '@utils/base'
import {SYSTEM} from '@config/index'

class MainStore extends BaseStore {

    readonly PORT_REG = /^\d*$/;

    // 服务器列表
    @observable serverList: Array<{[K: string]: any}> = []

    // 是否显示添加|编辑对话框
    @observable showAddDialog: boolean = false

    // 表单
    readonly defaultForm: {[K: string]: any} = {
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
    @observable selectServer: { [K: string]: any } = {}

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
            TOAST.show({message: '请输入服务器IP', type: 4})
            return
        }

        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
        if (!ipv4Regex.test(ip)) {
            //this.form.error = 'error'
            TOAST.show({message: '请输入正确的服务器IP', type: 4})
            return
        }

        if (typeof port !== 'number') {
            if (Utils.isBlank(port)) {
                port = '22'
            } else if (!this.PORT_REG.test(port)) {
                // this.form.error = 'error'
                TOAST.show({message: '请输入正确的服务器端口', type: 4})
                return
            }
        }

        if (Utils.isBlank(account)) {
            //this.form.error = 'error'
            TOAST.show({message: '请输入服务器账号', type: 4})
            return
        }

        if (Utils.isBlank(pwd)) {
            //this.form.error = 'error'
            TOAST.show({message: '请输入服务器密码', type: 4})
            return
        }

        this.form.error = ''
        this.loading = true
        let server: {[K: string]: any} = {
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
            await info(`save server params: ${JSON.stringify({server, cmd})}`)
            let result: {[K: string]: any} = await invoke(cmd, {server}) || {}
            this.loading = false
            console.log('save server result:', result)
            let success = this.handleResult(result)
            if (success) {
                this.showAddDialog = false
                this.form = Utils.deepCopy(this.defaultForm)
                TOAST.show({message: '保存服务器成功', type: 2})
                setTimeout(() => {
                    this.getServerList()
                }, 500)
            }

        } catch (e) {
            this.loading = false
            throw new Error(e)
        }
    }

    /**
     * 获取服务器列表
     */
    @action
    async getServerList() {
        try {
            this.loading = true
            let result: {[K: string]: any} = await invoke('get_server_list', {}) || {}
            this.loading = false
            console.log('get server list result:', result)
            let data = this.handleResult(result) || []
            this.serverList = data || []
        } catch (e) {
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
            let result: {[K: string]: any} = await invoke('delete_server', {id}) || {}
            this.loading = false
            console.log('delete server result:', result)
            let success = this.handleResult(result)
            if (success) {
                this.showAddDialog = false
                this.form = Utils.deepCopy(this.defaultForm)
                TOAST.show({message: '删除服务器成功', type: 2})
                setTimeout(() => {
                    this.getServerList()
                }, 500)
            }
        } catch (e) {
            this.loading = false
            throw new Error(e)
        }
    }

    /**
     * 设置选中的服务器
     */
    @action
    onSelectServer(item: {[K: string]: any} = {}) {
        if (Utils.isObjectNull(item)) return
        this.selectServer = item
        Utils.setLocal(SYSTEM.SERVER_TOKEN_NAME, this.selectServer)
    }

    /**
     * 获取选中的服务器
     */
    @action
    getSelectServer() {
        try {
            let server = Utils.deepCopy(this.selectServer || {})
            if (Utils.isObjectNull(server)) {
                let serverCache = Utils.getLocal(SYSTEM.SERVER_TOKEN_NAME)
                if (typeof serverCache === 'string') {
                    server = JSON.parse(serverCache) || {}
                }
            }

            this.selectServer = server
            return this.selectServer
        } catch (e) {
            throw new Error(e)
        }

    }
}

export default new MainStore()

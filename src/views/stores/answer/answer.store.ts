/**
 * @fileOverview answer store
 * @date 2023-07-03
 * @author poohlaha
 */
import BaseStore from '../base/base.store'
import { action, observable } from 'mobx'
import { TOAST } from '@utils/base'
import { invoke } from '@tauri-apps/api/core'

class AnswerStore extends BaseStore {
  @observable lxrConfig: { [K: string]: any } = {
    id: '',
    account: '',
    pwd: '',
    token: ''
  }

  @observable znConfig: { [K: string]: any } = {
    id: '',
    account: '',
    pwd: ''
  }

  readonly ANSWER_TYPE: Array<string> = ['LXR', 'ZN']
  @observable isStarted: boolean = false

  /**
   * 获取配置(账号密码等)
   */
  @action
  async onGetConfig() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_answer_config', {})) || {}
      console.log('get answer config:', result)

      this.loading = false
      const configs = this.handleResult(result) || {}
      this.lxrConfig = configs.find((res: { [K: string]: any } = {}) => res.answerType === this.ANSWER_TYPE[0]) || {}
      this.znConfig = configs.find((res: { [K: string]: any } = {}) => res.answerType === this.ANSWER_TYPE[1]) || {}
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取配置失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 保存配置(账号密码等)
   */
  @action
  async onSaveConfig(opts: { [K: string]: any } = {}, callback?: Function) {
    try {
      this.loading = true
      const config = {
        id: opts.id || '',
        account: opts.account || '',
        pwd: opts.pwd || '',
        token: opts.token || '',
        answerType: opts.answerType || ''
      }

      console.log('save answer params:', config)

      let result: { [K: string]: any } = (await invoke('save_or_update_answer_config', { config })) || {}
      console.log('save answer config:', result)
      this.loading = false

      if (result.code !== 200) {
        TOAST.show({ message: '保存失败', type: 4 })
        return
      }

      TOAST.show({ message: '保存成功', type: 2 })
      await this.onGetConfig()
      callback?.()
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `保存失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  async start() {
    try {
      this.isStarted = true
      let result: { [K: string]: any } = (await invoke('start_answer', {})) || {}
      console.log('srart answer result:', result)
    } catch (e: any) {
      this.isStarted = false
      TOAST.show({ message: `保存失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }
}

export default new AnswerStore()

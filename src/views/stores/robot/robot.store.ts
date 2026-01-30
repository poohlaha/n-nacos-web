/**
 * @fileOverview robot store
 * @date 2023-07-03
 * @author poohlaha
 */
import BaseStore from '../base/base.store'
import { action, observable } from 'mobx'
import { TOAST } from '@utils/base'
import { invoke } from '@tauri-apps/api/core'
import Utils from '@utils/utils'

class RobotStore extends BaseStore {
  readonly ROBOT_NAME = 'clawdbot'

  @observable config: { [K: string]: any } = {
    name: '',
    url: ''
  }

  /**
   * 获取配置
   */
  @action
  async onGetConfig() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_robot_config', {})) || {}
      console.log('get robot config:', result)

      this.loading = false
      this.config = this.handleResult(result) || {}
      if (Utils.isObjectNull(this.config || {})) {
        this.config.name = this.ROBOT_NAME
      }
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取配置失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 保存配置
   */
  @action
  async onSave(callback?: Function) {
    try {
      this.loading = true
      const robot = {
        name: this.config.name || '',
        url: this.config.url || ''
      }

      let result: { [K: string]: any } = (await invoke('save_robot_config', { robot })) || {}
      console.log('save robot config:', result)
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
}

export default new RobotStore()

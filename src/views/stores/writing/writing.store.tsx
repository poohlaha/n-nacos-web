/**
 * @fileOverview writing store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import Utils from '@utils/utils'
import BaseStore from '../base/base.store'
import { info } from '@tauri-apps/plugin-log'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'

class WritingStore extends BaseStore {
  @observable list: Array<{ [K: string]: any }> = []
  @observable detail: { [K: string]: any } = {}
  @observable defaultForm: { [K: string]: any } = {
    title: '',
    tags: [],
    content: '',
  }
  @observable form: { [K: string]: any } = Utils.deepCopy(this.defaultForm)

  @action
  async onSave(callback?: Function) {
    try {
      if (Utils.isBlank(this.form.title || '')) {
        TOAST.show({ message: '标题不能为空', type: 4 })
        return
      }

      if (this.form.tags.length === 0) {
        TOAST.show({ message: '标签不能为空', type: 4 })
        return
      }

      if (Utils.isBlank(this.form.content || '')) {
        TOAST.show({ message: '内容不能为空', type: 4 })
        return
      }

      console.log('on save params:', this.form)
      await info(`on save params: ${JSON.stringify(this.form)}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('save_writing', { ...this.form })) || {}
      this.loading = false
      let data = this.handleResult(result) || []
      console.log('on save result:', data)
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }
}

export default new WritingStore()

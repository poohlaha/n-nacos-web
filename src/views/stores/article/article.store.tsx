/**
 * @fileOverview article store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import Utils from '@utils/utils'
import BaseStore from '../base/base.store'
import { info } from '@tauri-apps/plugin-log'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'

class ArticleStore extends BaseStore {
  @observable list: Array<{ [K: string]: any }> = []
  @observable detail: { [K: string]: any } = {}
  @observable tagList: Array<{ [K: string]: any }> = []
  @observable defaultForm: { [K: string]: any } = {
    title: '',
    tags: [],
    content: '',
  }
  @observable form: { [K: string]: any } = Utils.deepCopy(this.defaultForm)

  @action
  async getList(callback?: Function) {
    try {
      this.tagList = []
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_article_tag_list', {})) || {}
      this.loading = false
      let data = this.handleResult(result) || []
      console.log('get tag list result:', data)
      this.tagList = data.map((d: string = '') => {
        return { label: d || '', value: d || '' }
      })
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  async getTagList(callback?: Function) {
    try {
      this.tagList = []
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_article_tag_list', {})) || {}
      this.loading = false
      let data = this.handleResult(result) || []
      console.log('get tag list result:', data)
      this.tagList = data.map((d: { [K: string]: any } = {}) => {
        return { label: d.name || '', value: d.name || '' }
      })
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

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

      let params: { [K: string]: any } = {
        ...this.form,
      }

      params.tags = Utils.deepCopy(this.form.tags || []).map((t: { [K: string]: any } = {}) => {
        return t.value || ''
      })

      console.log('on save params:', params)
      await info(`on save params: ${JSON.stringify(params)}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('save_article', { article: params })) || {}
      this.loading = false
      let flag = this.handleResult(result)
      console.log('on save result:', flag)
      if (flag) {
        TOAST.show({ message: '保存文章成功', type: 2 })
        callback?.()
      }
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }
}

export default new ArticleStore()

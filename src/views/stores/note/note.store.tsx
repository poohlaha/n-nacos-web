/**
 * @fileOverview note store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import Utils from '@utils/utils'
import BaseStore from '../base/base.store'
import { info } from '@tauri-apps/plugin-log'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'

class NoteStore extends BaseStore {
  readonly articlePageSize: number = 5
  @observable defaultInfo: { [K: string]: any } = {
    archiveList: [],
    list: [],
    listCount: 0,
    tagClassifyList: [],
    tagList: []
  }

  @observable info: { [K: string]: any } = Utils.deepCopy(this.defaultInfo)
  @observable new: { [K: string]: any } = {}
  @observable newList: Array<{ [K: string]: any }> = []
  @observable detail: { [K: string]: any } = {}
  @observable tagClassify: { [K: string]: any } = {}
  @observable tagArticleList: Array<{ [K: string]: any }> = []
  @observable tagList: Array<{ [K: string]: any }> = []
  @observable defaultForm: { [K: string]: any } = {
    title: '',
    tags: [],
    content: ''
  }
  @observable form: { [K: string]: any } = Utils.deepCopy(this.defaultForm)

  @action
  async getList(callback?: Function) {
    try {
      if (this.currentPage === 1) {
        this.info = Utils.deepCopy(this.defaultInfo)
        this.new = {}
        this.newList = []
      }

      this.loading = true
      let result: { [K: string]: any } =
        (await invoke('get_article_list', {
          query: {
            currentPage: this.currentPage,
            pageSize: this.articlePageSize,
            onlyQueryList: this.currentPage !== 1
          }
        })) || {}
      this.loading = false
      let info = this.handleResult(result) || {}
      console.log('get article list info result:', info)
      if (this.currentPage === 1) {
        this.info = info
        let list = Utils.deepCopy(info.list || [])
        if (list.length > 0) {
          this.new = list[0] || {}
          this.newList = list.slice(0, 5)
        }
      } else {
        this.info.list = info.list || []
      }
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 删除文章
   */
  @action
  async onDelete(id: string = '', callback?: Function) {
    try {
      this.tagList = []
      this.loading = true
      let result: { [K: string]: any } = (await invoke('delete_article', { id })) || {}
      this.loading = false
      let flag = this.handleResult(result)
      console.log('delete article result:', flag)
      if (flag) {
        TOAST.show({ message: '删除文章成功', type: 2 })
        callback?.()
      }
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
      console.log('get article tag list result:', data)
      this.tagList = data.map((d: { [K: string]: any } = {}) => {
        return { label: d.name || '', value: d.name || '' }
      })
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 获取文章分类
   */
  @action
  async getTagClassify(callback?: Function) {
    try {
      this.tagClassify = {}
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_article_tag_classify', {})) || {}
      this.loading = false
      let data = this.handleResult(result) || {}
      console.log('get article tag classify result:', data)
      this.tagClassify = data || {}
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 获取分类下的文章
   */
  @action
  async getTagArticleList(id: string = '', callback?: Function) {
    try {
      this.tagArticleList = []
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_tag_article_list', { id })) || {}
      this.loading = false
      let data = this.handleResult(result) || {}
      console.log('get tag article list result:', data)
      this.tagArticleList = data || []
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 获取归档下的文章
   */
  @action
  async getArchiveArticleList(yearName: string = '', monthName: string = '', callback?: Function) {
    try {
      this.tagArticleList = []
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_archive_article_list', { yearName, monthName })) || {}
      this.loading = false
      let data = this.handleResult(result) || {}
      console.log('get archive article list result:', data)
      this.tagArticleList = data || []
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 获取文章详情
   */
  @action
  async getDetail(id: string = '', callback?: Function) {
    try {
      this.detail = {}
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_article_detail', { id })) || {}
      this.loading = false
      let data = this.handleResult(result) || {}
      this.detail = data || {}
      let tags = (this.detail.tags || []).map((t: string = '') => {
        return { label: t || '', value: t || '' }
      })

      this.detail.tagOptions = tags || []
      console.log('get article detail result:', this.detail)
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  async onSaveOrUpdate(callback?: Function) {
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
        ...this.form
      }

      params.tags = Utils.deepCopy(this.form.tags || []).map((t: { [K: string]: any } = {}) => {
        return t.value || ''
      })

      if (!Utils.isObjectNull(this.detail || {})) {
        params.id = this.detail.id || ''
      }

      console.log('on save article params:', params)
      await info(`on save article params: ${JSON.stringify(params)}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('save_or_update_article', { article: params })) || {}
      this.loading = false
      let flag = this.handleResult(result)
      console.log('on save article result:', flag)
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

export default new NoteStore()

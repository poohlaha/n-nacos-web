/**
 * @fileOverview look store
 * @date 2023-07-03
 * @author poohlaha
 */
import BaseStore from '../base/base.store'
import { action, observable } from 'mobx'
import { invoke } from '@tauri-apps/api/core'
import { TOAST } from '@utils/base'
import Utils from '@utils/utils'
import { SYSTEM } from '@config/index'

class LookStore extends BaseStore {
  readonly size: number = 30

  @observable recentUsedList: Array<{ [K: string]: any }> = []
  @observable downloadList: Array<{ [K: string]: any }> = []
  @observable desktopList: Array<{ [K: string]: any }> = []
  @observable documentList: Array<{ [K: string]: any }> = []
  @observable pictureList: Array<{ [K: string]: any }> = []

  @observable activeDisplayName: string = 'list' // list | grid
  @observable pullLoading: boolean = false

  constructor() {
    super()
    this.onGetActiveDisplayName()
  }

  onSetActiveDisplayName(displayName: string = '') {
    this.activeDisplayName = displayName
    Utils.setLocal(SYSTEM.ACTIVE_DISPLAY_NAME, displayName || '')
  }

  onGetActiveDisplayName() {
    let activeDisplayName = Utils.getLocal(SYSTEM.ACTIVE_DISPLAY_NAME) || ''
    if (activeDisplayName !== 'list' && activeDisplayName !== 'grid') {
      this.activeDisplayName = 'list'
      this.onSetActiveDisplayName('list')
      return
    }

    this.activeDisplayName = activeDisplayName || ''
  }

  /**
   * 获取最近使用文件列表
   * sortBy: modified_desc | modified_asc | created_desc | created_asc
   */
  @action
  async getRecentUsedList(fileName: string = '') {
    try {
      this.loading = true
      let result: { [K: string]: any } =
        (await invoke('get_recent_used', {
          fileQuery: {
            fileName,
            currentPage: 1,
            pageSize: 0,
            sortBy: '',
            refresh: false
          }
        })) || {}
      this.loading = false
      console.log('get recent used list:', result)
      this.recentUsedList = this.handleResult(result) || []
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取最近使用文件列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 获取文稿列表
   */
  @action
  async getDocumentList(fileName: string = '', sortBy: string = '') {
    try {
      this.loading = true
      let result: { [K: string]: any } =
        (await invoke('get_document_list', {
          fileQuery: {
            currentPage: this.currentPage,
            pageSize: this.size,
            fileName,
            sortBy,
            refresh: false
          }
        })) || {}
      this.loading = false
      console.log('get document list:', result)
      let results = this.handleResult(result) || []
      this.documentList = this.documentList.concat(results.files || [])
      this.total = results.total
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取文稿列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 获取图片列表
   */
  @action
  async getPictureList(fileName: string = '', sortBy: string = '') {
    try {
      this.loading = true
      let result: { [K: string]: any } =
        (await invoke('get_pictures_list', {
          fileQuery: {
            currentPage: this.currentPage,
            pageSize: this.size,
            fileName,
            sortBy,
            refresh: false
          }
        })) || {}
      this.loading = false
      console.log('get picture list:', result)
      let results = this.handleResult(result) || []
      this.pictureList = this.pictureList.concat(results.files || [])
      this.total = results.total
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取图片列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 获取桌面列表
   */
  @action
  async getDesktopList(fileName: string = '', sortBy: string = '') {
    try {
      this.loading = true
      let result: { [K: string]: any } =
        (await invoke('get_desktop_list', {
          fileQuery: {
            currentPage: this.currentPage,
            pageSize: this.size,
            fileName,
            sortBy,
            refresh: false
          }
        })) || {}
      this.loading = false
      console.log('get desktop list:', result)
      let results = this.handleResult(result) || []
      this.desktopList = this.desktopList.concat(results.files || [])
      this.total = results.total
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取桌面列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 获取下载列表
   */
  @action
  async getDownloadList(fileName: string = '', sortBy: string = '', needLoading: boolean = true) {
    try {
      if (needLoading) {
        this.loading = true
      } else {
        this.pullLoading = true
      }

      let result: { [K: string]: any } =
        (await invoke('get_download_list', {
          fileQuery: {
            currentPage: this.currentPage,
            pageSize: this.size,
            fileName,
            sortBy,
            refresh: false
          }
        })) || {}
      this.pullLoading = false
      this.loading = false
      console.log('get download list:', result)
      let results = this.handleResult(result) || {}
      this.downloadList = this.downloadList.concat(results.files || [])
      this.total = results.total
    } catch (e: any) {
      this.pullLoading = false
      this.loading = false
      TOAST.show({ message: `获取下载列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }
}

export default new LookStore()

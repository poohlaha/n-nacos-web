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
  @observable recentUsedList: Array<{ [K: string]: any }> = []
  @observable downloadList: Array<{ [K: string]: any }> = []
  @observable desktopList: Array<{ [K: string]: any }> = []
  @observable documentList: Array<{ [K: string]: any }> = []
  @observable pictureList: Array<{ [K: string]: any }> = []

  @observable activeDisplayName: string = 'list' // list | grid

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
   */
  @action
  async getRecentUsedList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_recent_used', {})) || {}
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
  async getDocumentList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_document_list', {})) || {}
      this.loading = false
      console.log('get document list:', result)
      this.documentList = this.handleResult(result) || []
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
  async getPictureList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_pictures_list', {})) || {}
      this.loading = false
      console.log('get picture list:', result)
      this.pictureList = this.handleResult(result) || []
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
  async getDesktopList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_desktop_list', {})) || {}
      this.loading = false
      console.log('get desktop list:', result)
      this.desktopList = this.handleResult(result) || []
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
  async getDownloadList() {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_download_list', {})) || {}
      this.loading = false
      console.log('get download list:', result)
      this.downloadList = this.handleResult(result) || []
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `获取下载列表失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }
}

export default new LookStore()

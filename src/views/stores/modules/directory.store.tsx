/**
 * @fileOverview directory store
 * @date 2023-10-27
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import { invoke } from '@tauri-apps/api/core'

class DashboardStore extends BaseStore {
  @observable directoryInfo: any = [] // 系统信息
  @observable dir: string = '' // 目录
  readonly EXCLUDE_SUFFIX_LIST = ['jar', 'zip', 'tar', 'gz']
  readonly EXCLUDE_FILE_LIST = ['.DS_Store']
  readonly MAKE_FILE = 'Makefile'
  @observable fileData: string = ''
  @observable fileName: string = ''

  /**
   * 获取系统信息
   */
  @action
  async getDirectoryList() {
    this.loading = true
    let result: { [K: string]: any } = await invoke('get_listen_dir_info', { userId: this.userId })
    console.log('result:', result)
    this.loading = false
    let data = this.analysisResult(result, '')

    // 解析 data, 删除 children 为空的 children 键
    this.filterData(data.data)
    this.directoryInfo = data.data || []
    this.dir = data.dir
  }

  /**
   * 过滤当 children 为空时, 删除 children 键
   */
  @action
  filterData(result: Array<{ [K: string]: any }> = []) {
    for (let data of result) {
      let children = data.children || []
      if (children.length === 0) {
        delete data.children
      } else {
        this.filterData(data.children || [])
      }
    }
  }

  @action
  async getFileData(path: string, name: string) {
    this.loading = true
    let result: { [K: string]: any } = (await invoke('get_listen_file_content', { path, userId: this.userId })) || ''
    this.loading = false
    console.log('result:', result)

    let data = this.analysisResult(result, '')
    data = data
      .replace(/^"/, '') // 去掉开头的双引号
      .replace(/"$/, '') // 去掉末尾的双引号
      .replace(/\\"/g, '"') // 将多次转义的双引号还原为单次转义的双引号
    data = data.replace(/\\n/g, '\n') || ''
    data = data.replace(/\\t/g, '    ') || ''

    this.fileData = data
    console.log('file data:', this.fileData)
    this.fileName = name
  }
}

export default new DashboardStore()

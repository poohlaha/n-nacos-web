/**
 * @fileOverview nginx store
 * @date 2023-07-04
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import BackUrls from '@route/router.back.toml'

class NginxStore extends BaseStore {
  @observable fileData: { [K: string]: any } = {} // 系统信息
  @observable data: Array<{ [K: string]: any }> = []

  // 表头
  readonly tableHeaders: any = [
    {
      title: '属性名称',
      dataIndex: 'propName',
      key: 'propName',
      width: '40%'
    },
    {
      title: '属性值',
      dataIndex: 'propValue',
      key: 'propValue'
    }
  ]

  /**
   * 获取系统信息
   */
  @action
  async getFileData(callback?: any) {
    this.loading = true
    this.fileData = {}
    //@ts-ignore
    return await $http.post({
      url: BackUrls.GET_NGINX_FILE_URL,
      data: {},
      success: (res: { [K: string]: any } = {}) => {
        this.loading = false
        this.fileData = res
        callback?.()
      },
      fail: () => (this.loading = false)
    })
  }

  /**
   * 获取树节点
   */
  async getList() {
    this.loading = true
    this.fileData = {}
    //@ts-ignore
    return await $http.post({
      url: BackUrls.GET_NGINX_LIST_URL,
      data: {},
      success: (res: Array<{ [K: string]: any }> = []) => {
        this.loading = false
        this.data = res || []
      },
      fail: () => (this.loading = false)
    })
  }
}

export default new NginxStore()

/**
 * @fileOverview base store, all store muse extends this store
 * @date 2023-04-12
 * @author poohlaha
 */
import {action, observable} from 'mobx'

export default class BaseStore {
  @observable loading: boolean = false
  @observable currentPage: number = 1
  @observable pageSize: number = 10
  @observable userId: string = '1f09cf1a-6359-4284-8a63-8e56ba0c30eb'

  /**
   * 设置属性
   */
  @action
  setProperty = (property: any, value: any) => {
    // @ts-ignore
    this[property] = value
  }

  /**
   * 获取属性
   */
  @action
  getProperty = (property: any) => {
    // @ts-ignore
    return this[property]
  }

}

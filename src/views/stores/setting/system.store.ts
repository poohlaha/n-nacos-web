/**
 * @fileOverview system store
 * @date 2023-07-03
 * @author poohlaha
 */
import BaseStore from '../base/base.store'
import { observable } from 'mobx'

class SystemStore extends BaseStore {
  readonly FONT_FAMILY_LIST: Array<{ [K: string]: any }> = [
    {
      label: '阿里妈妈方圆体',
      value: 'Alimama'
    },
    {
      label: '阿里健康体2.0',
      value: 'AlibabaHealthFont2'
    },
    {
      label: '阿里妈妈刀隶体',
      value: 'AlimamaDaoLiTi'
    },
    {
      label: '阿里妈妈东方大楷',
      value: 'Alimama_DongFangDaKai'
    }
  ]

  readonly MIN_FONT_SIZE = 12
  readonly MAX_FONT_SIZE = 24

  @observable selectedFontFamily: string = this.FONT_FAMILY_LIST[0].value
  @observable fontSize: number = 14
  @observable startAuto: boolean = false
}

export default new SystemStore()

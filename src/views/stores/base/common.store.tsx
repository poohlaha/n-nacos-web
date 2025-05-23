/**
 * @fileOverview common store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import { CONSTANT, SYSTEM } from '@config/index'
import BaseStore from '../base/base.store'
import Utils from '@utils/utils'

class CommonStore extends BaseStore {
  @observable skin = CONSTANT.SKINS[0] // 皮肤
  @observable socket: WebSocket | null = null // web socket
  @observable data: { [K: string]: any } = {} // 接收的数据
  @observable language: string = ''

  /**
   * 切换皮肤
   * @param index
   */
  @action
  onSkinChange(index: number = -1) {
    if (index === -1) {
      this.skin = this.skin === CONSTANT.SKINS[1] ? CONSTANT.SKINS[0] : CONSTANT.SKINS[1]
    } else {
      this.skin = CONSTANT.SKINS[index]
    }

    Utils.setLocal(SYSTEM.THEME_NAME, this.skin)
  }

  /**
   * 获取皮肤
   */
  onGetSkin() {
    let skin = Utils.getLocal(SYSTEM.THEME_NAME) || ''
    if (Utils.isBlank(skin || '')) {
      skin = CONSTANT.SKINS[0]
    }

    this.skin = skin
  }

  /**
   * 判断是不是黑色
   */
  onJudgeDark() {
    return this.skin === CONSTANT.SKINS[1]
  }
}

export default new CommonStore()

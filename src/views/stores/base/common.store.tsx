/**
 * @fileOverview common store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import {CONSTANT} from '@config/index'
import Utils from '@utils/utils'

class CommonStore {
  @observable skin = CONSTANT.SKINS[0] // 皮肤
  @observable socket: WebSocket | null = null // web socket
  @observable data: {[K: string]: any} = {} // 接收的数据

  constructor() {
    if (!window.WebSocket) {
      console.warn('当前浏览器不支持socket !')
      return
    }

    this.initSocket()
  }

  /**
   * 初始化 socket
   */
  initSocket() {
    let address = process.env.WEB_SOCKET_URL || ''
    if (Utils.isBlank(address)) return

    this.socket = new WebSocket(address)
    this.onOpen()
    this.onReceiveMessage()
    this.onSocketClose()
    this.onSocketError()
  }

  /**
   * 打开
   */
  onOpen() {
    if (!this.socket) return

    this.socket.onopen = function () {
      console.log('WebSocket连接已建立!');
    }
  }

  /**
   * 发送消息
   */
  onSendMessage(message: {[K: string]: any}) {
    setTimeout(() => {
      if (!this.socket) return
      console.log('socket state', this.socket.readyState)
      if (this.socket.readyState === WebSocket.OPEN) {
        console.log('向服务端发送数据: ', JSON.stringify(message));
        this.socket.send(JSON.stringify(message))
      }
    }, 500);
  }

  /**
   * 接收消息
   */
  onReceiveMessage() {
    if (!this.socket) return
    this.socket.onmessage = (event: MessageEvent<any>) => {
      let data = event.data
      if (typeof data === 'string') {
        data = JSON.parse(data) || {}
      }

      if (Utils.isObjectNull(data)) {
        console.warn('收到来自服务端的数据为空!')
        return
      }

      if (data.code !== 200) {
        console.error('接收来自服务端的数据异常: ', data.error || '')
        return
      }

      this.data = data.data || {};
      console.log('收到来自服务端的数据:', this.data);
    };
  }

  /**
   * 关闭 socket
   */
  onSocketClose() {
    if (!this.socket) return
    this.socket.onclose = () => {
      console.log('WebSocket连接已关闭!');
    }
  }

  /**
   * socket 异常
   */
  onSocketError() {
    if (!this.socket) return
    this.socket.onerror = (error) => {
      console.error('WebSocket连接发生错误:', error);
    }
  }


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
  }
}

export default new CommonStore()

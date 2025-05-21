/**
 * @fileOverview 创建窗口
 * @date 2023-08-28
 * @author poohlaha
 */
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

export interface IWindowProps {
  label: string // 窗口Label(惟一)
  title: string // 标题
  url: string // 地址
  width?: string // 窗口宽度
  height?: string // 窗口高度
  minWidth?: number // 窗口最小宽度
  minHeight?: number // 窗口最小高度
  x?: number // 窗口相对于屏幕左侧坐标
  y?: number // 窗口相对于屏幕顶端坐标
  skipTaskbar?: boolean
  center?: boolean // 窗口居中显示
  resizable?: boolean // 是否支持缩放
  maximized?: boolean // 最大化窗口
  decorations?: boolean // 窗口是否装饰边框及导航条
  alwaysOnTop?: boolean // 置顶窗口
  dragDropEnabled?: boolean // 禁止系统拖放
  visible?: boolean // 隐藏窗口
  focus?: boolean
}

export class Window {
  private window: WebviewWindow | null = null

  constructor() {
    this.window = null
  }

  async create(props: IWindowProps) {
    // 判断窗口是否存在
    const existWindow = await this.getWindowByLabel(props.label)
    if (existWindow) {
      console.log(`${props.label || ''}已存在`)
      return
    }

    // 创建窗口对象
    this.window = new WebviewWindow(props.label, props as any)
    // 窗口创建完毕/失败
    await this.window?.once('tauri://created', async () => {
      console.log('tauri://created')
      // 是否主窗口
      if (props.label.indexOf('main') > -1) {
        // ...
      }

      // 是否最大化
      if (props.maximized && props.resizable) {
        console.log('maximized')
        await this.window?.maximize()
      }
    })

    await this.window?.once('tauri://error', async error => {
      console.log('window create error: ', error)
    })
  }

  // 获取窗口
  async getWindowByLabel(label: string) {
    return await WebviewWindow.getByLabel(label)
  }

  getWindow() {
    return this.window
  }
}

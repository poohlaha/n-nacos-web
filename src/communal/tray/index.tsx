/**
 * @fileOverview 注册托盘
 * @date 2023-08-28
 * @author poohlaha
 */

import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import RouterUrls from '@route/router.url.toml'
import { listen } from '@tauri-apps/api/event'
import { LogicalPosition } from '@tauri-apps/api/dpi'
import { IWindowProps } from '@communal/tray/window'
import { createWindow } from './window'

export const MenuWidth = 150
export const MenuHeight = 150

class TrayMenu {
  trayToggleTimer: NodeJS.Timeout | null = null

  async create() {
    await createWindow({
      url: RouterUrls.SDK.TRAY.MENU.URL,
      label: 'trayMenu',
      title: '',
      skipTaskbar: true,
      decorations: false,
      center: false,
      resizable: false,
      alwaysOnTop: true,
      focus: true,
      x: window.screen.width + 50,
      y: window.screen.height + 50,
      width: MenuWidth,
      height: 10,
      minHeight: 96,
      maxHeight: 400,
      visible: false
    } as IWindowProps)
  }

  // 监听
  async addListen() {
    await this.addListenClick()
    // await this.addListenBlur()
  }

  async addListenClick() {
    await listen('tray_contextmenu', async event => {
      if (this.trayToggleTimer) return
      console.log('listen tray_contextmenu...', event)

      this.trayToggleTimer = setTimeout(() => {
        this.trayToggleTimer = null
      }, 300) // 300ms 内只触发一次

      const trayWindow = await WebviewWindow.getByLabel('trayMenu')
      if (!trayWindow) {
        await this.create()
      }

      let position: any = event.payload || { x: 100, y: 100 }
      if (trayWindow) {
        const isVisible = await trayWindow.isVisible()
        if (!isVisible) {
          await trayWindow.setAlwaysOnTop(true)
          await trayWindow.setPosition(new LogicalPosition(position.x, position.y))
          await trayWindow.show()
          setTimeout(async () => {
            await trayWindow.setFocus()
          }, 100)
        } else {
          await trayWindow.hide()
          await trayWindow.setAlwaysOnTop(false)
        }
      }
    })
  }

  // 监听失去焦点事件
  async addListenBlur() {
    await listen('tray-ready', async () => {
      console.log('Tray Window Has Created !')
      const trayWindow = await WebviewWindow.getByLabel('trayMenu')
      if (!trayWindow) {
        return
      }

      await trayWindow.listen('tauri://blur', async () => {
        setTimeout(async () => {
          const isFocused = await trayWindow.isFocused()
          if (!isFocused) {
            await trayWindow.hide()
            await trayWindow.setAlwaysOnTop(false)
          }
        }, 150)
      })
    })
  }
}

const createTrayMenu = async () => {
  const trayMenu = new TrayMenu()
  await trayMenu.create()
  await trayMenu.addListen()
}

export default createTrayMenu

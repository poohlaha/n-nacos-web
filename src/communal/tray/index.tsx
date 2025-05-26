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

export default async function createTrayMenu() {
  console.log('Start create tray menu')

  const createMenu = async () => {
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
      width: 150,
      height: 10,
      minHeight: 96,
      maxHeight: 400,
      visible: false
    } as IWindowProps)
  }

  // 监听托盘事件
  await listen('tray_contextmenu', async event => {
    console.log('listen tray_contextmenu...', event)

    const trayWindow = await WebviewWindow.getByLabel('trayMenu')
    if (!trayWindow) {
      await createMenu()
    }

    let position: any = event.payload || { x: 100, y: 100 }
    if (trayWindow) {
      const isVisible = await trayWindow.isVisible()
      if (!isVisible) {
        await trayWindow.setAlwaysOnTop(true)
        await trayWindow.setFocus()
        await trayWindow.setPosition(new LogicalPosition(position.x, position.y))
        await trayWindow.show()
      } else {
        await trayWindow.hide()
        await trayWindow.setAlwaysOnTop(false)
      }
    }
  })
}

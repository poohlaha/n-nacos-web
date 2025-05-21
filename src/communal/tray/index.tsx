/**
 * @fileOverview 注册托盘
 * @date 2023-08-28
 * @author poohlaha
 */

import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import RouterUrls from '@route/router.url.toml'

export const MenuWidth = 150
export const MenuHeight = 150

export default async function createTrayMenu() {
  console.log('Start create tray menu')

  let trayWindow = new WebviewWindow('trayMenu', {
    url: RouterUrls.SDK.TRAY.MENU.URL,
    skipTaskbar: true,
    decorations: false,
    center: false,
    resizable: false,
    alwaysOnTop: true,
    focus: true,
    x: window.screen.width + 50,
    y: window.screen.height + 50,
    visible: false
  })

  await new Promise(resolve => {
    trayWindow?.once('tauri://ready', () => {
      console.log('TrayMenu window is ready')
      resolve(true)
    })
  })

  await trayWindow.listen('tauri://window-created', async () => {
    console.log('Tray menu create')
  })

  await trayWindow.listen('tauri://blur', async () => {
    console.log('Tray menu blur')
    await trayWindow?.hide()
  })

  await trayWindow.listen('tauri://error', async error => {
    console.log('Tray menu error!', error)
  })

  /*
        let _window = new Window()
        await _window.create({
          url: RouterUrls.SDK.TRAY.MENU.URL,
          skipTaskbar: true,
          decorations: false,
          center: false,
          resizable: false,
          alwaysOnTop: true,
          focus: true,
          x: window.screen.width + 50,
          y: window.screen.height + 50,
          visible: false
        } as IWindowProps)
        trayWindow = _window.getWindow()
         */
  /*
  // 托盘消息事件
  await webview.listen('tauri://window-created', async () => {
    console.log('Tray menu create')
  })

  await webview.listen('tauri://blur', async () => {
    console.log('Tray menu blur')
    const win = await WebviewWindow.getByLabel('trayMenu')
    await win?.hide()
  })


  await webview.listen('tauri://error', async error => {
    console.log('Tray menu error!', error)
  })
   */
}

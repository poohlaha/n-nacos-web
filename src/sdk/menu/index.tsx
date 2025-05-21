/**
 * @fileOverview Tray Menu
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { exit } from '@tauri-apps/plugin-process'

const TrayMenu = (): ReactElement => {
  const onHideTrayMenu = async () => {
    // 隐藏托盘菜单
    const trayWindow = await WebviewWindow.getByLabel('trayMenu')
    await trayWindow?.hide()
  }

  // 显示主窗口
  const onShowMainWindow = async () => {
    await onHideTrayMenu()

    // 显示主窗口
    const mainWindow = await WebviewWindow.getByLabel('main')
    await mainWindow?.show()
    await mainWindow?.unminimize()
    await mainWindow?.setFocus()
  }

  // 退出
  const onQuit = async () => {
    await onHideTrayMenu()
    await exit(0)
  }

  const render = () => {
    return (
      <div className="w-32 flex-direction-column">
        <p className="h-8">应用程序</p>
        <p className="h-8" onClick={async () => await onShowMainWindow()}>
          显示
        </p>
        <p className="h-8" onClick={async () => await onQuit()}>
          退出
        </p>
      </div>
    )
  }

  return render()
}

export default observer(TrayMenu)

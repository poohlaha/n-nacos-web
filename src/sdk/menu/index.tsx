/**
 * @fileOverview Tray Menu
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { exit } from '@tauri-apps/plugin-process'
import { LogicalSize } from '@tauri-apps/api/dpi'
import useMount from '@hooks/useMount'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

const TrayMenu = (): ReactElement => {
  useMount(async () => {
    await listen('tauri://blur', async () => {
      let currentWindow = getCurrentWindow()
      let focused = await currentWindow.isFocused()
      if (!focused) {
        setTimeout(async () => {
          console.log('[Tray Menu] blur and hiding self...')
          await currentWindow.hide()
          await currentWindow.setAlwaysOnTop(false)
        }, 100)
      }
    })
  })

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

  //@ts-ignore
  const onExpandWindow = async () => {
    const trayWindow = await WebviewWindow.getByLabel('trayMenu')
    if (!trayWindow) return
    await trayWindow.setSize(new LogicalSize(240, 96)) // 展开
  }

  //@ts-ignore
  const onCollapseWindow = async () => {
    const trayWindow = await WebviewWindow.getByLabel('trayMenu')
    if (!trayWindow) return
    await trayWindow.setSize(new LogicalSize(120, 96)) // 收起
  }

  const render = () => {
    // let applicationList = homeStore.applicationList || []
    return (
      <div className="w100 flex-direction-column">
        {/*
        <div className="menu w100 h-8 flex-align-center bg-menu-hover cursor-pointer pl-4 pr-4 relative flex-jsc-between">
          <p onMouseEnter={onExpandWindow} onMouseLeave={onCollapseWindow}>
            应用程序
          </p>

          {applicationList.length > 0 && (
            <div className="w-8 h-8 p-2">
              <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M761.8048 520.7552c0 14.1824-5.2736 28.5696-16.128 39.68l-370.2272 380.8768a57.1392 57.1392 0 0 1-80.4864 1.1776 56.832 56.832 0 0 1-1.1776-80.4864l370.2272-380.9792a57.0368 57.0368 0 0 1 97.792 39.7312z"
                  fill="currentColor"
                ></path>
                <path
                  d="M761.8048 503.2448a56.9344 56.9344 0 0 1-97.792 39.68l-370.2272-380.928a56.832 56.832 0 0 1 1.1264-80.4864 57.088 57.088 0 0 1 80.4864 1.1264l370.2272 380.928c10.9056 11.1104 16.1792 25.4976 16.1792 39.68z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          )}

          {applicationList.length > 0 && (
            <div className="sub-menu-list absolute left-[100%] top-0">
              {applicationList.map((item: { [K: string]: any } = {}, index: number) => {
                return (
                  <div
                    className="sub-menu flex-align-center h-8 flex-align-center bg-menu-hover cursor-pointer pl-4 pr-4 relative"
                    key={index}
                  >
                    <img className="w-4 h-4 mr-2" src={item.icon || ''} />
                    <p>{item.name || ''}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
         */}

        <div
          className="w100 menu h-8 flex-align-center bg-menu-hover cursor-pointer pl-4 pr-4"
          onClick={async () => await onShowMainWindow()}
        >
          显示
        </div>
        <div
          className="w100 menu h-8 flex-align-center bg-menu-hover cursor-pointer pl-4 pr-4"
          onClick={async () => await onQuit()}
        >
          退出
        </div>
      </div>
    )
  }

  return render()
}

export default observer(TrayMenu)

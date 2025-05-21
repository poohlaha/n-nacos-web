/**
 * @fileOverview SQL
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import RouterUrls from '@route/router.url.toml'
import Page from '@views/modules/page'
import { useStore } from '@views/stores'
import { Select, Slider, Switch } from 'antd'

const System = (): ReactElement => {
  const { systemStore } = useStore()

  const render = () => {
    return (
      <Page
        className="system-page wh100 overflow background-gay"
        loading={systemStore.loading}
        contentClassName="content-box wh100 flex-direction-column"
      >
        {/* title */}
        <div className="page-title flex-align-center">
          <p className="flex-1 font-bold text-xl">{RouterUrls.SETTING.SYSTEM.NAME}</p>
        </div>

        <div className="page-wrapper flex-1 flex-direction-column pt-5">
          <div className="flex-direction-column">
            <p>主题与字体</p>
            <div className="bg-white p-4 text-sm mt-2 rounded">
              <div className="flex-align-center flex-jsc-between mb-2">
                <p>主题切换</p>
                <div className="flex-align-center border pl-2 pr-2 pt-1 pb-1 rounded-full">
                  <div className="bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full">跟随系统</div>
                  <div className="bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full theme-bg text-white">
                    浅色
                  </div>
                  <div className="bg-menu-hover cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full">深色</div>
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between mb-2">
                <p>字体设置</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    style={{ width: 200 }}
                    value={systemStore.selectedFontFamily}
                    options={systemStore.FONT_FAMILY_LIST || []}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Slider
                    className="m-ant-slider"
                    style={{ width: 200 }}
                    min={systemStore.MIN_FONT_SIZE}
                    max={systemStore.MAX_FONT_SIZE}
                    step={1}
                    value={systemStore.fontSize}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-direction-column mt-5">
            <p>系统</p>
            <div className="bg-white p-4 text-sm mt-2 rounded">
              <div className="flex-align-center flex-jsc-between">
                <p>开机启动</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1 rounded-full">
                  <Switch
                    className="m-ant-switch"
                    onChange={() => (systemStore.startAuto = !systemStore.startAuto)}
                    value={systemStore.startAuto}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(System)

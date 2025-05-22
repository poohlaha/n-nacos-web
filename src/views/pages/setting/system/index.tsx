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
import { Select, Switch } from 'antd'

const System = (): ReactElement => {
  const { systemStore, commonStore } = useStore()

  const render = () => {
    return (
      <Page
        className="system-page wh100 overflow background-gay"
        loading={systemStore.loading}
        contentClassName="content-box wh100 flex-direction-column"
        title={{
          label: RouterUrls.SETTING.SYSTEM.NAME
        }}
      >
        <div className="page-wrapper flex-1 flex-direction-column pt-5">
          <div className="flex-direction-column">
            <p className={`${systemStore.font.titleFontSize || ''} font-bold`}>主题与字体</p>
            <div className="background p-4 mt-2 rounded">
              <div className="flex-align-center flex-jsc-between mb-2">
                <p>主题切换</p>
                <div className="flex-align-center border pl-2 pr-2 pt-1 pb-1 rounded-full">
                  <div className="bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full">跟随系统</div>
                  <div className="bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full theme-bg text-white">
                    浅色
                  </div>
                  <div
                    className="bg-menu-hover cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full"
                    onClick={() => commonStore.onSkinChange()}
                  >
                    深色
                  </div>
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between mb-2 border-bottom pb-2">
                <p>字体设置</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    style={{ width: 200 }}
                    value={systemStore.font.fontFamily}
                    options={systemStore.FONT_FAMILY_LIST || []}
                    onChange={(value: string = '') => (systemStore.font.fontFamily = value || '')}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>标题类字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select"
                    style={{ width: 200 }}
                    value={systemStore.font.titleFontSize}
                    options={systemStore.FONT_LIST || []}
                    optionRender={option => {
                      return (
                        <div className="flex-direction-column border-bottom p-2">
                          <p className="mb-2">{option.value || ''}</p>
                          <div className={`${option.value || ''}`}>我是字体</div>
                        </div>
                      )
                    }}
                    onChange={(value: string = '') => (systemStore.font.titleFontSize = value || '')}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select"
                    style={{ width: 200 }}
                    value={systemStore.font.fontSize}
                    options={systemStore.FONT_LIST || []}
                    optionRender={option => {
                      return (
                        <div className="flex-direction-column border-bottom p-2">
                          <p className="mb-2">{option.value || ''}</p>
                          <div className={`${option.value || ''}`}>我是字体</div>
                        </div>
                      )
                    }}
                    onChange={(value: string = '') => (systemStore.font.fontSize = value || '')}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>描述类字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select"
                    style={{ width: 200 }}
                    value={systemStore.font.descFontSize}
                    options={systemStore.FONT_LIST || []}
                    optionRender={option => {
                      return (
                        <div className="flex-direction-column border-bottom p-2">
                          <p className="mb-2">{option.value || ''}</p>
                          <div className={`${option.value || ''}`}>我是字体</div>
                        </div>
                      )
                    }}
                    onChange={(value: string = '') => (systemStore.font.descFontSize = value || '')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-direction-column mt-5">
            <p className={`${systemStore.font.titleFontSize || ''} font-bold`}>系统</p>
            <div className="background p-4 mt-2 rounded">
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

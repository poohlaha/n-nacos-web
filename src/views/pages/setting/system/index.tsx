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
import { CONSTANT } from '@config/index'

const System = (): ReactElement => {
  const { systemStore, commonStore } = useStore()

  const render = () => {
    return (
      <Page
        className="system-page wh100 overflow background-right color"
        loading={systemStore.loading}
        contentClassName="content-box wh100 flex-direction-column"
        title={{
          label: RouterUrls.SETTING.SYSTEM.NAME
        }}
      >
        <div className="page-wrapper flex-1 flex-direction-column pt-5">
          <div className="flex-direction-column bg-card p-4 rounded-md">
            <p className="font-bold">主题与字体</p>
            <div className="p-4 mt-2 rounded-md">
              <div className="flex-align-center flex-jsc-between mb-2">
                <p>主题切换</p>
                <div className="flex-align-center border pl-2 pr-2 pt-1 pb-1 rounded-full">
                  <div
                    className={`bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full ${commonStore.skin === CONSTANT.SKINS[2] ? 'theme-bg' : ''}`}
                    onClick={async () => {
                      commonStore.onSkinChange(2)
                      await systemStore.onSave(commonStore.skin)
                    }}
                  >
                    跟随系统
                  </div>
                  <div
                    className={`bg-menu-hover mr-2 cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full border-0 ${commonStore.skin === CONSTANT.SKINS[0] ? 'theme-bg' : ''}`}
                    onClick={async () => {
                      commonStore.onSkinChange(0)
                      await systemStore.onSave(commonStore.skin)
                    }}
                  >
                    浅色
                  </div>
                  <div
                    className={`bg-menu-hover cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-full border-0 ${commonStore.skin === CONSTANT.SKINS[1] ? 'theme-bg' : ''}`}
                    onClick={async () => {
                      commonStore.onSkinChange(1)
                      await systemStore.onSave(commonStore.skin)
                    }}
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
                    rootClassName="m-ant-select-dropdown"
                    style={{ width: 200 }}
                    value={systemStore.font.fontFamily}
                    options={systemStore.FONT_FAMILY_LIST || []}
                    onChange={async (value: string = '') => {
                      systemStore.font.fontFamily = value || ''
                      await systemStore.onSave(commonStore.skin)
                    }}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>标题类字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select m-ant-select-dropdown"
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
                    onChange={async (value: string = '') => {
                      systemStore.font.titleFontSize = value || ''
                      await systemStore.onSave(commonStore.skin)
                    }}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select m-ant-select-dropdown"
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
                    onChange={async (value: string = '') => {
                      systemStore.font.fontSize = value || ''
                      await systemStore.onSave(commonStore.skin)
                    }}
                  />
                </div>
              </div>

              <div className="flex-align-center flex-jsc-between">
                <p>描述类字体大小</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1">
                  <Select
                    className="m-ant-select"
                    rootClassName="font-select m-ant-select-dropdown"
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
                    onChange={async (value: string = '') => {
                      systemStore.font.descFontSize = value || ''
                      await systemStore.onSave(commonStore.skin)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-direction-column mt-5 bg-card p-4 rounded-md">
            <p className="font-bold">系统</p>
            <div className="p-4 mt-2 rounded-md">
              <div className="flex-align-center flex-jsc-between">
                <p>开机启动</p>
                <div className="flex-align-center pl-2 pr-2 pt-1 pb-1 rounded-full">
                  <Switch
                    className="m-ant-switch"
                    onChange={async () => await systemStore.onAutoStart(commonStore.skin)}
                    value={systemStore.autoStart}
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

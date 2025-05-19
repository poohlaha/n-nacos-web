/**
 * @fileOverview 文件查看
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import RouterUrls from '@route/router.url.toml'
import Page from '@views/modules/page'
import useMount from '@hooks/useMount'
import { useStore } from '@views/stores'
import { Tabs, Input } from 'antd'
import Utils from '@utils/utils'
import NoData from '@views/components/noData'
import MTable from '@views/modules/table'

const QuickLook = (): ReactElement => {
  const { lookStore } = useStore()
  const [activeTabKey, setActiveTabKey] = useState('tab1')

  useMount(async () => {
    await lookStore.getRecentUsedList()
  })

  /**
   * 列表展示
   */
  const getListDisplayIcon = () => {
    return (
      <div
        className={`svg-box color-svg ml-2 w-8 h-8 p-1 cursor-pointer rounded bg-menu-hover ${lookStore.activeDisplayName === 'list' ? 'bg-menu-active' : ''}`}
        onClick={() => lookStore.onSetActiveDisplayName('list')}
      >
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M288 160h640v96H288zM288 464h640v96H288zM288 768h640v96H288z" fill="currentColor"></path>
          <path d="M160 208m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor"></path>
          <path d="M160 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor"></path>
          <path d="M160 816m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor"></path>
        </svg>
      </div>
    )
  }

  /**
   * 网格展示
   */
  const getGridDisplayIcon = () => {
    return (
      <div
        className={`svg-box color-svg w-8 h-8 p-1 cursor-pointer rounded bg-menu-hover ${lookStore.activeDisplayName === 'grid' ? 'bg-menu-active' : ''}`}
        onClick={() => lookStore.onSetActiveDisplayName('grid')}
      >
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M416 85.333333H138.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v277.333333a53.393333 53.393333 0 0 0 53.333334 53.333333h277.333333a53.393333 53.393333 0 0 0 53.333333-53.333333V138.666667a53.393333 53.393333 0 0 0-53.333333-53.333334z m10.666667 330.666667a10.666667 10.666667 0 0 1-10.666667 10.666667H138.666667a10.666667 10.666667 0 0 1-10.666667-10.666667V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h277.333333a10.666667 10.666667 0 0 1 10.666667 10.666667z m458.666666-330.666667H608a53.393333 53.393333 0 0 0-53.333333 53.333334v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333333h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333333V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z m10.666667 330.666667a10.666667 10.666667 0 0 1-10.666667 10.666667H608a10.666667 10.666667 0 0 1-10.666667-10.666667V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h277.333333a10.666667 10.666667 0 0 1 10.666667 10.666667zM416 554.666667H138.666667a53.393333 53.393333 0 0 0-53.333334 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333334 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333333-53.333334V608a53.393333 53.393333 0 0 0-53.333333-53.333333z m10.666667 330.666666a10.666667 10.666667 0 0 1-10.666667 10.666667H138.666667a10.666667 10.666667 0 0 1-10.666667-10.666667V608a10.666667 10.666667 0 0 1 10.666667-10.666667h277.333333a10.666667 10.666667 0 0 1 10.666667 10.666667z m458.666666-330.666666H608a53.393333 53.393333 0 0 0-53.333333 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333334V608a53.393333 53.393333 0 0 0-53.333334-53.333333z m10.666667 330.666666a10.666667 10.666667 0 0 1-10.666667 10.666667H608a10.666667 10.666667 0 0 1-10.666667-10.666667V608a10.666667 10.666667 0 0 1 10.666667-10.666667h277.333333a10.666667 10.666667 0 0 1 10.666667 10.666667z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    )
  }

  const getFileIcon = (text: string = '') => {
    return (
      <div className={`svg-box relative w100 flex-center ${lookStore.activeDisplayName === 'grid' ? 'h-24' : 'h-6'}`}>
        <svg className="wh100 color-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M642 673.1H301.6c-9.9 0-17.9-8-17.9-17.9s8-17.9 17.9-17.9H642c9.9 0 17.9 8 17.9 17.9s-8 17.9-17.9 17.9zM642 511.8H301.6c-9.9 0-17.9-8-17.9-17.9 0-9.9 8-17.9 17.9-17.9H642c9.9 0 17.9 8 17.9 17.9 0 9.9-8 17.9-17.9 17.9zM480.7 350.6H301.6c-9.9 0-17.9-8-17.9-17.9s8-17.9 17.9-17.9h179.2c9.9 0 17.9 8 17.9 17.9s-8.1 17.9-18 17.9zM874.9 350.6H695.7c-49.4 0-89.6-40.2-89.6-89.6V81.9c0-9.9 8-17.9 17.9-17.9 9.9 0 17.9 8 17.9 17.9V261c0 29.6 24.1 53.7 53.7 53.7h179.2c9.9 0 17.9 8 17.9 17.9s-7.9 18-17.8 18z"
            fill="currentColor"
          ></path>
          <path
            d="M794.3 959.7H221c-49.4 0-89.6-40.2-89.6-89.6V153.5c0-49.4 40.2-89.6 89.6-89.6h403.1c4.8 0 9.3 1.9 12.7 5.2L887.6 320c3.4 3.4 5.2 7.9 5.2 12.7v537.5c0 52.7-51.9 89.5-98.5 89.5zM221 99.8c-29.6 0-53.7 24.1-53.7 53.7v716.6c0 29.6 24.1 53.7 53.7 53.7h573.3c29 0 62.7-23.5 62.7-53.7v-530L616.7 99.8H221z"
            fill="currentColor"
          ></path>
        </svg>

        {!Utils.isBlank(text || '') && <p className="absolute bottom-3 flex-center text-xs color-desc">{text || ''}</p>}
      </div>
    )
  }

  const getTabs = () => {
    return [
      {
        label: '最近使用',
        key: 'tab1',
        children: getRecentUsedHtml()
      },
      {
        label: '桌面',
        key: 'tab2',
        children: getDesktopHtml()
      },
      {
        label: '文稿',
        key: 'tab3',
        children: getDocumentHtml()
      },
      {
        label: '图片',
        key: 'tab4',
        children: getPictureHtml()
      },
      {
        label: '下载',
        key: 'tab5',
        children: getDownloadHtml()
      }
    ]
  }

  /**
   * 根据文件类型获取 ICON
   */
  const getIconByFileType = (fileInfo: { [K: string]: any } = {}, needText: boolean = true) => {
    if (!Utils.isBlank(fileInfo.fileThumbnailPath || '')) {
      return (
        <div className={`${lookStore.activeDisplayName === 'grid' ? 'h-24' : 'h-6'} flex-align-center`}>
          <div
            className={`svg-box w100 ${lookStore.activeDisplayName === 'grid' ? 'max-h-24 p-2' : 'max-h-6 p-1'} shadow`}
          >
            <img
              src={fileInfo.fileThumbnailPath || ''}
              className={`${lookStore.activeDisplayName === 'grid' ? 'max-h-20' : 'max-h-4'} border`}
            />
          </div>
        </div>
      )
    }

    let fileKind = fileInfo.fileKind || ''
    fileKind = fileKind.replaceAll('"', '').trim() // 替换引号

    if (fileKind.toLowerCase() === 'dir') {
      return (
        <div className="svg-box relative w100 flex-center w-4 max-w-4 min-w-4">
          <svg className="wh100 folder-color" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1099.433546 289.842983h-1.08787v-99.462424a128.679511 128.679511 0 0 0-93.246023-126.65918v-3.263611A60.454505 60.454505 0 0 0 944.023508 0.003264H729.246837A60.454505 60.454505 0 0 0 668.326102 59.836128H122.526051A126.65918 126.65918 0 0 0 0.062941 190.380559V890.502778a12.277393 12.277393 0 0 0 2.331151 6.216401v1.243281c0 72.110257 46.623011 126.03754 113.760147 126.03754H969.821575c67.603366 0 105.212595-68.225006 122.463109-130.544431L1174.652004 419.610365c18.182974-75.063048-7.459682-129.767381-75.218458-129.767382z m-897.337556 0a160.072339 160.072339 0 0 0-132.253942 78.637479v-124.32803a73.198128 73.198128 0 0 1 46.623011-54.859743H668.326102a60.609915 60.609915 0 0 1 60.454505-59.988274h215.242901a60.609915 60.609915 0 0 1 60.454505 60.609914v3.108201a126.50377 126.50377 0 0 1 90.604052 97.908324z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      )
    }

    let filename = fileInfo.fileName || ''
    filename = filename.replaceAll('"', '').trim() // 替换引号

    let text = ''
    const match = fileKind.match(/^([A-Za-z\s]+)/)
    if (match) {
      text = match[0].trim()
      if (text.indexOf(' ') !== -1) {
        let names = text.split(' ') || []
        if (names.length > 0) {
          text = names[0] || ''
        }
      }
    } else if (filename.indexOf('.') !== -1) {
      let names = filename.split('.') || []
      if (names.length > 1) {
        text = names[1] || ''
      }
    }

    return getFileIcon(needText ? text : '')
  }

  const getItemHtml = (list: Array<{ [K: string]: any }> = []) => {
    if (lookStore.loading) return null
    if (list.length === 0) {
      return (
        <div className="wh100 flex-center">
          <NoData />
        </div>
      )
    }

    if (lookStore.activeDisplayName === 'grid') {
      return (
        <div className={`w100 ${lookStore.activeDisplayName === 'grid' ? 'flex-wrap' : 'flex-1'}`}>
          {list.map((file: { [K: string]: any } = {}, index: number) => {
            return (
              <div className="p-4 flex-center w-36 h-46 look-item-box flex-align-start" key={index}>
                <div className="w-28 flex-direction-column flex-align-center cursor-pointer look-item rounded p-2">
                  {getIconByFileType(file || {})}
                  <p className="text-c mt-1 text-sm over-two-ellipsis max-h-10 w-24 pl-2 pr-2">
                    {(file.fileName || '').replaceAll('"', '').trim()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    const columns = [
      {
        title: '名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: '20%',
        needTooltip: true,
        render: (record: { [K: string]: any } = {}) => {
          let fileName = (record.fileName || '').replaceAll('"', '').trim()
          return (
            <div className="flex-align-center">
              <div className="w-4 max-w-4 min-w-4 mr-1.5 h-6">{getIconByFileType(record || {}, false)}</div>
              <p className="over-ellipsis">{fileName}</p>
            </div>
          )
        }
      },
      {
        title: '修改日期',
        dataIndex: 'fileUpdated',
        key: 'fileUpdated',
        width: '20%',
        needTooltip: false
      },
      {
        title: '种类',
        dataIndex: 'fileKind',
        key: 'fileKind',
        width: '20%',
        render: (record: { [K: string]: any } = {}) => {
          let kind = (record.fileKind || '').replaceAll('"', '').trim().toLowerCase()
          if (kind.startsWith('image/')) {
            kind = kind.replace('image/', '').trim() || ''
            return <span>{kind.toUpperCase() || ''}图像</span>
          }

          let filename = (record.fileName || '').replaceAll('"', '').trim()
          if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
            if (filename.endsWith('.docx')) {
              return <span>Microsoft Word document(.docx)</span>
            }

            return <span>Microsoft Word document(.doc)</span>
          }

          if (kind === 'application/zip') {
            return <span>ZIP归档</span>
          }

          if (kind === 'application/pdf') {
            return <span>Adobe PDF(.pdf)</span>
          }

          if (kind === 'json') {
            return <span>JSON Document</span>
          }

          if (kind === 'dir') {
            return <span>文件夹</span>
          }

          if (kind.startsWith('css')) {
            return <span>CSS</span>
          }

          return <span>{kind.toUpperCase() || ''}</span>
        }
      },
      {
        title: '添加日期',
        dataIndex: 'fileCreated',
        key: 'fileCreated',
        width: '20%'
      },
      {
        title: '大小',
        key: 'fileSize',
        dataIndex: 'fileSize',
        width: '20%',
        needTooltip: false,
        render: (record: { [K: string]: any } = {}) => {
          let kind = (record.fileKind || '').replaceAll('"', '').trim().toLowerCase()
          if (kind === 'dir') {
            return <span className="text-r">--</span>
          }

          return <span className="text-r">{record.fileSize || '--'}</span>
        }
      }
    ]

    // list
    return (
      <div className="w100 flex-wrap">
        <MTable dataSource={list || []} columns={columns} actions={[]} className="w100" />
      </div>
    )
  }

  /**
   * 最近使用
   */
  const getRecentUsedHtml = () => {
    return getItemHtml(lookStore.recentUsedList || [])
  }

  /**
   * 桌面
   */
  const getDesktopHtml = () => {
    return getItemHtml(lookStore.desktopList || [])
  }

  /**
   * 文稿
   */
  const getDocumentHtml = () => {
    return getItemHtml(lookStore.documentList || [])
  }

  /**
   * 图片
   */
  const getPictureHtml = () => {
    return getItemHtml(lookStore.pictureList || [])
  }

  /**
   * 下载
   */
  const getDownloadHtml = () => {
    return getItemHtml(lookStore.downloadList || [])
  }

  const render = () => {
    return (
      <Page className="look-page overflow-hidden" loading={lookStore.loading} contentClassName="flex-direction-column">
        {/* title */}
        <div className="page-title flex-align-center">
          <p className="flex-1 font-bold text-xl">{RouterUrls.TOOLS.FILELOOK.NAME}</p>
        </div>

        <div className="page-content text-sm flex-1 flex-direction-column">
          {/* search */}
          <div className="page-search p-5 flex-align-center">
            <div className="search-item flex-align-center h-10 w100">
              <Input
                placeholder="请输入文件名搜索"
                value=""
                allowClear
                className="m-ant-input wh100"
                onChange={e => {}}
              />
            </div>

            <div className="display flex-align-center ml-2">
              {getGridDisplayIcon()}
              {getListDisplayIcon()}
            </div>
          </div>

          {/* 最近查看的内容 | 下载 ｜ 图片 ｜ 文稿 */}
          <div className="mt-4 w100 flex-1">
            <Tabs
              className="m-ant-tabs wh100"
              tabPosition="left"
              items={getTabs()}
              activeKey={activeTabKey}
              onTabClick={async (key: string = '') => {
                console.log('on tab click ', key)
                setActiveTabKey(key || '')
                if (activeTabKey === key) return
                if (key === 'tab1') {
                  await lookStore.getRecentUsedList()
                } else if (key === 'tab2') {
                  await lookStore.getDesktopList()
                } else if (key === 'tab3') {
                  await lookStore.getDocumentList()
                } else if (key === 'tab4') {
                  await lookStore.getPictureList()
                } else if (key === 'tab5') {
                  await lookStore.getDownloadList()
                }
              }}
            />
          </div>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(QuickLook)

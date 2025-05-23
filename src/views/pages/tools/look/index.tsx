/**
 * @fileOverview 文件查看
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useEffect, useRef, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import RouterUrls from '@route/router.url.toml'
import Page from '@views/modules/page'
import useMount from '@hooks/useMount'
import { useStore } from '@views/stores'
import { Tabs, Input, Table } from 'antd'
import Utils from '@utils/utils'
import NoData from '@views/components/noData'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'
import { createWindow, IWindowProps } from '@communal/tray/window'

// 节流
export function useThrottle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const lastCall = useRef(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        fn(...args)
      }
    },
    [fn, delay]
  )
}

// 防抖
export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay]
  )
}

const QuickLook = (): ReactElement => {
  const { lookStore } = useStore()
  const [activeTabKey, setActiveTabKey] = useState('tab1')
  const [searchName, setSearchName] = useState('')
  const [tableBodyHeight, setTableBodyHeight] = useState(0)
  const [trHeight, setTrHeight] = useState(0)
  const ref = useRef<any>(null)

  useMount(async () => {
    await lookStore.getRecentUsedList()
  })

  // @ts-ignore
  const throttle = (func: Function, delay: number) => {
    let lastCall = 0
    return (...args: any[]) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  const onSearch = useDebounce(async (value: string = '') => {
    if (activeTabKey === 'tab1') {
      await lookStore.getRecentUsedList(value || '')
    } else if (activeTabKey === 'tab2') {
      await lookStore.getDesktopList(value || '')
    } else if (activeTabKey === 'tab3') {
      await lookStore.getDocumentList(value || '')
    } else if (activeTabKey === 'tab4') {
      await lookStore.getPictureList(value || '')
    } else if (activeTabKey === 'tab5') {
      await lookStore.getDownloadList(value || '')
    }
  }, 500)

  const getTableHeight = () => {
    // 设置 table 最大高度
    const node = document.querySelector('.look-page')
    const titleNode = document.querySelector('.page-title')
    const pageSearchNode = document.querySelector('.page-search')
    const paginationNode = document.querySelector('.page-pagination')
    if (!node) return 0

    const rect = node.getBoundingClientRect()
    let height = rect.height || 0
    if (titleNode) {
      let titleRect = titleNode.getBoundingClientRect()
      height -= titleRect.height
    }

    if (pageSearchNode) {
      let pageSearchRect = pageSearchNode.getBoundingClientRect()
      height -= pageSearchRect.height
    }

    if (paginationNode) {
      let paginationRect = paginationNode.getBoundingClientRect()
      height -= paginationRect.height
    } else {
      height -= 60
    }

    return height
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const tableBodyNode = document.querySelector('.ant-table-tbody')
      if (tableBodyNode) {
        let height = getTableHeight()
        const tableHeaderNode = document.querySelector('.ant-table-thead')
        if (tableHeaderNode) {
          let ableHeaderRect = tableHeaderNode.getBoundingClientRect()
          height -= ableHeaderRect.height
        }

        let trDomList = document.querySelectorAll('.ant-table-tbody tr td.ant-table-cell')
        if (trDomList.length > 0) {
          let trRect = trDomList[0].getBoundingClientRect()
          setTrHeight(trRect.height)
        }

        // const tableBodyDom = tableBodyNode as HTMLDivElement
        // tableBodyDom.style.maxHeight = `${height}px`
        setTableBodyHeight(height)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  /**
   * 列表展示
   */
  const getListDisplayIcon = () => {
    return (
      <div
        className={`svg-box color-desc ml-2 w-8 h-8 p-1 cursor-pointer rounded bg-menu-hover ${lookStore.activeDisplayName === 'list' ? 'bg-menu-active' : ''}`}
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
        className={`svg-box color-desc w-8 h-8 p-1 cursor-pointer rounded bg-menu-hover ${lookStore.activeDisplayName === 'grid' ? 'bg-menu-active' : ''}`}
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
        <svg className="wh100 color-desc" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
        <div
          className={`svg-box relative w100 flex-center ${lookStore.activeDisplayName === 'grid' ? 'w-24 h-24' : 'w-4 max-w-4 min-w-4'}`}
        >
          <svg
            className={`folder-color ${lookStore.activeDisplayName === 'grid' ? 'w-20 h-20' : 'wh100'}`}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M885.333333 168.533333h-448L341.333333 110.933333c-6.4-4.266667-14.933333-6.4-21.333333-6.4H134.4c-51.2 0-93.866667 42.666667-93.866667 93.866667v622.933333c0 51.2 42.666667 93.866667 93.866667 93.866667h750.933333c51.2 0 93.866667-42.666667 93.866667-93.866667V262.4c0-51.2-40.533333-93.866667-93.866667-93.866667z m-738.133333 21.333334h160l96 57.6c6.4 4.266667 14.933333 6.4 21.333333 6.4h445.866667c12.8 0 21.333333 8.533333 21.333333 21.333333V298.666667c0 12.8-8.533333 21.333333-21.333333 21.333333h-725.333333c-12.8 0-21.333333-8.533333-21.333334-21.333333V211.2c2.133333-10.666667 12.8-21.333333 23.466667-21.333333z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      )
    }

    let filename = fileInfo.fileName || ''
    filename = filename.replaceAll('"', '').trim() // 替换引号

    let text = ''
    if (fileKind.toLowerCase().startsWith('application/')) {
      text = fileKind.replace('application/', '')
    } else if (fileKind.toLowerCase().startsWith('image/')) {
      text = fileKind.replace('image/', '')
    } else {
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
    }

    return getFileIcon(needText ? text.toUpperCase() : '')
  }

  const getItemHtml = (list: Array<{ [K: string]: any }> = [], total: number = 0, fetchMore: any) => {
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
        <div
          className={`wh100 position-relative ${lookStore.activeDisplayName === 'grid' ? 'flex-wrap overflow-y-auto' : 'flex-1'}`}
        >
          {list.length > lookStore.size && (
            <div
              className="w-6 h-6 absolute right-4 bottom-4 cursor-pointer color-desc"
              onClick={() => {
                ref.current?.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              }}
            >
              <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128c-211.744443 0-384 172.255557-384 384s172.255557 384 384 384 384-172.255557 384-384S723.744443 128 512 128z"
                  fill="currentColor"
                ></path>
                <path
                  d="M694.463217 458.367639l-158.495686-160.25545c-9.34412-9.471415-23.167639-11.840129-34.784142-7.135385-0.736245 0.287273-1.312512 0.992555-2.016073 1.343475-2.975944 1.47249-5.951888 3.072275-8.447897 5.5356-0.032684 0.032684-0.032684 0.063647-0.063647 0.096331-0.032684 0.032684-0.063647 0.032684-0.096331 0.063647l-159.359226 158.911974c-12.512727 12.480043-12.54369 32.735385-0.063647 45.248112 6.239161 6.271845 14.463432 9.407768 22.65674 9.407768 8.160624 0 16.352211-3.103239 22.591372-9.34412l103.616181-103.296224 0 305.056632c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L544.00258 397.247252l104.959656 106.112189c6.239161 6.335493 14.496116 9.504099 22.751351 9.504099 8.12794 0 16.25588-3.072275 22.496761-9.247789C706.783282 491.199355 706.912297 470.944013 694.463217 458.367639z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          )}
          <InfiniteScroll
            dataLength={list.length || 0}
            hasMore={list.length < total}
            next={fetchMore}
            pullDownToRefreshThreshold={100}
            height={getTableHeight()}
            className="w100 flex-wrap"
            loader={<p></p>}
            onScroll={event => {
              ref.current = event.target || null
            }}
          >
            {list.map((file: { [K: string]: any } = {}, index: number) => {
              return (
                <div className="p-4 flex-center w-36 look-item-box flex-align-start" key={index}>
                  <div className="w-28 flex-direction-column flex-align-center cursor-pointer look-item bg-menu-hover rounded-md p-2">
                    {getIconByFileType(file || {})}
                    <p className="text-c mt-1 text-sm word-break over-two-ellipsis max-h-10 w-24 pl-2 pr-2">
                      {(file.fileName || '').replaceAll('"', '').trim()}
                    </p>
                  </div>
                </div>
              )
            })}
          </InfiniteScroll>
        </div>
      )
    }

    const columns: any = [
      {
        title: '名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: 200,
        fixed: 'left',
        render: (_: any, record: { [K: string]: any } = {}) => {
          let fileName = (record.fileName || '').replaceAll('"', '').trim()
          return (
            <div
              className="flex-align-center"
              onClick={async () => {
                await createWindow({
                  label: fileName,
                  url: 'https://www.baidu.com',
                  title: fileName,
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
              }}
            >
              <div className="w-4 max-w-4 min-w-4 mr-1.5 h-6 flex-center mr-1">
                {getIconByFileType(record || {}, false)}
              </div>
              <p className="over-ellipsis">{fileName}</p>
            </div>
          )
        }
      },
      {
        title: '修改日期',
        dataIndex: 'fileUpdated',
        key: 'fileUpdated',
        width: 200,
        needTooltip: false,
        render: (_: any, record: { [K: string]: any } = {}) => {
          let fileUpdated = record.fileUpdated || ''
          if (fileUpdated === 'null' || fileUpdated === '(null)') {
            return <span>--</span>
          }

          return <span>{fileUpdated || ''}</span>
        }
      },
      {
        title: '种类',
        dataIndex: 'fileKind',
        key: 'fileKind',
        width: 200,
        render: (_: any, record: { [K: string]: any } = {}) => {
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
        width: 200
      },
      {
        title: '大小',
        key: 'fileSize',
        dataIndex: 'fileSize',
        width: 100,
        needTooltip: false,
        render: (_: any, record: { [K: string]: any } = {}) => {
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
      <div className="wh100">
        {/* table */}
        <div className="page-wrapper flex-direction-column pt-5 wh100 pb-5">
          {/* table */}
          <Table
            className="m-ant-table h100"
            columns={columns}
            scroll={{ x: 1500, y: tableBodyHeight }}
            dataSource={list || []}
            pagination={false}
            onScroll={async event => {
              let target = event.target
              if (target && !lookStore.pullLoading) {
                let scrollTop = (target as HTMLDivElement).scrollTop ?? 0
                let height = tableBodyHeight
                if (lookStore.currentPage > 1 && trHeight > 0) {
                  height += trHeight * lookStore.size
                } else {
                  height = tableBodyHeight * lookStore.currentPage
                }

                if (scrollTop > height - 100) {
                  fetchMore()
                }
              }
            }}
          />
        </div>
      </div>
    )
  }

  /**
   * 最近使用
   */
  const getRecentUsedHtml = () => {
    return getItemHtml(lookStore.recentUsedList || [], lookStore.total, () => {})
  }

  const onFetchDesktopMore = async () => {
    console.log('触底了，加载数据中...')
    if (lookStore.desktopList.length === 0) {
      return
    }

    lookStore.currentPage = lookStore.currentPage + 1
    await lookStore.getDesktopList(searchName)
  }

  const throttledDesktopFetchMore = useThrottle(async () => {
    await onFetchDesktopMore()
  }, 1000)

  /**
   * 桌面
   */
  const getDesktopHtml = () => {
    return getItemHtml(
      lookStore.desktopList || [],
      lookStore.total,
      lookStore.activeDisplayName === 'grid' ? onFetchDesktopMore : throttledDesktopFetchMore
    )
  }

  const onFetchDocumentMore = async () => {
    console.log('触底了，加载数据中...')
    if (lookStore.documentList.length === 0) {
      return
    }

    lookStore.currentPage = lookStore.currentPage + 1
    await lookStore.getDocumentList(searchName)
  }

  const throttledDocumentFetchMore = useThrottle(async () => {
    await onFetchDocumentMore()
  }, 1000)

  /**
   * 文稿
   */
  const getDocumentHtml = () => {
    return getItemHtml(
      lookStore.documentList || [],
      lookStore.total,
      lookStore.activeDisplayName === 'grid' ? onFetchDocumentMore : throttledDocumentFetchMore
    )
  }

  const onFetchPictureMore = async () => {
    console.log('触底了，加载数据中...')
    if (lookStore.pictureList.length === 0) {
      return
    }

    lookStore.currentPage = lookStore.currentPage + 1
    await lookStore.getPictureList(searchName)
  }

  const throttledPictureFetchMore = useThrottle(async () => {
    await onFetchPictureMore()
  }, 1000)

  /**
   * 图片
   */
  const getPictureHtml = () => {
    return getItemHtml(
      lookStore.pictureList || [],
      lookStore.total,
      lookStore.activeDisplayName === 'grid' ? onFetchPictureMore : throttledPictureFetchMore
    )
  }

  const onFetchDownloadMore = async () => {
    console.log('触底了，加载数据中...')
    if (lookStore.downloadList.length === 0) {
      return
    }

    lookStore.currentPage = lookStore.currentPage + 1
    await lookStore.getDownloadList(searchName, '', false)
  }

  const throttledDownloadFetchMore = useThrottle(async () => {
    await onFetchDownloadMore()
  }, 1000)

  /**
   * 下载
   */
  const getDownloadHtml = () => {
    return getItemHtml(
      lookStore.downloadList || [],
      lookStore.total,
      lookStore.activeDisplayName === 'grid' ? onFetchDownloadMore : throttledDownloadFetchMore
    )
  }

  const render = () => {
    const height = getTableHeight()

    return (
      <Page
        className="look-page overflow-hidden"
        loading={lookStore.loading}
        contentClassName="flex-direction-column"
        title={{
          label: RouterUrls.TOOLS.FILELOOK.NAME || ''
        }}
      >
        <div className="page-content flex-1 flex-direction-column">
          {/* search */}
          <div className="page-search p-5 flex-align-center">
            <div className="search-item flex-align-center h-10 w100">
              <Input
                placeholder="请输入文件名搜索"
                allowClear
                className="m-ant-input wh100"
                prefix={<SearchOutlined />}
                value={searchName || ''}
                onChange={e => {
                  setSearchName(e.target.value || '')
                  onSearch(e.target.value || '')
                }}
              />
            </div>

            <div className="display flex-align-center ml-2">
              {getGridDisplayIcon()}
              {getListDisplayIcon()}
            </div>
          </div>

          {/* 最近查看的内容 | 下载 ｜ 图片 ｜ 文稿 */}
          <div
            className="w100 flex-1"
            style={{
              height: `${height}px`
            }}
          >
            <Tabs
              className="m-ant-tabs wh100"
              tabPosition="left"
              items={getTabs()}
              activeKey={activeTabKey}
              onTabClick={async (key: string = '') => {
                console.log('on tab click ', key)
                setActiveTabKey(key || '')
                if (activeTabKey === key) return
                lookStore.recentUsedList = []
                lookStore.desktopList = []
                lookStore.documentList = []
                lookStore.pictureList = []
                lookStore.downloadList = []
                lookStore.currentPage = 1
                lookStore.total = 0

                if (key === 'tab1') {
                  await lookStore.getRecentUsedList(searchName || '')
                } else if (key === 'tab2') {
                  await lookStore.getDesktopList(searchName || '')
                } else if (key === 'tab3') {
                  await lookStore.getDocumentList(searchName || '')
                } else if (key === 'tab4') {
                  await lookStore.getPictureList(searchName || '')
                } else if (key === 'tab5') {
                  await lookStore.getDownloadList(searchName || '')
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

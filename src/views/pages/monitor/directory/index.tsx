/**
 * @fileOverview 目录
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import MBreadcrumb from '@views/modules/breadcrumb'
import { useStore } from '@views/stores'
import { Drawer, Table, Card } from 'antd'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import Loading from '@views/components/loading/loading'
// const { Search } = Input

const Index = (): ReactElement => {
  const [showDrawer, setShowDrawer] = useState(false)
  const { homeStore, directoryStore } = useStore()

  const tableHeaders: any = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '40%'
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '修改日期',
      dataIndex: 'modified',
      key: 'modified'
    },
    {
      title: '文件权限',
      dataIndex: 'permissions',
      key: 'permissions'
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (_: string, record: { [K: string]: any }) => {
        let children = record.children || []
        let hasPreview = false
        if (children.length === 0) {
          let name = record.name || ''
          let executable = record.executable || ''
          if (executable.toLowerCase() === 'true') {
            return ''
          }

          let suffixList = name.split('.')
          let suffix = suffixList[suffixList.length - 1]
          if (
            name.toLowerCase() === directoryStore.MAKE_FILE.toLowerCase() ||
            (directoryStore.EXCLUDE_SUFFIX_LIST.indexOf(suffix) === -1 &&
              directoryStore.EXCLUDE_FILE_LIST.indexOf(name) === -1)
          ) {
            hasPreview = true
          }
        }
        return hasPreview ? <a onClick={() => onShowDrawer(record.path || '', record.name || '')}>查看</a> : ''
      }
    }
  ]

  useMount(async () => {
    await onRefresh()
  })

  const onRefresh = async () => {
    await directoryStore.getDirectoryList()
  }

  const onShowDrawer = async (path: string, name: string) => {
    await directoryStore.getFileData(path, name)
    setShowDrawer(true)
  }

  const getFileHtml = () => {
    if (directoryStore.loading || Utils.isBlank(directoryStore.fileData) || Utils.isBlank(directoryStore.fileName)) {
      return null
    }

    let suffixList = directoryStore.fileName.split('.')
    let suffix = suffixList[suffixList.length - 1]
    if (suffix === 'conf') {
      suffix = 'nginx'
    }

    if (suffix === 'rs') {
      suffix = 'rust'
    }

    if (suffix === 'md') {
      suffix = 'markdown'
    }

    if (directoryStore.fileName.toLowerCase() === directoryStore.MAKE_FILE.toLowerCase()) {
      suffix = 'makefile'
    }

    // @ts-ignore
    let prism = window['Prism']
    let language = prism.languages[suffix]
    if (!language) {
      suffix = 'txt'
      language = prism.languages[suffix]
    }

    let capitalizeLanguage = Utils.capitalizeFirstChar(suffix)
    if (suffix === 'nginx') {
      capitalizeLanguage = 'nginx'
    }

    const html = prism.highlight(directoryStore.fileData, language, capitalizeLanguage)
    return (
      <pre>
        <code className={`file-detail language-${suffix}`} dangerouslySetInnerHTML={{ __html: html || '' }} />
      </pre>
    )
  }

  const render = () => {
    return (
      <div className="directory-page w100 min-h100 flex-direction-column">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb className="flex-1" items={homeStore.MENU_LIST} />

          <div className="top-add flex-align-center">
            <div className="refresh-item flex-align-center" onClick={onRefresh}>
              <svg className="svg-icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1007.2 262.4c-12.8-6.4-32 0-38.4 19.2l-25.6 70.4C904.8 256 847.2 179.2 757.6 128c-108.8-64-230.4-89.6-352-57.6C232.8 108.8 104.8 236.8 60 409.6 53.6 428.8 66.4 441.6 79.2 448 98.4 448 111.2 441.6 117.6 422.4c38.4-153.6 153.6-268.8 307.2-300.8 108.8-25.6 217.6-6.4 307.2 51.2 76.8 44.8 134.4 115.2 166.4 198.4l-76.8-32c-12.8-6.4-32 0-38.4 19.2-6.4 12.8 0 32 12.8 38.4l128 51.2c6.4 6.4 12.8 6.4 19.2 6.4 0 0 6.4 0 6.4 0 0 0 0 0 0 0 0 0 0 0 6.4 0 6.4 0 12.8-6.4 12.8-12.8L1026.4 294.4C1032.8 281.6 1020 268.8 1007.2 262.4zM949.6 576c-12.8-6.4-32 6.4-32 19.2-38.4 153.6-153.6 268.8-307.2 300.8-108.8 25.6-217.6 6.4-307.2-51.2-76.8-44.8-134.4-115.2-166.4-198.4l76.8 32c12.8 6.4 32 0 38.4-19.2 6.4-12.8 0-32-12.8-38.4L104.8 576C98.4 576 92 569.6 85.6 569.6c0 0-6.4 0-6.4 0 0 0 0 0 0 0 0 0 0 0-6.4 0C66.4 576 60 582.4 60 588.8L2.4 729.6c-6.4 12.8 0 32 19.2 38.4 12.8 6.4 32 0 38.4-19.2l25.6-70.4C124 768 181.6 844.8 271.2 896c108.8 64 230.4 89.6 352 57.6 172.8-38.4 307.2-172.8 345.6-345.6C975.2 595.2 962.4 582.4 949.6 576z"
                  fill="currentColor"
                ></path>
              </svg>
              <p>刷新</p>
            </div>
          </div>
        </div>

        <div className="tree-box">
          {/* search */}
          {/*
          <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
          */}

          <Card title={directoryStore.dir || '目录'}>
            <Table columns={tableHeaders || []} dataSource={directoryStore.directoryInfo || []} pagination={false} />
          </Card>
        </div>

        {/* 查看配置文件 */}
        <Drawer
          rootClassName="m-ant-drawer"
          title={directoryStore.fileName || '文件'}
          placement="right"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
        >
          {getFileHtml()}
        </Drawer>

        <Loading show={directoryStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(Index)

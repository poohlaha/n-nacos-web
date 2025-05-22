/**
 * @fileOverview nginx
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import { Card, Drawer, Table } from 'antd'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import MBreadcrumb from '@views/modules/breadcrumb'

//@ts-ignore
interface DataType {
  key: string
  index: string
  propName: string
  propValue: string
  children?: DataType[]
}

const Nginx = (): ReactElement => {
  const [showDrawer, setShowDrawer] = useState(false) // 是否显示 nginx 配置文件
  const { nginxStore, homeStore } = useStore()

  useMount(async () => {
    await nginxStore.getList()
  })

  const onShowDrawer = async () => {
    await nginxStore.getFileData(() => {
      setShowDrawer(true)
    })
  }

  // 获取 nginx 配置文件
  const getNginxFileConfHtml = () => {
    if (nginxStore.loading || !nginxStore.fileData || Utils.isObjectNull(nginxStore.fileData)) return null
    // @ts-ignore
    let prism = window['Prism']

    const html = prism.highlight(nginxStore.fileData.data, prism.languages.nginx, 'nginx')
    return (
      <pre>
        <code className="nginx-detail language-nginx" dangerouslySetInnerHTML={{ __html: html || '' }} />
      </pre>
    )
  }

  const getTableData = (data: Array<{ [K: string]: any }>, results: Array<any> = [], index: number) => {
    for (let i = 0; i < data.length; i++) {
      let item = data[i] || {}
      if (Utils.isObjectNull(item)) {
        continue
      }

      if (!item.current && !item.token) {
        continue
      }

      // empty line
      if (item.current.is_empty_line) {
        continue
      }

      // comment line
      if (item.current.is_comment_line) {
        continue
      }

      let token = item.current.token || {}
      let args = token.args || []
      let propValue = ''
      if (args.length > 0) {
        propValue = args.join(',') || ''
        let specIndex = propValue.indexOf(';')
        if (specIndex !== -1) {
          propValue = propValue.substring(0, specIndex)
        }
      }

      let object = {
        key: `${i}${index || ''}`,
        propName: token.name || '',
        propValue,
        children: []
      }

      let childrens = item.childrens || []
      if (childrens.length > 0) {
        getTableData(childrens, object.children, i)
      }

      if (object.children.length === 0) {
        // @ts-ignore
        delete object.children
      }

      results.push(object)
      console.log('results:', results)
    }
  }

  /**
   * 获取 table
   */
  const getTable = () => {
    if (nginxStore.data.length === 0) return null

    const data: Array<any> = []
    getTableData(nginxStore.data, data, 0)

    if (data.length === 0) return null

    return <Table columns={nginxStore.tableHeaders || []} dataSource={data} />
  }

  const render = () => {
    return (
      <div className="nginx-page w100 min-h100">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb items={homeStore.MENU_LIST} />
        </div>

        <Card title="Nginx 配置文件" extra={<p onClick={onShowDrawer}>查看配置文件</p>}>
          {getTable()}
        </Card>

        {/* 查看配置文件 */}
        <Drawer
          rootClassName="m-ant-drawer"
          title="Nginx配置文件"
          placement="right"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
        >
          {getNginxFileConfHtml()}
        </Drawer>

        <Loading show={nginxStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(Nginx)

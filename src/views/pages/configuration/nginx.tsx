/**
 * @fileOverview nginx
 * @date 2023-04-12
 * @author poohlaha
 */
import React, {Fragment, ReactElement, useState} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import {Card, Drawer} from 'antd'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import Utils from "@utils/utils";

const Nginx: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const [showDrawer, setShowDrawer] = useState(false) // 是否显示 nginx 配置文件

  const {commonStore} = useStore()
  useMount(() => {
    commonStore.setProperty('data', {})
  })


  const onShowDrawer = () => {
    commonStore.initSocket();
    commonStore.onSendMessage({
      data: ['file'],
      request: 'nginx'
    })
    setShowDrawer(true)
  }

  // 获取 nginx 配置文件
  const getNginxFileConfHtml = () => {
    if (commonStore.loading || !commonStore.data || Utils.isObjectNull(commonStore.data)) return null
    // @ts-ignore
    let prism = window['Prism']

    const html = prism.highlight(commonStore.data.data, prism.languages.nginx, 'nginx')
    return (
      <pre>
        <code className="nginx-detail language-nginx" dangerouslySetInnerHTML={{ __html: html || '' }} />
      </pre>
    )
  }

  const render = () => {
    return (
      <div className="nginx-page">
        <Card extra={<p onClick={onShowDrawer}>查看配置文件</p>}>

        </Card>

        {/* 查看配置文件 */}
        {
          showDrawer && (
            <Drawer title="Nginx配置文件" placement="right" onClose={() => setShowDrawer(false)} open={showDrawer}>
              <Loading show={commonStore.loading} />
              {
                getNginxFileConfHtml()
              }
            </Drawer>
          )
        }
      </div>
    )
  }

  return render();
}

export default observer(Nginx)

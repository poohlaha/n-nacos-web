/**
 * @fileOverview nginx
 * @date 2023-04-12
 * @author poohlaha
 */
import React, {ReactElement, useState} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import {Card, Drawer} from 'antd'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import Utils from "@utils/utils";

const Nginx: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const [showDrawer, setShowDrawer] = useState(false) // 是否显示 nginx 配置文件

  const {nginxStore} = useStore()
  useMount(() => {

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

  const render = () => {
    return (
      <div className="nginx-page">
        <Card extra={<p onClick={onShowDrawer}>查看配置文件</p>}>

        </Card>

        {/* 查看配置文件 */}
        {
          <Drawer title="Nginx配置文件" placement="right" onClose={() => setShowDrawer(false)} open={showDrawer}>
            <Loading show={nginxStore.loading} />
            {
              getNginxFileConfHtml()
            }
          </Drawer>
        }
      </div>
    )
  }

  return render();
}

export default observer(Nginx)

/**
 * @fileOverview dashboard
 * @date 2023-07-05
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import { Card } from 'antd'
import CardBgPng from '@assets/images/card.png'
import { useNavigate } from 'react-router-dom'

const Dashboard = (): ReactElement => {
  const { dashboardStore, homeStore } = useStore()

  const navigate = useNavigate()

  const toPage = (index: number = 0) => {
    const menu = homeStore.MENU_LIST[index]
    homeStore.onSetSelectMenu(menu.key)
    navigate(`${menu.parentUrl || ''}${menu.url || ''}`)
  }

  const render = () => {
    return (
      <Page
        className="dashboard-page"
        title={{
          label: RouterUrls.DASHBOARD.NAME || ''
        }}
      >
        <div className="flex-wrap">
          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(1)}
          >
            <Card.Meta title={RouterUrls.SERVER.LIST.NAME} description={RouterUrls.SERVER.LIST.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(2)}
          >
            <Card.Meta title={RouterUrls.PIPELINE.LIST.NAME} description={RouterUrls.PIPELINE.LIST.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(3)}
          >
            <Card.Meta title={RouterUrls.PIPELINE.MARKET.NAME} description={RouterUrls.PIPELINE.MARKET.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(4)}
          >
            <Card.Meta title={RouterUrls.NOTE.LIST.NAME} description={RouterUrls.NOTE.LIST.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(5)}
          >
            <Card.Meta title={RouterUrls.TOOLS.FILELOOK.NAME} description={RouterUrls.TOOLS.FILELOOK.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(6)}
          >
            <Card.Meta title={RouterUrls.ANSWER.NAME} description={RouterUrls.ANSWER.DESCRIPTION} />
          </Card>

          <Card
            className="hover:shadow-lg transition cursor-pointer w-64 h-72 max-w-64 max-h-72 mb-5 mr-5"
            cover={<img className="w100" draggable={false} alt="card" src={CardBgPng} />}
            onClick={() => toPage(7)}
          >
            <Card.Meta title={RouterUrls.ROBOT.NAME} description={RouterUrls.ROBOT.DESCRIPTION} />
          </Card>
        </div>
        <Loading show={dashboardStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

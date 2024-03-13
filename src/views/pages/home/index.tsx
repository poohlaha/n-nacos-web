/**
 * 主页面, 包括上部、左侧导航和右侧页面显示
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Left from './left'
import Right from './right'
import Page from '@views/components/page'

const Dashboard: React.FC<IRouterProps> = (): ReactElement => {
  const render = () => {
    return (
      <Page className="home-page" pageBodyNeedPadding={false}>
        <div className="home-content wh100 flex">
          <Left />
          <Right />
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)

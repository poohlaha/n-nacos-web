/**
 * 主页面, 包括上部、左侧导航和右侧页面显示
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Navigation from './navigation'
import Left from './left'
import Right from './right'

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const render = () => {
    return (
      <div className="flex-direction-column wh100">
        <Navigation />
        <div className="home-page flex-1 flex">
          <Left />
          <Right />
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Dashboard)

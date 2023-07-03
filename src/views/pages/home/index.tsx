/**
 * 主页面, 包括上部、左侧导航和右侧页面显示
 */
import React, {Fragment, ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Navigation from './navigation';
import Left from './left';
import Right from './right';

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const render = () => {
    return (
      <Fragment>
        <Navigation />
        <div className="main flex-1 flex">
          <Left />
          <Right />
        </div>
      </Fragment>
    )
  }

  return render();
}

export default observer(Dashboard)

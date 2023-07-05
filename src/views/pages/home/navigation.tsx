/**
 * 上部 Navigation
 */
import React, {ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import AvatarImg from '@assets/images/navigation/avatar.jpeg'

const Navigation: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const render = () => {
    return (
      <div className="navigation flex">
        <div className="logo flex-align-center">
          n-nacos
        </div>
        <div className="flex-1">

        </div>
        <div className="navigation-right">
          <div className="avatar flex-center">
            <img src={AvatarImg} alt=""/>
          </div>
        </div>
      </div>
    )
  }

  return render();
}

export default observer(Navigation)

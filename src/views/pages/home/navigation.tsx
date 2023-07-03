/**
 * 上部 Navigation
 */
import React, {ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'

const Navigation: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const render = () => {
    return (
      <div className="navigation flex">
        <div className="logo flex-align-center">
          n-nacos
        </div>
      </div>
    )
  }

  return render();
}

export default observer(Navigation)

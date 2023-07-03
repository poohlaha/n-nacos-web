/**
 * @fileOverview chat
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { Fragment, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'

const Dashboard: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const render = () => {
    return (
      <div>Hello</div>
    )
  }

  return render();
}

export default observer(Dashboard)

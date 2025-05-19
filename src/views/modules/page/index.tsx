/**
 * @fileOverview Page
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { PropsWithChildren, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Loading from '../../components/loading/loading'
import MBreadcrumb from '@views/modules/breadcrumb'

interface IPageProps {
  className?: string
  contentClassName?: string
  loading?: boolean
  breadCrumbItemList?: Array<{ [K: string]: any }> // 面包屑列表
}

const Page = (props: PropsWithChildren<IPageProps>): ReactElement => {
  const getBreadcrumb = () => {
    return (
      <div className="breadcrumb-top flex-align-center mb-4">
        <MBreadcrumb items={props.breadCrumbItemList || []} />
      </div>
    )
  }

  const render = () => {
    return (
      <div className={`wh100 ${props.className || ''}`}>
        <div className={`${props.contentClassName || ''} wh100 p-6`}>
          {(props.breadCrumbItemList || []).length > 0 && getBreadcrumb()}

          {props.children}
        </div>

        {/* loading */}
        <Loading show={props.loading ?? false} />
      </div>
    )
  }

  return render()
}

export default observer(Page)

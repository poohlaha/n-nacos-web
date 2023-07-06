/**
 * @fileOverview breadcrumb
 * @date 2023-07-06
 * @author poohlaha
 */
import React, {ReactElement} from 'react'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'
import { useNavigate } from 'react-router-dom'
import Utils from "@utils/utils";

interface IMBreadcrumbProps {
  className?: string,
  items: Array<{[K: string]: any}>
  activeIndexes: Array<number>
  onChange: Function
}

const MBreadcrumb: React.FC<IMBreadcrumbProps> = (props: IMBreadcrumbProps): ReactElement => {
  const navigate = useNavigate()

  const toPage = (url: string, activeIndexes: Array<number> = []) => {
    if (Utils.isBlank(url)) return
    props.onChange?.(activeIndexes)
    navigate(url)
  }

  const getItems = () => {
    if (props.items.length === 0 || props.activeIndexes.length === 0) return props.items || []
    let items: Array<{[K: string]: any}> = []
    let dashboard: {[K: string]: any} = {}
    for(let i = 0; i < props.items.length; i++) {
      let item = props.items[i]
      let children = item.children || []
      if (children.length === 0) {
        dashboard = item
        continue
      }

      if (props.activeIndexes.length === 1) {
        break
      }

      let parentIndex= props.activeIndexes[0]
      let childIndex= props.activeIndexes[1]
      if (parentIndex !== i) {
        continue
      }

      items.push({
        title: (
          <div onClick={() => toPage(RouterUrls.MAIN_URL + dashboard.url || '', [0])}>
            <div className="flex-align-center breadcrumb">
              <p className="icon flex-center">{dashboard.icon}</p>
              <p>{dashboard.name || ''}</p>
            </div>
          </div>
        )
      })

      items.push({
        title: item.name || ''
      })

      for(let j = 0; j < children.length; j++) {
        if (childIndex !== j) {
          continue
        }

        let child = children[j]
        items.push({
          title: (
            <div onClick={() => toPage(RouterUrls.MAIN_URL + child.url || '', [i, j])}>
              <div className="flex-align-center breadcrumb">
                <p className="icon flex-center">{child.icon}</p>
                <p>{child.name || ''}</p>
              </div>
            </div>
          )
        })
      }
    }

    return items
  }

  const render = () => {

    return (
      <Breadcrumb items={getItems()} className={props.className || ''} />
    )
  }

  return render()
}

export default MBreadcrumb

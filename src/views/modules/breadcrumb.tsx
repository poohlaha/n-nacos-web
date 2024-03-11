/**
 * @fileOverview breadcrumb
 * @date 2023-07-06
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'
import { useNavigate } from 'react-router-dom'
import Utils from '@utils/utils'

interface IMBreadcrumbProps {
  className?: string
  items: Array<{ [K: string]: any }>
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
    let items: Array<{ [K: string]: any }> = []
    for (let i = 0; i < props.items.length; i++) {
      let item = props.items[i]
      let children = item.children || []

      items.push({
        key: i + item.key,
        title: (
          <div
            key={i}
            className="h100 flex-align-center"
            onClick={() => {
              let url = item.url || ''
              if (Utils.isBlank(url)) {
                return
              }

              toPage(RouterUrls.HOME_URL + url, [0])
            }}
          >
            <div className="flex-align-center breadcrumb">
              {item.icon && <p className="icon flex-center">{item.icon}</p>}
              <p>{item.name || ''}</p>
            </div>
          </div>
        ),
      })

      for (let j = 0; j < children.length; j++) {
        let child = children[j]
        items.push({
          key: i + j + child.key,
          title: (
            <div key={i + j} onClick={() => toPage(RouterUrls.HOME_URL + child.url || '', [i, j])}>
              <div className="flex-align-center breadcrumb">
                {child.icon && <p className="icon flex-center">{child.icon}</p>}
                <p>{child.name || ''}</p>
              </div>
            </div>
          ),
        })
      }
    }

    return items
  }

  const render = () => {
    return <Breadcrumb items={getItems()} className={props.className || ''} />
  }

  return render()
}

export default MBreadcrumb

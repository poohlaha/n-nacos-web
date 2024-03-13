/**
 * 左侧导航
 */
import React, { Fragment, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import RouterUrls from '@route/router.url.toml'
import Utils from '@utils/utils'
import { useNavigate } from 'react-router-dom'
import useMount from '@hooks/useMount'

const Left: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const navigate = useNavigate()
  const { homeStore, mainStore } = useStore()

  useMount(() => {
    let url = homeStore.getUrl()
    if (!Utils.isBlank(url)) {
      navigate(`${RouterUrls.HOME_URL}${url}`)
    }
  })

  const toPage = (url: string) => {
    if (Utils.isBlank(url)) return
    navigate(`${RouterUrls.HOME_URL}${url}`)
  }

  const render = () => {
    let selectServer = mainStore.getSelectServer() || {}
    let url = homeStore.getUrl()

    return (
      <div className="left flex-direction-column">
        {/* back */}
        <div className="left-back flex-align-center">
          <div
            className="back-left"
            onClick={() => {
              mainStore.onSelectServer({})
              navigate(RouterUrls.MAIN_URL)
            }}
          >
            <div className="svg-box flex-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" version="1.1" className="svg-icon wh100">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-20.000000, -77.000000)" fillRule="nonzero">
                    <g transform="translate(20.000000, 77.000000)">
                      <rect fill="#000000" opacity="0" x="0" y="0" width="32" height="32"></rect>
                      <path
                        d="M19.0946804,9.93601689 L14.3573305,9.93601689 L14.3573305,6 L4,11.2906749 L14.3573305,16.5800052 L14.3573305,12.6453599 L19.4733618,12.6453599 C23.5160098,12.6453599 25.5373472,14.3866866 25.5373472,17.8706846 C25.5373472,21.4840384 23.4520043,23.225392 19.2213468,23.225392 L7.34662822,23.225392 L7.34662822,26.0000583 L19.4106472,26.0000583 C25.0946603,26.0000583 28,23.3547208 28,18.1293691 C28,12.6453599 25.0320263,9.93601689 19.0946804,9.93601689 Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div className="back-right">
            <p className="ip font-bold">{selectServer.ip || ''}</p>
            <p className="name">{selectServer.name || ''}</p>
          </div>
        </div>
        {homeStore.menuList.length > 0 &&
          homeStore.menuList.map((item: { [K: string]: any }, index: number) => {
            let name = item.name || ''
            let icon = item.icon || null
            let children = item.children || []
            let itemUrl = item.url || ''
            let parentActive = itemUrl === url

            return (
              <div key={index} className="left-group">
                {children.length > 0 ? (
                  <Fragment>
                    {/* group title */}
                    <div className={`left-title flex-align-center ${parentActive ? 'active' : ''}`}>{name || ''}</div>

                    {/* group list */}
                    {children.map((child: { [K: string]: any }, i: number) => {
                      let childUrl = child.url || ''
                      let childActive = childUrl === url

                      return (
                        <ul key={i}>
                          <li
                            className={`flex-align-center ${childActive ? 'active' : ''}`}
                            onClick={() => toPage(childUrl)}
                          >
                            {child.icon || null}
                            <p>{child.name || ''}</p>
                          </li>
                        </ul>
                      )
                    })}
                  </Fragment>
                ) : (
                  <div
                    className={`left-item flex-align-center ${parentActive ? 'active' : ''}`}
                    onClick={() => toPage(itemUrl)}
                  >
                    {icon}
                    <p>{name || ''}</p>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    )
  }

  return render()
}

export default observer(Left)

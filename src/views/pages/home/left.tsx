/**
 * 左侧导航
 */
import React, {Fragment, ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import RouterUrls from '@route/router.url.toml'
import Utils from '@utils/utils'
import { useNavigate } from 'react-router-dom'

const Left: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

  const navigate = useNavigate()
  const {leftStore} = useStore()

  const toPage = (url: string) => {
    if (Utils.isBlank(url)) return
    navigate(url)
  }

  const render = () => {

    return (
      <div className="left flex-direction-column">
        {
          leftStore.menuList.length > 0 && leftStore.menuList.map((item: {[K: string]: any}, index: number) => {
            let name = item.name || ''
            let children = item.children || []
            let url = `${RouterUrls.MAIN_URL}${item.url || ''}`
            console.log('item', item)
            let parentActive = leftStore.activeIndexes.length === 1 && leftStore.activeIndexes[0] === index

            return (
              <div key={index} className="left-group">
                {
                  children.length > 0 ? (
                   <Fragment>
                     {/* group title */}
                     <div className={`left-title flex-align-center ${parentActive ? 'active' : ''}`}>
                       {name || ''}
                     </div>

                     {/* group list */}
                     {
                       children.map((child: {[K: string]: any}, i: number) => {
                         let childActive = false
                         let childUrl = `${RouterUrls.MAIN_URL}${child.url || ''}`
                         if (leftStore.activeIndexes.length > 1) {
                           childActive = leftStore.activeIndexes[1] === i
                         }

                         return (
                           <ul key={i}>
                             <li className={`flex-align-center ${childActive ? 'active' : ''}`} onClick={() => toPage(childUrl)}>{child.name || ''}</li>
                           </ul>
                         )
                       })
                     }
                   </Fragment>
                  ) : (
                    <div className={`left-item flex-align-center ${parentActive ? 'active' : ''}`} onClick={() => toPage(url)}>
                      {name || ''}
                    </div>
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  return render();
}

export default observer(Left)

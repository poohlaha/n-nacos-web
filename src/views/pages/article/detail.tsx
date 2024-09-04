/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Navigation from '@pages/home/navigation'
import {Tag, Tooltip} from 'antd'
import {useNavigate} from 'react-router-dom'
import {useStore} from '@views/stores'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/components/page/type'
import Utils from '@utils/utils'

const ArticleDetail = (): ReactElement => {

  const navigate = useNavigate()
  const { articleStore } = useStore()

  const getNavigationLeftNode = () => {
    return (
        <Tooltip title="修改">
          <div
              className="edit-button page-margin-left cursor-pointer"
              onClick={() => {

              }}
          >
            <div className="svg-box">
              <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M684.202667 117.248c15.893333-15.872 42.154667-15.36 58.922666 1.408l90.517334 90.517333c16.661333 16.661333 17.344 42.986667 1.429333 58.922667l-445.653333 445.653333c-7.936 7.914667-23.104 16.746667-34.218667 19.776l-143.701333 39.253334c-21.909333 5.994667-35.114667-7.104-29.568-28.949334l37.248-146.773333c2.773333-10.944 11.562667-26.346667 19.392-34.176l445.653333-445.653333zM268.736 593.066667c-2.901333 2.901333-8.106667 12.074667-9.130667 16.021333l-29.12 114.773333 111.957334-30.570666c4.437333-1.216 13.632-6.549333 16.810666-9.728l445.653334-445.653334-90.517334-90.496-445.653333 445.653334zM682.794667 178.986667l90.517333 90.517333-30.186667 30.186667-90.496-90.517334 30.165334-30.165333z m-362.026667 362.048l90.496 90.517333-30.165333 30.165333-90.517334-90.496 30.165334-30.186666zM170.666667 874.666667c0-11.776 9.429333-21.333333 21.461333-21.333334h661.077333a21.333333 21.333333 0 1 1 0 42.666667H192.128A21.333333 21.333333 0 0 1 170.666667 874.666667z"
                    fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </Tooltip>
    )
  }

  const render = () => {
    return (
      <div className="article-detail-page wh100">
        <Navigation
            needLogo={false}
            needBack={true}
            leftNode={getNavigationLeftNode()}
        />

        <div className="article-box w100">
         <div className="flex-direction-column overflow h100">
             <p className="article-title font-bold text-l">{articleStore.selectedItem?.title || ''}</p>
             <div className="article-desc flex-align-center">
                 <div className="create flex-align-center">
                     <p>发表于</p>
                     <p>{articleStore.selectedItem?.createTime || '-'}</p>
                 </div>

                 <span className="spec">|</span>

                 {
                     !Utils.isBlank(articleStore.selectedItem?.updateTime || '') && (
                         <div className="update flex-align-center">
                             <p>更新于</p>
                             <p>{articleStore.selectedItem?.updateTime || '-'}</p>
                         </div>
                     )
                 }
             </div>

             <div className="article-desc flex-align-center">
                 {
                     (articleStore.selectedItem?.tags || []).map((t: string = '') => {
                         return (
                             <div className="flex-wrap" key={t}>
                                 <Tag>{t || ''}</Tag>
                             </div>
                         )
                     })
                 }
             </div>
             <div className="article-content flex-1">
                 <div className="markdown-body">
                     <Markdown
                         children={articleStore.selectedItem?.content || ''}
                         options={{
                             overrides: {
                                 code: SyntaxHighlightedCode,
                             },
                         }}
                     />
                 </div>
             </div>
         </div>
        </div>

      </div>
    )
  }

  return render()
}

export default observer(ArticleDetail)
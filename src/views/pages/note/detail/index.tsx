/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@views/stores'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/modules/page/type'
import RouterUrls from '@route/router.url.toml'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { ADDRESS } from '@utils/base'
import Loading from '@views/components/loading/loading'
import Page from '@views/modules/page'
import CommonHtmlHandler from '@views/handlers/common'

const ArticleDetail = (): ReactElement => {
  const navigate = useNavigate()
  const { noteStore } = useStore()
  const [id, setId] = useState('')

  useMount(async () => {
    let id = ADDRESS.getAddressQueryString('id') || ''
    id = Utils.decrypt(decodeURIComponent(id))
    console.log('id:', id)
    setId(id)
    await noteStore.getDetail(id)
  })

  const getActionNode = () => {
    return (
      <div className="flex-align-center relative mr-4">
        <Tooltip title="修改">
          <div
            className="edit-button page-margin-left cursor-pointer"
            onClick={() => {
              noteStore.form = {
                title: noteStore.detail.title || '',
                tags: noteStore.detail.tagOptions,
                content: noteStore.detail.content || ''
              }

              console.log(noteStore.form, noteStore.detail)
              navigate(`${RouterUrls.NOTE.URL}${RouterUrls.NOTE.EDIT.URL}`)
            }}
          >
            <div className="svg-box w-6 h-6 theme">
              <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M684.202667 117.248c15.893333-15.872 42.154667-15.36 58.922666 1.408l90.517334 90.517333c16.661333 16.661333 17.344 42.986667 1.429333 58.922667l-445.653333 445.653333c-7.936 7.914667-23.104 16.746667-34.218667 19.776l-143.701333 39.253334c-21.909333 5.994667-35.114667-7.104-29.568-28.949334l37.248-146.773333c2.773333-10.944 11.562667-26.346667 19.392-34.176l445.653333-445.653333zM268.736 593.066667c-2.901333 2.901333-8.106667 12.074667-9.130667 16.021333l-29.12 114.773333 111.957334-30.570666c4.437333-1.216 13.632-6.549333 16.810666-9.728l445.653334-445.653334-90.517334-90.496-445.653333 445.653334zM682.794667 178.986667l90.517333 90.517333-30.186667 30.186667-90.496-90.517334 30.165334-30.165333z m-362.026667 362.048l90.496 90.517333-30.165333 30.165333-90.517334-90.496 30.165334-30.186666zM170.666667 874.666667c0-11.776 9.429333-21.333333 21.461333-21.333334h661.077333a21.333333 21.333333 0 1 1 0 42.666667H192.128A21.333333 21.333333 0 0 1 170.666667 874.666667z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </Tooltip>

        <Tooltip title="删除">
          <div
            className="delete-button page-margin-left cursor-pointer"
            onClick={() => {
              Modal.confirm({
                title: '友情提醒',
                content: '是否删除当前文章?',
                onOk: async () => {
                  await noteStore.onDelete(id, () => {
                    navigate(`${RouterUrls.NOTE.URL}${RouterUrls.NOTE.LIST.URL}`)
                  })
                }
              })
            }}
          >
            <div className="svg-box w-6 h-6 theme">
              <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M872 357H152v-30c0-16.6 13.4-30 30-30h660c16.6 0 30 13.4 30 30v30z" fill="currentColor"></path>
                <path
                  d="M632 137H392c-44.2 0-80 35.8-80 80l-20 140h50l20-140c0-16.6 13.4-30 30-30h240c16.6 0 30 13.4 30 30l20 140h50l-20-140c0-44.2-35.8-80-80-80zM741.3 407c-5.2 0-9.6 4.1-10 9.3l-23.4 373.8c-1.6 26.4-26.5 46.9-52.9 46.9H369c-26.4 0-51.3-20.5-52.9-46.9l-23.4-373.8c-0.4-5.2-4.7-9.3-10-9.3h-30c-5.8 0-10.3 4.9-10 10.6L267.3 812c2.6 42.2 37.6 75 79.8 75h329.7c42.2 0 77.2-32.8 79.8-75l24.6-394.4c0.4-5.8-4.2-10.6-10-10.6h-29.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M457 777h-30c-5.5 0-10-4.5-10-10V447c0-5.5 4.5-10 10-10h30c5.5 0 10 4.5 10 10v320c0 5.5-4.5 10-10 10zM597 777h-30c-5.5 0-10-4.5-10-10V447c0-5.5 4.5-10 10-10h30c5.5 0 10 4.5 10 10v320c0 5.5-4.5 10-10 10z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </Tooltip>
      </div>
    )
  }

  const render = () => {
    return (
      <Page
        className="article-detail-page wh100 overflow-hidden"
        contentClassName="page-content position-relative overflow page-padding"
      >
        <div className="article-content flex w100 min-h100 center flex-direction-column background overflow">
          <div className="flex-align-center">
            {CommonHtmlHandler.getBackNode()}
            <p className="article-title font-bold text-xl ml-2 flex-1">{noteStore.detail?.title || ''}</p>

            {/* 操作 */}
            {getActionNode()}
          </div>
          <div className="article-desc flex-align-center">
            <div className="create flex-align-center">
              <p>发表于</p>
              <p>{noteStore.detail?.createTime || '-'}</p>
            </div>

            {!Utils.isBlank(noteStore.detail?.updateTime || '') && <span className="spec">|</span>}

            {!Utils.isBlank(noteStore.detail?.updateTime || '') && (
              <div className="update flex-align-center">
                <p>更新于</p>
                <p>{noteStore.detail?.updateTime || '-'}</p>
              </div>
            )}
          </div>

          <div className="article-desc flex-align-center">
            {(noteStore.detail?.tags || []).map((t: string = '') => {
              return (
                <div className="flex-wrap" key={t}>
                  <Tag>{t || ''}</Tag>
                </div>
              )
            })}
          </div>
          <div className="article-text flex-1">
            <div className="markdown-body">
              <Markdown
                children={noteStore.detail?.content || ''}
                options={{
                  overrides: {
                    code: SyntaxHighlightedCode
                  }
                }}
              />
            </div>
          </div>
        </div>

        <Loading show={noteStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(ArticleDetail)

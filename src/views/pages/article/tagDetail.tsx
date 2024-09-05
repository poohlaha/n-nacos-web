/**
 * @fileOverview tag detail
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/components/page'
import { Timeline } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import { ADDRESS } from '@utils/base'
import Utils from '@utils/utils'
import RouterUrls from '@route/router.url.toml'

const TagDetail = (): ReactElement => {
  const navigate = useNavigate()
  const { articleStore } = useStore()
  const [id, setId] = useState('')
  const [name, setName] = useState('')

  useMount(async () => {
    let id = ADDRESS.getAddressQueryString('id') || ''
    id = Utils.decrypt(decodeURIComponent(id))

    let name = ADDRESS.getAddressQueryString('name') || ''
    name = Utils.decrypt(decodeURIComponent(name))
    console.log('id:', id, ', name:', name)
    setId(id)
    setId(name)
    await articleStore.getTagArticleList(id)
  })

  const getContent = (name: string = '') => {
    if (Utils.isBlank(name || '')) {
      name = ADDRESS.getAddressQueryString('name') || ''
      name = Utils.decrypt(decodeURIComponent(name))
    }

    let arr = []
    arr.push({
      children: (
        <div className="timeline-title flex-align-center">
          <p>分类</p>
          <p className="spec">-</p>
          <p>{name || ''}</p>
        </div>
      ),
    })

    let map: Map<String, Array<{ [K: string]: any }>> = new Map()
    articleStore.tagArticleList.forEach((l: { [K: string]: any } = {}) => {
      let values = map.get(l.articleYear) || []
      if (values.length === 0) {
        map.set(l.articleYear, [l])
      } else {
        values.push(l)
        map.set(l.articleYear, values)
      }
    })

    // @ts-ignore
    for (let key of map.keys()) {
      arr.push({
        color: '#fa8c16',
        children: <p className="timeline-year">{key || ''}</p>,
      })

      let values = map.get(key) || []
      values.forEach((l: { [K: string]: any } = {}) => {
        arr.push({
          children: (
            <div className="timeline-article flex-direction-column">
              <div className="article-desc flex-align-center">
                <div className="svg-box">
                  <svg
                    className="svg-icon wh100 flex-center"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M667.648 85.333333L853.333333 256v597.589333A85.12 85.12 0 0 1 768.256 938.666667H255.744A85.205333 85.205333 0 0 1 170.666667 853.76V170.24C170.666667 123.392 208.853333 85.333333 256.085333 85.333333h411.562667zM597.333333 170.666667H256v682.666666h512V341.333333h-149.333333a21.504 21.504 0 0 1-21.333334-21.674666V170.666667z m42.794667 512c21.802667 0 39.808 16.341333 42.24 37.674666L682.666667 725.333333c0 23.552-19.328 42.666667-42.538667 42.666667H383.872A42.496 42.496 0 0 1 341.333333 725.333333c0-23.552 19.328-42.666667 42.538667-42.666666h256.256z m0-170.666667c21.802667 0 39.808 16.341333 42.24 37.674667L682.666667 554.666667c0 23.552-19.328 42.666667-42.538667 42.666666H383.872A42.496 42.496 0 0 1 341.333333 554.666667c0-23.552 19.328-42.666667 42.538667-42.666667h256.256zM469.333333 341.333333a42.666667 42.666667 0 0 1 0 85.333334H384a42.666667 42.666667 0 1 1 0-85.333334h85.333333z m213.333334-135.850666V256h61.952L682.666667 205.482667z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <p className="article-time">{l.articleCreateTime || ''}</p>
              </div>
              <p
                className="article-title cursor-pointer over-two-ellipsis"
                onClick={() => {
                  navigate(
                    `${RouterUrls.ARTICLE_DETAIL_URL}?id=${Utils.encrypt(encodeURIComponent(l.articleId || ''))}`
                  )
                }}
              >
                {l.articleTitle || ''}
              </p>
            </div>
          ),
        })
      })
    }

    return arr
  }

  const render = () => {
    return (
      <Page
        className="article-tag-detail-page wh100"
        navigationProps={{
          needLogo: false,
          needBack: true,
        }}
      >
        <div className="article-content h100 center overflow-y-auto flex-direction-column">
          <Timeline className="article-tag-timeline" items={getContent(name)} />
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(TagDetail)

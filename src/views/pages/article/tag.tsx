/**
 * @fileOverview Tag 列表
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/components/page'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import RouterUrls from '@route/router.url.toml'
import Utils from '@utils/utils'

const Tag = (): ReactElement => {
  const navigate = useNavigate()
  const { articleStore } = useStore()

  useMount(async () => {
    await articleStore.getTagClassify()
  })

  const render = () => {
    return (
      <Page
        className="article-tag-page"
        navigationProps={{
          needLogo: false,
          needBack: true,
        }}
      >
        <div className="article-content h100 center overflow-y-auto flex-direction-column">
          <p className="page-title">分类</p>

          <div className="article-tag-content page-margin-top">
            {articleStore.tagClassify.length > 0 &&
              articleStore.tagClassify.map((item: { [K: string]: any } = {}, index: number) => {
                return (
                  <div
                    key={item.id || index}
                    className="tag-item flex-align-center"
                    onClick={() =>
                      navigate(
                        `${RouterUrls.ARTICLE_TAG_DETAIL_URL}?id=${Utils.encrypt(
                          encodeURIComponent(item.id || '')
                        )}&name=${Utils.encrypt(encodeURIComponent(item.tagName || ''))}`
                      )
                    }
                  >
                    <div className="tag-item-link">{item.tagName || ''}</div>
                    <div className="tag-item-count">{item.articleCount || 0}</div>
                  </div>
                )
              })}
          </div>
        </div>

        <Loading show={articleStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Tag)

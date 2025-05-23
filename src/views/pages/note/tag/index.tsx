/**
 * @fileOverview Tag 列表
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import RouterUrls from '@route/router.url.toml'
import Utils from '@utils/utils'

const Tag = (): ReactElement => {
  const navigate = useNavigate()
  const { noteStore } = useStore()

  useMount(async () => {
    await noteStore.getTagClassify()
  })

  const render = () => {
    return (
      <Page
        className="article-tag-page wh100 overflow-hidden"
        contentClassName="page-content position-relative overflow page-padding"
        title={{
          label: '分类',
          needBack: true
        }}
      >
        <div className="article-content p-4 min-h100 center flex-direction-column overflow background rounded-md">
          <div className="article-tag-content mt-3">
            {noteStore.tagClassify.length > 0 &&
              noteStore.tagClassify.map((item: { [K: string]: any } = {}, index: number) => {
                return (
                  <div
                    key={item.id || index}
                    className="tag-item flex-align-center"
                    onClick={() =>
                      navigate(
                        `${RouterUrls.NOTE.URL}${RouterUrls.NOTE.TAGDETAIL.URL}?id=${Utils.encrypt(
                          encodeURIComponent(item.id || '')
                        )}&name=${Utils.encrypt(encodeURIComponent(item.tagName || ''))}&title=${Utils.encrypt(
                          encodeURIComponent('分类')
                        )}`
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

        <Loading show={noteStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(Tag)

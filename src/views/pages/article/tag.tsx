/**
 * @fileOverview Tag 列表
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/components/page'

const Tag = (): ReactElement => {

  const render = () => {
    return (
        <Page
            className="article-tag-page"
            pageBodyClassName="center"
            navigationProps={{
                needLogo: false,
                needBack: true,
            }}
        >
         <div className="article-content h100">
             <p className="page-title">分类</p>
         </div>

        </Page>
    )
  }

  return render()
}

export default observer(Tag)
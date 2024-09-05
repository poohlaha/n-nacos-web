/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Navigation from '@pages/home/navigation'
import { Input, Select, Modal, Tooltip } from 'antd'
import { useStore } from '@views/stores'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { useNavigate } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/components/page/type'

const ArticleEdit = (): ReactElement => {
  const navigate = useNavigate()
  const { articleStore } = useStore()

  const [open, setOpen] = useState(false)

  useMount(async () => {
    await articleStore.getTagList()
  })
  const getNavigationLeftNode = () => {
    return (
      <Tooltip title="保存">
        <div
          className="save-button page-margin-left cursor-pointer"
          onClick={() => {
            setOpen(true)
          }}
        >
          <div className="svg-box">
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M814.805 128a51.179 51.179 0 0 1 51.179 51.179V844.01a51.179 51.179 0 0 1-51.179 51.157H201.173a51.179 51.179 0 0 1-51.178-51.157V179.179A51.179 51.179 0 0 1 201.173 128h613.654zM329.024 434.837a51.093 51.093 0 0 1-51.179-51.093V179.157h-76.672v664.854h613.76V179.179H738.22v204.48a51.179 51.179 0 0 1-51.179 51.178H329.024z m0-51.093h357.995V179.157H329.024v204.587z m357.91 204.501a25.557 25.557 0 1 1 0.085 51.072H329.024a25.536 25.536 0 1 1 0-51.072h357.91z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </Tooltip>
    )
  }

  const render = () => {
    return (
      <div className="article-edit-page wh100">
        <Navigation
          needLogo={false}
          needBack={true}
          leftNode={getNavigationLeftNode()}
          onBack={() => {
            if (
              articleStore.form.content !== (articleStore.detail.content || '') ||
              (articleStore.form.tags || []).join(',') !== (articleStore.detail.tagOptions || []).join(',') ||
              articleStore.form.title !== (articleStore.detail.title || '')
            ) {
              Modal.confirm({
                title: '写作',
                content: '当前内容未保存, 是否退出?',
                onOk: () => {
                  articleStore.form = Utils.deepCopy(articleStore.defaultForm)
                  // navigate(RouterUrls.ARTICLE_URL)
                  window.history.go(-1)
                },
              })
            } else {
              articleStore.form = Utils.deepCopy(articleStore.defaultForm)
              // navigate(RouterUrls.ARTICLE_URL)
              window.history.go(-1)
            }
          }}
        />

        <div className="content-box flex-direction-column w100">
          <div className="article-content flex wh100">
            <div className="article-content-left flex-1">
              <Input.TextArea
                placeholder="请输入"
                value={articleStore.form.content}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  articleStore.form.content = e.target.value || ''
                }}
              />
            </div>
            <div className="article-content-right flex-1 cursor-pointer overflow">
              <div className="markdown-body">
                <Markdown
                  children={articleStore.form.content}
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

        <Modal
          title="添加进程"
          open={open}
          onOk={async () => {
            await articleStore.onSaveOrUpdate(async () => {
              articleStore.form = Utils.deepCopy(articleStore.defaultForm)
              setOpen(false)
              window.history.go(-1)
              articleStore.detail = {}
              // await articleStore.getTagList()
            })
          }}
          onCancel={() => setOpen(false)}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
        >
          <div className="modal-body w100 flex-align-center flex-direction-column">
            <div className="form-item w100 flex-align-center page-margin-top">
              <div className="flex-align-center title-box wh100">
                <div className="label page-margin-right flex-align-center">
                  <p>标题</p>
                  <span className="flex-center">*</span>
                </div>

                <Input
                  placeholder="请输入"
                  value={articleStore.form.title || ''}
                  allowClear
                  onChange={e => {
                    articleStore.form.title = e.target.value || ''
                  }}
                />
              </div>
            </div>

            <div className="form-item w100 flex-align-center page-margin-top">
              <div className="flex-align-center title-box wh100">
                <div className="label page-margin-right flex-align-center">
                  <p>标签</p>
                  <span className="flex-center">*</span>
                </div>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  maxCount={10}
                  placeholder="请选择标签"
                  value={articleStore.form.tags || []}
                  onChange={(values: Array<string> = []) => {
                    articleStore.form.tags = values.map((v: string = '') => {
                      return { label: v || '', value: v || '' }
                    })
                  }}
                  options={articleStore.tagList || []}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  return render()
}

export default observer(ArticleEdit)

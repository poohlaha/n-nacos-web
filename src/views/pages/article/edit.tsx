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
import RouterUrls from '@route/router.url.toml'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/components/page/type'

const ArticleEdit = (): ReactElement => {
  const navigate = useNavigate()
  const { articleStore } = useStore()

  const [content, setContent] = useState('')
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
                d="M1022.503684 339.908142v-17.102296c0-0.732956-4.031256-24.431852-6.107963-32.372204a164.487444 164.487444 0 0 0-17.835252-29.929019l-7.512795-8.001432L788.324382 37.747211l-5.802565-6.107963a120.815508 120.815508 0 0 0-82.823979-31.150611l-6.901998-0.488637H184.735476A183.971846 183.971846 0 0 0 1.130108 184.094005v655.75091a184.155085 184.155085 0 0 0 183.727528 184.094005h654.162839a184.155085 184.155085 0 0 0 183.727527-184.094005V339.908142zM184.002521 98.216045h505.067462v96.627975a105.301282 105.301282 0 0 1-104.995885 105.240203H288.937325a105.301282 105.301282 0 0 1-104.995884-105.240203zM839.75343 926.51691H484.819699v-251.098359h-189.346853v251.098359H184.002521V635.350313a85.511482 85.511482 0 0 1 85.511482-85.511482h484.911184a85.511482 85.511482 0 0 1 85.511482 85.511482v291.044438z"
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
              (articleStore.form.tags || []).join(',') !== (articleStore.detail.tags || []).join(',') ||
              articleStore.form.title !== (articleStore.detail.title || '')
            ) {
              Modal.confirm({
                title: '写作',
                content: '当前内容未保存, 是否退出?',
                onOk: () => {
                  articleStore.form = Utils.deepCopy(articleStore.defaultForm)
                  navigate(RouterUrls.ARTICLE_URL)
                },
              })
            } else {
              articleStore.form = Utils.deepCopy(articleStore.defaultForm)
              navigate(RouterUrls.ARTICLE_URL)
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
                  setContent(e.target.value || '')
                  articleStore.form.content = e.target.value || ''
                }}
              />
            </div>
            <div className="article-content-right flex-1 cursor-pointer overflow">
              <div className="markdown-body">
                <Markdown
                  children={content}
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
            await articleStore.onSave(async () => {
              articleStore.form = Utils.deepCopy(articleStore.defaultForm)
              setOpen(false)
              setContent('')
              await articleStore.getTagList()
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

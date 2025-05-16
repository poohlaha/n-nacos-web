/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Select, Modal, Tooltip } from 'antd'
import { useStore } from '@views/stores'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/modules/page/type'
import Loading from '@views/components/loading/loading'
import Page from '@views/modules/page'
import CommonHtmlHandler from '@views/handlers/common'

const ArticleEdit = (): ReactElement => {
  const { noteStore } = useStore()

  const [open, setOpen] = useState(false)

  useMount(async () => {
    await noteStore.getTagList()
  })

  const getActionNode = () => {
    return (
      <Tooltip title="保存">
        <div
          className="save-button page-margin-left cursor-pointer"
          onClick={() => {
            setOpen(true)
          }}
        >
          <div className="svg-box w-5 h-5 theme">
            <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
      <Page className="article-edit-page wh100">
        <div className="flex-align-center p-4">
          {CommonHtmlHandler.getBackNode()}
          {getActionNode()}
        </div>

        <div className="article-content flex wh100">
          <div className="article-content-left flex-1">
            <Input.TextArea
              placeholder="请输入"
              value={noteStore.form.content}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                noteStore.form.content = e.target.value || ''
              }}
            />
          </div>
          <div className="article-content-right flex-1 cursor-pointer overflow">
            <div className="markdown-body">
              <Markdown
                children={noteStore.form.content}
                options={{
                  overrides: {
                    code: SyntaxHighlightedCode
                  }
                }}
              />
            </div>
          </div>
        </div>

        <Modal
          title="添加/修改文章"
          open={open}
          onOk={async () => {
            await noteStore.onSaveOrUpdate(async () => {
              noteStore.form = Utils.deepCopy(noteStore.defaultForm)
              setOpen(false)
              window.history.go(-1)
              noteStore.detail = {}
              // await noteStore.getTagList()
            })
          }}
          onCancel={() => setOpen(false)}
          closable={false}
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
                  value={noteStore.form.title || ''}
                  allowClear
                  onChange={e => {
                    noteStore.form.title = e.target.value || ''
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
                  value={noteStore.form.tags || []}
                  onChange={(values: Array<string> = []) => {
                    noteStore.form.tags = values.map((v: string = '') => {
                      return { label: v || '', value: v || '' }
                    })
                  }}
                  options={noteStore.tagList || []}
                />
              </div>
            </div>
          </div>
        </Modal>

        <Loading show={noteStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(ArticleEdit)

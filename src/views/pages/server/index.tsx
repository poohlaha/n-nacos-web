/**
 * @fileOverview 服务器列表
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import { useStore } from '@views/stores'
import RouterUrls from '@route/router.url.toml'
import { Button, Input, Modal, Pagination, Popconfirm, Table } from 'antd'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router'

const Server = (): ReactElement => {
  const { serverStore } = useStore()
  const navigate = useNavigate()

  useMount(async () => {
    await serverStore.getList()

    // 设置 table 最大高度
    const node = document.querySelector('.server-page')
    const titleNode = document.querySelector('.page-title')
    const paginationNode = document.querySelector('.page-pagination')
    if (!node) return

    const rect = node.getBoundingClientRect()
    let height = rect.height || 0
    if (titleNode) {
      let titleRect = titleNode.getBoundingClientRect()
      height -= titleRect.height
    }

    if (paginationNode) {
      let paginationRect = paginationNode.getBoundingClientRect()
      height -= paginationRect.height
    }

    if (height > 0) {
      let tableBodyNode = document.querySelector('.ant-table-body')
      if (tableBodyNode) {
        const tableBodyDom = tableBodyNode as HTMLDivElement
        tableBodyDom.style.maxHeight = `${height}px`
      }
    }
  })

  const COLUMNS: any = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 100
    },
    {
      title: '服务器名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '服务器IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 150
    },
    {
      title: '服务器端口',
      dataIndex: 'port',
      key: 'port',
      width: 120
    },
    {
      title: '服务器账号',
      dataIndex: 'account',
      key: 'account',
      width: 150
    },
    {
      title: '描述信息',
      dataIndex: 'desc',
      key: 'desc',
      width: 200,
      render: (_: any, record: { [K: string]: any } = {}) => {
        return (
          <div
            dangerouslySetInnerHTML={{ __html: record.desc || '' }}
            className="color-gray-lighter"
            style={{ whiteSpace: 'pre-line' }}
          ></div>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      // eslint-disable-next-line react/display-name
      render: (_: any, record: { [K: string]: any } = {}) => {
        return (
          <div className="actions flex-align-center flex-jsc-end">
            <div
              className="theme-blue-color mr-2"
              onClick={() => {
                navigate(
                  `${RouterUrls.SERVER.URL}${RouterUrls.SERVER.DETAIL.URL}?&id=${Utils.encrypt(encodeURIComponent(record.id || ''))}`
                )
              }}
            >
              详情
            </div>
            <div
              className="theme-blue-color mr-2"
              onClick={() => {
                serverStore.showAddDialog = true
                serverStore.form = Utils.deepCopy(record)
              }}
            >
              修改
            </div>
            <Popconfirm
              rootClassName="m-ant-popover"
              title={RouterUrls.SERVER.LIST.NAME}
              description="是否删除此项?"
              key={record.id}
              onConfirm={async () => {
                await serverStore.deleteServer(record.id || '')
              }}
              okText="确定"
              cancelText="取消"
            >
              <div className="red">删除</div>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const render = () => {
    return (
      <Page
        className="server-page wh100 overflow"
        loading={serverStore.loading}
        contentClassName="content-box wh100 flex-direction-column"
      >
        {/* title */}
        <div className="page-title flex-align-center">
          <p className="flex-1 font-bold text-xl">{RouterUrls.SERVER.LIST.NAME}</p>
          <Button
            type="primary"
            className="m-ant-button ml-3"
            onClick={async () => {
              serverStore.form = Utils.deepCopy(serverStore.defaultForm)
              serverStore.showAddDialog = true
            }}
          >
            添 加
          </Button>
        </div>

        {/* table */}
        <div className="page-wrapper flex-1 flex-direction-column pt-5">
          {/* table */}
          <Table
            className="m-ant-table flex-1"
            columns={COLUMNS}
            scroll={{ x: 1500, y: 300 }}
            dataSource={serverStore.list || []}
            pagination={false}
          />
          {/* pagination */}
          <div className="flex-jsc-end h-20 flex-align-center page-pagination">
            <Pagination
              className="m-ant-pagination"
              showSizeChanger={false}
              total={serverStore.list.length}
              current={serverStore.currentPage}
              pageSize={serverStore.pageSize}
              pageSizeOptions={serverStore.pageSizeOptions}
              showTotal={total => `共 ${total} 条`}
              onChange={async (page: number, pageSize: number) => {
                serverStore.currentPage = serverStore.pageSize !== pageSize ? 1 : page
                serverStore.pageSize = pageSize
                await serverStore.getList()
              }}
            />
          </div>
        </div>

        {/* 添加服务器 */}
        <Modal
          title="添加/编辑服务器"
          open={serverStore.showAddDialog}
          onOk={async () => serverStore.onSave()}
          okText="确定"
          cancelText="取消"
          onCancel={() => (serverStore.showAddDialog = false)}
          closable={false}
          maskClosable={false}
        >
          <div className="modal-body flex-direction-column">
            <div className="ip form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>服务器IP</p>
                <span className="flex-center">*</span>
              </div>

              <Input
                placeholder="请输入服务器IP"
                status={serverStore.form.error || ''}
                maxLength={20}
                value={serverStore.form.ip}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target
                  serverStore.form.ip = value || ''
                  if (!Utils.isBlank(value || '')) {
                    // serverStore.form.error = ''
                  }
                }}
              />
            </div>

            <div className="port form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>服务器端口</p>
              </div>

              <Input
                placeholder="请输入服务器端口"
                maxLength={10}
                value={serverStore.form.port}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target
                  if (!serverStore.PORT_REG.test(value)) {
                    return
                  }
                  serverStore.form.port = value
                }}
              />
            </div>

            <div className="account form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>服务器账号</p>
                <span className="flex-center">*</span>
              </div>

              <Input
                placeholder="请输入服务器账号"
                maxLength={200}
                value={serverStore.form.account}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target
                  serverStore.form.account = value || ''
                  if (!Utils.isBlank(value || '')) {
                    // serverStore.form.error = ''
                  }
                }}
              />
            </div>

            <div className="pwd form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>服务器密码</p>
                <span className="flex-center">*</span>
              </div>

              <Input.Password
                placeholder="请输入服务器密码"
                status={serverStore.form.error || ''}
                maxLength={200}
                value={serverStore.form.pwd}
                allowClear
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target
                  serverStore.form.pwd = value || ''
                  if (!Utils.isBlank(value || '')) {
                    //  serverStore.form.error = ''
                  }
                }}
              />
            </div>

            <div className="name form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>服务器名称</p>
              </div>

              <Input
                placeholder="请输入服务器名称"
                maxLength={100}
                value={serverStore.form.name}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target
                  serverStore.form.name = value || ''
                }}
              />
            </div>

            <div className="desc form-item page-margin-top  flex-align-center">
              <div className="label page-margin-right flex-align-center">
                <p>描述信息</p>
              </div>
              <Input.TextArea
                placeholder="请输入描述信息"
                maxLength={200}
                value={serverStore.form.desc}
                allowClear
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  const { value } = e.target
                  serverStore.form.desc = value || ''
                }}
              />
            </div>
          </div>
        </Modal>
      </Page>
    )
  }

  return render()
}

export default observer(Server)

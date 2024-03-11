/**
 * 主页面, 包括上部、左侧导航和右侧页面显示
 */
import React, {ReactElement} from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Navigation from '@pages/home/navigation'
import {Popconfirm, Button, Modal, Input, Tooltip} from 'antd'
import ServerPng from '@assets/images/server.png'
import { EditOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import NoData from '@views/components/noData'
import useMount from '@hooks/useMount'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'

const Main: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {

    const {mainStore, homeStore} = useStore()
    const navigate = useNavigate()
    useMount(async () => {
        await mainStore.getServerList()
    })

    const onEditConfirm = (item: {[K: string]: any} = {}) => {
        mainStore.showAddDialog = true
        mainStore.form = Utils.deepCopy(item)
    }

    const onDeleteConfirm = async (item: {[K: string]: any} = {}) => {
       await mainStore.deleteServer(item.id || '')
    }

    const toPage = (item: {[K: string]: any} = {}) => {
        mainStore.onSelectServer(item)
        homeStore.reset()
        navigate(`${RouterUrls.HOME_URL}/${RouterUrls.DASHBOARD_URL}`)
    }

    const render = () => {
        // @ts-ignore
        return (
            <div className="main-page page flex-direction-column wh100">
                {/* 导航栏 */}
                <Navigation />

                {/* 服务器列表 */}
                <div className="server-box page-padding flex flex-direction-column">
                    <div className="status-bar flex-jsc-end">
                        <Button className="add" type="text" onClick={() => {
                            mainStore.form = Utils.deepCopy(mainStore.defaultForm)
                            mainStore.showAddDialog = true
                        }}>添加</Button>
                    </div>

                    {
                        mainStore.serverList.length === 0 && !mainStore.loading && (
                            <div className="flex-1">
                                <NoData />
                            </div>
                        )
                    }

                    {
                        mainStore.serverList.length > 0 && (
                            <div className="server-list flex-wrap page-margin-top">
                                {
                                    mainStore.serverList.map((item: {[K: string]: any} = {}, index: number = 0) => {
                                        return (
                                            <div
                                                className="m-card m-card-border m-card-border-radius page-margin-right page-margin-bottom cursor-pointer"
                                                key={index}
                                            >
                                                <div className="m-card-cover" onClick={() => toPage(item)}>
                                                    <img alt="server" src={ServerPng}/>
                                                </div>

                                                <div className="m-card-body" onClick={() => toPage(item)}>
                                                    <div className="m-card-meta">
                                                        <div
                                                            className="m-card-meta-title">{item.ip || ''}</div>
                                                        <div
                                                            className="m-card-meta-name">{item.name || ''}</div>
                                                        <div className="m-card-meta-desc"
                                                             style={{whiteSpace: 'pre-line'}}
                                                             dangerouslySetInnerHTML={{__html: item.desc || ''}}/>
                                                    </div>
                                                </div>

                                                <ul className="m-card-actions">
                                                    <li onClick={() => onEditConfirm(item)}>
                                                       <div className="svg-box wh100 border-right">
                                                            {/* @ts-ignore */}
                                                           <EditOutlined />
                                                       </div>
                                                    </li>
                                                    <Popconfirm
                                                        key="delete"
                                                        title="友情提示"
                                                        description="确定删除此服务器?"
                                                        onConfirm={async () => await onDeleteConfirm(item)}
                                                        okText="确定"
                                                        cancelText="取消"
                                                    >
                                                        <li>
                                                           <div className="svg-box wh100 border-right">
                                                                {/* @ts-ignore */}
                                                               <DeleteOutlined/>
                                                           </div>
                                                        </li>
                                                    </Popconfirm>
                                                    <Tooltip
                                                        key="shell"
                                                        title="Shell"
                                                    >
                                                        <li>
                                                            <div className="svg-box">
                                                                <svg className="svg-icon"
                                                                     viewBox="0 0 1024 1024" version="1.1"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M864 96a64 64 0 0 1 64 64v704a64 64 0 0 1-64 64h-704a64 64 0 0 1-64-64v-704a64 64 0 0 1 64-64h704z m-12.8 64H172.8a12.8 12.8 0 0 0-12.8 12.8v678.4c0 7.04 5.76 12.8 12.8 12.8h678.4a12.8 12.8 0 0 0 12.8-12.8V172.8a12.8 12.8 0 0 0-12.8-12.8z"
                                                                        fill="currentColor"></path>
                                                                    <path
                                                                        d="M582.4 704h179.2a6.4 6.4 0 0 0 6.4-6.4v-51.2a6.4 6.4 0 0 0-6.4-6.4H582.4a6.4 6.4 0 0 0-6.4 6.4v51.2a6.4 6.4 0 0 0 6.4 6.4zM350.528 321.472l183.68 183.68a6.4 6.4 0 0 1 0 9.088l-183.68 183.68a12.8 12.8 0 0 1-9.024 3.84h-72.96a3.2 3.2 0 0 1-2.24-5.504L451.2 512a3.2 3.2 0 0 0 0-4.48L266.24 323.2a3.2 3.2 0 0 1 2.304-5.44h72.96a12.8 12.8 0 0 1 9.024 3.776z"
                                                                        fill="currentColor"></path>
                                                                </svg>
                                                            </div>
                                                        </li>
                                                    </Tooltip>
                                                </ul>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>

                {/* 添加服务器 */}
                <Modal
                    title="添加/编辑服务器"
                    open={mainStore.showAddDialog}
                    onOk={async () => mainStore.onSave()}
                    okText="确定"
                    cancelText="取消"
                    onCancel={() => mainStore.showAddDialog = false}
                    closable={false}
                    destroyOnClose={true}
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
                                status={mainStore.form.error || ''}
                                maxLength={20}
                                value={mainStore.form.ip}
                                allowClear
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const {value} = e.target
                                    mainStore.form.ip = value || ''
                                    if (!Utils.isBlank(value || '')) {
                                        // mainStore.form.error = ''
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
                                value={mainStore.form.port}
                                allowClear
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const {value} = e.target
                                    if (!mainStore.PORT_REG.test(value)) {
                                        return
                                    }
                                    mainStore.form.port = value
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
                                value={mainStore.form.account}
                                allowClear
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const {value} = e.target
                                    mainStore.form.account = value || ''
                                    if (!Utils.isBlank(value || '')) {
                                        // mainStore.form.error = ''
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
                                status={mainStore.form.error || ''}
                                maxLength={200}
                                value={mainStore.form.pwd}
                                allowClear
                                iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const {value} = e.target
                                    mainStore.form.pwd = value || ''
                                    if (!Utils.isBlank(value || '')) {
                                        //  mainStore.form.error = ''
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
                                value={mainStore.form.name}
                                allowClear
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const {value} = e.target
                                    mainStore.form.name = value || ''
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
                                value={mainStore.form.desc}
                                allowClear
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    const {value} = e.target
                                    mainStore.form.desc = value || ''
                                }}
                            />
                        </div>

                    </div>
                </Modal>

                <Loading show={mainStore.loading}/>
            </div>
        )
    }

    return render()
}

export default observer(Main)

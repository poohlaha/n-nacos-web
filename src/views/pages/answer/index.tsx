/**
 * @fileOverview 答题
 * @date 2024-03-11
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import { Button, Card, Descriptions, Input } from 'antd'
import { TOAST } from '@utils/base'

const Answer = (): ReactElement => {
  const { answerStore } = useStore()
  const [edit, setEdit] = useState(false)
  const [znEdit, setZnEdit] = useState(false)
  const [account, setAccount] = useState('')
  const [pwd, setPwd] = useState('')
  const [token, setToken] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showZnPwd, setShowZnPwd] = useState(false)

  useMount(async () => {
    await answerStore.onGetConfig()
  })

  const onGetOperation = (type: number = 1) => {
    let config: { [K: string]: any } = {}
    let answerEdit = type === 1 ? edit : znEdit
    if (type === 1) {
      config = answerStore.lxrConfig || {}
    } else {
      config = answerStore.znConfig || {}
    }

    if (answerEdit) {
      return (
        <div className="ml-2">
          <Button
            type="primary"
            size="small"
            className="mr-2"
            onClick={async () => {
              if (Utils.isBlank(account || '')) {
                TOAST.show({ message: '账号不能为空', type: 4 })
                return
              }

              if (Utils.isBlank(pwd || '')) {
                TOAST.show({ message: '密码不能为空', type: 4 })
                return
              }

              const saveConfig = {
                account,
                pwd,
                id: config.id || '',
                token: token || '',
                answerType: type === 1 ? answerStore.ANSWER_TYPE[0] : answerStore.ANSWER_TYPE[1]
              }

              if (type === 1) {
                answerStore.lxrConfig = saveConfig
              } else {
                answerStore.znConfig = saveConfig
              }

              await answerStore.onSaveConfig(saveConfig || {}, () => {
                if (type === 1) {
                  setEdit(false)
                } else {
                  setZnEdit(false)
                }
              })
            }}
          >
            确定
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => {
              setAccount(config.account || '')
              setPwd(config.pwd || '')
              setToken(config.token || '')
              if (type === 1) {
                setEdit(false)
              } else {
                setZnEdit(false)
              }
            }}
          >
            取消
          </Button>
        </div>
      )
    }

    return (
      <div
        className={`svg-box w-6 h-6 theme ml-2 cursor-pointer ${(type === 1 && znEdit) || (type === 2 && edit) ? 'disabled' : ''}`}
        onClick={() => {
          if (type === 1 && znEdit) {
            return
          }
          if (edit) {
            return
          }
          setAccount(config.account || '')
          setPwd(config.pwd || '')
          setToken(config.token || '')
          if (type === 1) {
            setEdit(true)
          } else {
            setZnEdit(true)
          }
        }}
      >
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M684.202667 117.248c15.893333-15.872 42.154667-15.36 58.922666 1.408l90.517334 90.517333c16.661333 16.661333 17.344 42.986667 1.429333 58.922667l-445.653333 445.653333c-7.936 7.914667-23.104 16.746667-34.218667 19.776l-143.701333 39.253334c-21.909333 5.994667-35.114667-7.104-29.568-28.949334l37.248-146.773333c2.773333-10.944 11.562667-26.346667 19.392-34.176l445.653333-445.653333zM268.736 593.066667c-2.901333 2.901333-8.106667 12.074667-9.130667 16.021333l-29.12 114.773333 111.957334-30.570666c4.437333-1.216 13.632-6.549333 16.810666-9.728l445.653334-445.653334-90.517334-90.496-445.653333 445.653334zM682.794667 178.986667l90.517333 90.517333-30.186667 30.186667-90.496-90.517334 30.165334-30.165333z m-362.026667 362.048l90.496 90.517333-30.165333 30.165333-90.517334-90.496 30.165334-30.186666zM170.666667 874.666667c0-11.776 9.429333-21.333333 21.461333-21.333334h661.077333a21.333333 21.333333 0 1 1 0 42.666667H192.128A21.333333 21.333333 0 0 1 170.666667 874.666667z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    )
  }

  /*
  const getRightNode = () => {
    return (
      <Button
        type="primary"
        onClick={async () => await answerStore.start()}
      >
        开始答题
      </Button>
    )
  }
   */

  const render = () => {
    return (
      <Page
        className="answer-page overflow-y-auto"
        loading={answerStore.loading}
        title={{
          label: RouterUrls.ANSWER.NAME
        }}
      >
        <div className="pb-4">
          {/* 账号密码 */}
          <Card title="零信任信息" className="server-info-card m-ant-card white" extra={onGetOperation()}>
            <Descriptions bordered column={2} layout="vertical">
              <Descriptions.Item label="账号">
                {edit ? (
                  <div className="flex-align-center">
                    <Input
                      className="m-ant-input"
                      placeholder="请输入"
                      maxLength={300}
                      value={account}
                      allowClear
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAccount(e.target.value)
                      }}
                    />
                  </div>
                ) : (
                  <p className="mr-2">{answerStore.lxrConfig.account || ''}</p>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="密码">
                {edit ? (
                  <div className="flex-align-center">
                    <Input.Password
                      className="m-ant-input"
                      placeholder="请输入"
                      maxLength={300}
                      value={pwd}
                      allowClear
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPwd(e.target.value)
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-align-center">
                    <p className="mr-2 flex-1">
                      {showPwd
                        ? answerStore.lxrConfig.pwd || ''
                        : Utils.isBlank(answerStore.lxrConfig.pwd || '')
                          ? ''
                          : '*********'}
                    </p>
                    {!Utils.isBlank(answerStore.lxrConfig.pwd || '') && (
                      <div className="buttons">
                        <Button className="m-ant-button" type="link" onClick={() => setShowPwd(!showPwd)}>
                          {showPwd ? '隐藏' : '查看'}
                        </Button>

                        <Button
                          className="m-ant-button"
                          type="link"
                          onClick={() => {
                            try {
                              const tempInput = document.createElement('textarea')
                              tempInput.value = answerStore.lxrConfig.pwd
                              document.body.appendChild(tempInput)
                              tempInput.select()
                              document.execCommand('copy')
                              document.body.removeChild(tempInput)
                              TOAST.show({ message: '复制成功', type: 2 })
                            } catch (e) {
                              console.error(e)
                              TOAST.show({ message: '复制失败', type: 4 })
                            }
                          }}
                        >
                          复制
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Descriptions.Item>

              {/*
              <Descriptions.Item label="科技门户 Token">
                <div className="flex-align-center flex-1">
                  {edit ? (
                    <div className="flex-align-center flex-1">
                      <Input
                        className="m-ant-input"
                        placeholder="请输入"
                        maxLength={800}
                        value={token}
                        allowClear
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setToken(e.target.value)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-align-center flex-1">
                      <p className="flex-1">{answerStore.lxrConfig.token || ''}</p>
                      <Button className="m-ant-button" type="link" onClick={() => getToken()}>
                        获取 Token
                      </Button>
                    </div>
                  )}
                </div>
              </Descriptions.Item>
              */}
            </Descriptions>
          </Card>

          {/* 知鸟账号密码 */}
          <Card title="知鸟信息" className="server-info-card m-ant-card white mt-4" extra={onGetOperation(2)}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="账号">
                {znEdit ? (
                  <div className="flex-align-center">
                    <Input
                      className="m-ant-input"
                      placeholder="请输入"
                      maxLength={300}
                      value={account}
                      allowClear
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAccount(e.target.value)
                      }}
                    />
                  </div>
                ) : (
                  <p className="mr-2">{answerStore.znConfig.account || ''}</p>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="密码">
                {znEdit ? (
                  <div className="flex-align-center">
                    <Input.Password
                      className="m-ant-input"
                      placeholder="请输入"
                      maxLength={300}
                      value={pwd}
                      allowClear
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPwd(e.target.value)
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-align-center">
                    <p className="mr-2 flex-1">
                      {showZnPwd
                        ? answerStore.znConfig.pwd || ''
                        : Utils.isBlank(answerStore.znConfig.pwd || '')
                          ? ''
                          : '*********'}
                    </p>
                    {!Utils.isBlank(answerStore.znConfig.pwd || '') && (
                      <div className="buttons">
                        <Button className="m-ant-button" type="link" onClick={() => setShowZnPwd(!showZnPwd)}>
                          {showZnPwd ? '隐藏' : '查看'}
                        </Button>

                        <Button
                          className="m-ant-button"
                          type="link"
                          onClick={() => {
                            try {
                              const tempInput = document.createElement('textarea')
                              tempInput.value = answerStore.znConfig.pwd
                              document.body.appendChild(tempInput)
                              tempInput.select()
                              document.execCommand('copy')
                              document.body.removeChild(tempInput)
                              TOAST.show({ message: '复制成功', type: 2 })
                            } catch (e) {
                              console.error(e)
                              TOAST.show({ message: '复制失败', type: 4 })
                            }
                          }}
                        >
                          复制
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(Answer)

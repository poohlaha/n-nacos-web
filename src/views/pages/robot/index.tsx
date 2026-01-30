/**
 * @fileOverview 机器人
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
import { Button, Card, Collapse, Drawer, Input } from 'antd'
import { TOAST } from '@utils/base'

const Robot = (): ReactElement => {
  const { robotStore } = useStore()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [edit, setEdit] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)

  useMount(async () => {
    await robotStore.onGetConfig()
  })

  const onGetOperation = () => {
    if (edit) {
      return (
        <div className="ml-2">
          <Button
            type="primary"
            size="small"
            className="mr-2"
            onClick={async () => {
              if (Utils.isBlank(url || '')) {
                TOAST.show({ message: '地址不能为空', type: 4 })
                return
              }

              robotStore.config.name = name || ''
              robotStore.config.url = url || ''
              await robotStore.onSave(() => {
                setEdit(false)
                // 刷新 iframe
                onRefresh()
              })
            }}
          >
            确定
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => {
              setName(robotStore.config.name || '')
              setUrl(robotStore.config.url || '')
              setEdit(false)
            }}
          >
            取消
          </Button>
        </div>
      )
    }

    return (
      <div
        className={`svg-box w-6 h-6 theme ml-2 cursor-pointer ${edit ? 'disabled' : ''}`}
        onClick={() => {
          setName(robotStore.config.name || '')
          setUrl(robotStore.config.url || '')
          setEdit(true)
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

  const onRefresh = () => {
    let iframe = document.getElementById('clawdbot-frame')
    if (iframe) {
      // @ts-ignore
      iframe.src = robotStore.config.url || ''
    }
  }

  const getRightNode = () => {
    return (
      <div className="flex-align-center">
        {onGetOperation()}
        <Button color="default" variant="dashed" className="ml-4" onClick={() => setShowDrawer(true)}>
          使用手册
        </Button>
        {!edit && (
          <Button type="link" className="ml-1" onClick={() => onRefresh()}>
            刷新
          </Button>
        )}
      </div>
    )
  }

  const onCopy = (text: string = '') => {
    try {
      const tempInput = document.createElement('textarea')
      tempInput.value = text
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      TOAST.show({ message: '复制成功', type: 2 })
    } catch (e) {
      console.error(e)
      TOAST.show({ message: '复制失败', type: 4 })
    }
  }

  const render = () => {
    return (
      <Page
        className="robot-page overflow-y-auto"
        contentClassName="flex-direction-column"
        title={{
          label: RouterUrls.ROBOT.NAME,
          right: getRightNode()
        }}
      >
        <div className="">
          <Collapse
            className="robot-collapse"
            items={[
              {
                key: '1',
                label: '配置',
                children: (
                  <div className="flex-direction-column">
                    <div className="flex border-bottom">
                      <div className="w-20 min-w-20 background-gay pt-3 pb-3 flex-center border-right">
                        <p>名称</p>
                      </div>
                      {edit ? (
                        <div className="flex-align-center flex-1 ml-4 mr-4">
                          <Input
                            className="m-ant-input"
                            placeholder="请输入"
                            maxLength={300}
                            value={name || ''}
                            allowClear
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setName(e.target.value)
                            }}
                          />
                        </div>
                      ) : (
                        <p className="mr-4 flex-1 ml-4 flex-align-center">{robotStore.config.name || ''}</p>
                      )}
                    </div>

                    <div className="flex">
                      <div className="w-20 min-w-20 background-gay pt-3 pb-3 flex-center border-right">
                        <p>聊天地址</p>
                      </div>
                      {edit ? (
                        <div className="flex-align-center flex-1 ml-4 mr-4">
                          <Input
                            className="m-ant-input"
                            placeholder="请输入"
                            maxLength={300}
                            value={url || ''}
                            allowClear
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setUrl(e.target.value)
                            }}
                          />
                        </div>
                      ) : (
                        <p className="mr-4 flex-1 ml-4 flex-align-center">{robotStore.config.url || ''}</p>
                      )}
                    </div>
                  </div>
                )
              }
            ]}
          />
        </div>
        <div className="pt-4 w100 flex-1">
          {!Utils.isBlank(robotStore.config.url || '') && (
            <iframe
              id="clawdbot-frame"
              title="机器人聊天窗口"
              src={robotStore.config.url || ''}
              style={{
                border: 'none'
              }}
              className="wh100"
            ></iframe>
          )}
        </div>

        <Drawer
          rootClassName="m-ant-drawer"
          title="使用手册"
          placement="right"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
        >
          <Card
            title="官网"
            type="inner"
            extra={
              <a className="theme" href="https://openclaw.ai" target="_blank" rel="noreferrer">
                打开
              </a>
            }
          >
            <p className="theme">https://openclaw.ai</p>
          </Card>

          <Card
            className="mt-4"
            title="官方文档"
            type="inner"
            extra={
              <a
                className="theme"
                href="https://docs.openclaw.ai/start/getting-started"
                target="_blank"
                rel="noreferrer"
              >
                打开
              </a>
            }
          >
            <p className="theme">https://docs.openclaw.ai/start/getting-started</p>
          </Card>

          <Card className="mt-4" title="安装" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">curl</p>
                <p className="ml-1 color-gray">-fsSL</p>
                <p className="ml-1 theme">https://molt.bot/install.sh</p>
                <p className="ml-1 color-gray">|</p>
                <p className="ml-1 color-gray">bash</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy('curl -fsSL https://molt.bot/install.sh | bash')}
              >
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="配置" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">onboard</p>
                <p className="ml-2 color-desc"># 初始化/引导配置</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy(`${robotStore.config.name || ''} onboard`)}>
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">configure</p>
                <p className="ml-2 color-desc"># 修改配置</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy(`${robotStore.config.name || ''} configure`)}>
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="网关" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">gateway</p>
                <p className="ml-1 color-gray">status</p>
                <p className="ml-2 color-desc"># 查看网关状态</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} gateway status`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">gateway</p>
                <p className="ml-1 color-gray">install</p>
                <p className="ml-2 color-desc"># 修复网关</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} gateway install`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">gateway</p>
                <p className="ml-1 color-gray">restart</p>
                <p className="ml-2 color-desc"># 重启网关</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} gateway restart`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">gateway</p>
                <p className="ml-1 color-gray">start</p>
                <p className="ml-2 color-desc"># 启动网关</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} gateway start`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">gateway</p>
                <p className="ml-1 color-gray">stop</p>
                <p className="ml-2 color-desc"># 关闭网关</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} gateway stop`)}
              >
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="勾子" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">hooks</p>
                <p className="ml-1 red">disable</p>
                <p className="ml-1 color-gray">session-memory</p>
                <p className="ml-2 color-desc"># 关闭全局记忆</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} hooks disable session-memory`)}
              >
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="控制面板 / UI" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">dashboard</p>
                <p className="ml-2 color-desc"># 打开 Control UI(自动打开浏览器, 获取带 Token 的完整地址)</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy(`${robotStore.config.name || ''} dashboard`)}>
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="发送消息" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">agent</p>
                <p className="ml-1 color-gray">--agent</p>
                <p className="ml-1 theme">main</p>
                <p className="ml-1 color-gray">--local</p>
                <p className="ml-1 color-gray">--message</p>
                <p className="ml-1 color-gray">"hello"</p>
                <p className="ml-2 color-desc"># 关闭全局记忆</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} agent --agent main --local --message "hello"`)}
              >
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="配置文件" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="ml-1 theme">cat</p>
                <p className="ml-1 color-gray">~/.clawdbot/clawdbot.json</p>
                <p className="ml-2 color-desc"># 查看配置文件</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('cat ~/.clawdbot/clawdbot.json')}>
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 theme">cat</p>
                <p className="ml-1 color-gray">~/.clawdbot/agents/main/sessions/sessions.json</p>
                <p className="ml-2 color-desc"># 查看 session</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy('cat ~/.clawdbot/agents/main/sessions/sessions.json')}
              >
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="插件" type="inner">
            <Card
              title="飞书"
              type="inner"
              extra={
                <a
                  className="theme"
                  href="https://www.cnblogs.com/catchadmin/p/19545341"
                  target="_blank"
                  rel="noreferrer"
                >
                  安装教程
                </a>
              }
            >
              <div className="flex-align-center">
                <div className="flex-align-center flex-1">
                  <p className="ml-1 theme">{robotStore.config.name || ''}</p>
                  <p className="ml-1 color-gray">plugins</p>
                  <p className="ml-1 color-gray">install</p>
                  <p className="ml-1 color-gray">@m1heng-clawd/feishu</p>
                  <p className="ml-2 color-desc"># 飞书</p>
                </div>
                <p
                  className="theme cursor-pointer"
                  onClick={() => onCopy(`${robotStore.config.name || ''} plugins install @m1heng-clawd/feishu`)}
                >
                  复制
                </p>
              </div>
            </Card>
          </Card>

          <Card className="mt-4" title="端口" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="ml-1 theme">lsof</p>
                <p className="ml-1 color-gray">-i</p>
                <p className="ml-1 color-gray">:18789</p>
                <p className="ml-2 color-desc"># Control UI</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('lsof -i :18789')}>
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 theme">lsof</p>
                <p className="ml-1 color-gray">-i</p>
                <p className="ml-1 color-gray">:18792</p>
                <p className="ml-2 color-desc"># Browser Relay</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('lsof -i :18792')}>
                复制
              </p>
            </div>
          </Card>

          <Card className="mt-4" title="三层结构" type="inner">
            <div className="flex-align-center">
              <div className="flex-direction-column flex-1 color-gray">
                <p className="">Gateway（后端） ← 必须重启才能生效</p>
                <p className="ml-2">├── Agent</p>
                <p className="ml-2">├── Session / Memory</p>
                <p className="ml-2">├── Tools</p>
                <p className="ml-2">└── Auth / Token</p>
                <p>UI / iframe / 插件（客户端）</p>
              </div>
            </div>
          </Card>

          <Card className="mt-4" title="卸载" type="inner">
            <div className="flex-align-center">
              <div className="flex-align-center flex-1">
                <p className="ml-1 theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">daemon</p>
                <p className="ml-1 color-gray">--stop</p>
                <p className="ml-2 color-desc"># 停止服务</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`${robotStore.config.name || ''} daemon --stop`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 color-gray">ps</p>
                <p className="ml-1 color-gray">aux</p>
                <p className="ml-1 color-gray">|</p>
                <p className="ml-1 color-gray">grep</p>
                <p className="ml-1 theme">{robotStore.config.name || ''}</p>
                <p className="ml-1 color-gray">--stop</p>
                <p className="ml-2 color-desc"># 确认没有进程在跑</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy(`ps aux | grep ${robotStore.config.name || ''}`)}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 color-gray">rm -f ~/Library/LaunchAgents/com.clawdbot.gateway.plist</p>
                <p className="ml-2 color-desc"># 删除 LaunchAgent</p>
              </div>
              <p
                className="theme cursor-pointer"
                onClick={() => onCopy('rm -f ~/Library/LaunchAgents/com.clawdbot.gateway.plist')}
              >
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 color-gray">rm -rf ~/.clawdbot</p>
                <p className="ml-2 color-desc"># 删除本地配置和数据</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('rm -rf ~/.clawdbot')}>
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 color-gray">rm -rf ~/.pi</p>
                <p className="ml-2 color-desc"># 删除本地配置和数据</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('rm -rf ~/.pi')}>
                复制
              </p>
            </div>

            <div className="flex-align-center mt-4">
              <div className="flex-align-center flex-1">
                <p className="ml-1 color-gray">rm -rf ~/.clawd</p>
                <p className="ml-2 color-desc"># 删除本地配置和数据</p>
              </div>
              <p className="theme cursor-pointer" onClick={() => onCopy('rm -rf ~/.clawd')}>
                复制
              </p>
            </div>
          </Card>
        </Drawer>
      </Page>
    )
  }

  return render()
}

export default observer(Robot)

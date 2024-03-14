/**
 * 添加/编辑流水线
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import useMount from '@hooks/useMount'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Input, Tabs, Tooltip } from 'antd'
import { open } from '@tauri-apps/plugin-dialog'
import PipelineProcess from '../process'
import PipelineVariable from './variable'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { H5_LOCAL_TEMPLATE, H5_REMOTE_TEMPLATE, updateMarket } from '../process/templates/h5'
import Page from '@views/components/page'
import { ADDRESS } from '@utils/base'
import MarketTemplateData from '@pages/delivery/pipelineMarket/templates/template.json'

// eslint-disable-next-line no-undef
const PipelineAdd: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const navigate = useNavigate()

  const { pipelineStore, homeStore } = useStore()

  useMount(async () => {
    let id = ADDRESS.getAddressQueryString('id') || ''
    let serverId = ADDRESS.getAddressQueryString('serverId') || ''
    pipelineStore.isEditor = false

    if (!Utils.isBlank(id) && !Utils.isBlank(serverId)) {
      id = Utils.decrypt(decodeURIComponent(id))
      serverId = Utils.decrypt(decodeURIComponent(serverId))
      await pipelineStore.getDetailInfo(id, serverId)
      pipelineStore.setAddForm(pipelineStore.detailInfo || {})
      pipelineStore.activeProcess = getDetailActiveProcess(pipelineStore.detailInfo?.processConfig?.stages || [])
      pipelineStore.isEditor = true
    }
  })

  const getDetailActiveProcess = (stages: Array<{ [K: string]: any }> = []) => {
    if (stages.length === 0) return []

    let processes: Array<Array<any>> = []
    stages.forEach(stage => {
      let groups: Array<any> = stage.groups || []
      let newGroups: Array<any> = []
      groups.forEach(group => {
        let steps: Array<any> = group.steps || []
        let newSteps: Array<any> = []
        steps.forEach(step => {
          let marketTemplate: { [K: string]: any } =
            MarketTemplateData.find((d: { [K: string]: any } = {}) => d.id === step.id) || {}
          marketTemplate = Utils.deepCopy(marketTemplate)
          let components: Array<any> = marketTemplate.components || []
          let newComponents: Array<any> = []
          let comps: Array<any> = step.components || []
          if (components.length > 0) {
            components.forEach(com => {
              let component = comps.find((d: { [K: string]: any } = {}) => d.prop === com.name) || {}
              if (!Utils.isObjectNull(component)) {
                com.value = component.value || ''
                newComponents.push(com)
              } else {
                newComponents.push(com)
              }
            })
          }

          newSteps.push({ ...step, components: newComponents, comps })
        })

        newGroups.push({
          title: {
            label: group.title || '',
          },
          steps: newSteps || [],
        })
      })

      processes.push(newGroups)
    })

    console.log('processes:', processes)
    return processes
  }

  const getProjectToolTipHtml = () => {
    return (
      <div className="project-tooltip">
        <p className="project-tooltip-title font-bold">可以填写本地项目路径或远程项目路径</p>
        <div className="project-tooltip-content">
          <p>请确保本地已保存远程项目地址的账号密码或Git Ssh 密钥</p>
          <p>远程项目地址可以不带 `.git` 结尾</p>
          <p>本地项目请确保路径存在</p>
        </div>
      </div>
    )
  }

  const getActiveProcess = () => {
    if (pipelineStore.isEditor) return
    // H5
    if (pipelineStore.addForm.basic.tag === pipelineStore.TAGS[7].value) {
      let isRemoteUrl = pipelineStore.isRemoteUrl(pipelineStore.addForm.basic.path || '')
      if (isRemoteUrl) {
        pipelineStore.activeProcess = H5_REMOTE_TEMPLATE
      } else {
        pipelineStore.activeProcess = H5_LOCAL_TEMPLATE
      }

      return
    }

    pipelineStore.activeProcess = []
  }

  // 基本信息
  const getBasicHtml = () => {
    let tagSelectOptions: any = {
      showSearch: true,
      placeholder: '请选择流水线标签',
      style: { width: 350 },
      filterOption: (inputValue: string = '', option: { [K: string]: any } = {}) => {
        return option.label.indexOf(inputValue) !== -1
      },
      onChange: (value: string) => {
        pipelineStore.addForm.basic.tag = value || ''
        getActiveProcess()
      },
      options: pipelineStore.TAGS || [],
    }

    if (!Utils.isBlank(pipelineStore.addForm.basic.tag || '')) {
      tagSelectOptions.value = pipelineStore.addForm.basic.tag || ''
    }

    return (
      <div className="basic-content wh100">
        <div className="form">
          <div className="form-item flex-align-center">
            <div className="label page-margin-right flex-align-center">
              <p>流水线名称</p>
              <span className="flex-center">*</span>
            </div>
            <Input
              style={{ width: 350 }}
              placeholder="请输入流水线名称"
              maxLength={100}
              allowClear
              value={pipelineStore.addForm.basic.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                pipelineStore.addForm.basic.name = e.target.value || ''
              }}
            />
          </div>

          <div className="form-item flex-align-center page-margin-top">
            <div className="label page-margin-right flex-align-center">
              <p>流水线标签</p>
              <span className="flex-center">*</span>
            </div>
            <Select {...tagSelectOptions} />
          </div>

          <div className="form-item flex-align-center page-margin-top">
            <div className="label page-margin-right flex-align-center">
              <p>项目路径</p>
              <span className="flex-center">*</span>
              <div className="flex-center question">
                <Tooltip className="tooltip-question" placement="top" title={getProjectToolTipHtml()}>
                  {/* @ts-ignore */}
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            </div>
            <Input
              style={{ width: 350 }}
              placeholder="请输入或选择项目路径"
              maxLength={100}
              allowClear
              value={pipelineStore.addForm.basic.path || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                pipelineStore.addForm.basic.path = e.target.value || ''
                getActiveProcess()
              }}
            />

            <Button
              className="page-margin-left"
              onClick={async () => {
                const filePath: any = await open({
                  multiple: false,
                  directory: true,
                })
                console.log('select file path', filePath)
                if (!Utils.isBlank(filePath)) {
                  pipelineStore.addForm.basic.path = filePath || ''
                }
              }}
            >
              请选择
            </Button>
          </div>

          <div className="form-item flex-align-center page-margin-top">
            <div className="label page-margin-right">描述</div>
            <Input.TextArea
              style={{ width: 350 }}
              placeholder="请输入描述"
              maxLength={500}
              allowClear
              value={pipelineStore.addForm.basic.desc || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                pipelineStore.addForm.basic.desc = e.target.value || ''
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // 流程配置
  const getProcessHtml = () => {
    // 替换系统变量
    // let activeProcess = replaceStepsComponentValue(pipelineStore.activeProcess || [], pipelineStore.osCommands || {})
    return (
      <div className="process-content wh100">
        <PipelineProcess
          data={pipelineStore.activeProcess}
          isRun={false}
          onUpdateData={(market: { [K: string]: any }) => {
            pipelineStore.activeProcess = updateMarket(pipelineStore.activeProcess, market)
          }}
        />
      </div>
    )
  }

  // 变量
  const getVariableHtml = () => {
    return (
      <div className="variabl-content wh100">
        <PipelineVariable />
      </div>
    )
  }

  const ADD_TABS: any = [
    {
      key: '1',
      label: '基本信息',
      children: getBasicHtml(),
    },
    {
      key: '2',
      label: '流程配置',
      children: getProcessHtml(),
    },
    {
      key: '3',
      label: '变量',
      children: getVariableHtml(),
    },
  ]

  const getBreadcrumbItemList = () => {
    let detailInfo = pipelineStore.detailInfo || {}
    let basic = detailInfo.basic || {}

    let routes: Array<{ [K: string]: any }> = []
    let menu: { [K: string]: any } = homeStore.menuList[2] || {}
    routes.push(menu.children[0])

    let otherSubRoutes = homeStore.getOtherSubRoutes() || []
    let route: { [K: string]: any } =
      otherSubRoutes.find((route: { [K: string]: any }) => route.key === 'pipelineAdd') || {}
    if (!Utils.isObjectNull(route || {})) {
      routes.push(route)
    }

    return routes
  }

  const render = () => {
    return (
      <Page
        className="pipeline-add-page page-white overflow-y-auto page-padding-left page-padding-right page-padding-bottom"
        needNavigation={false}
        pageBodyNeedPadding={false}
        needBreadcrumb={true}
        breadCrumbItemList={getBreadcrumbItemList()}
      >
        <div className="content-box overflow flex-1">
          <Tabs
            defaultActiveKey="0"
            items={ADD_TABS}
            onChange={(activeKey: string = '') => {
              if (activeKey === ADD_TABS[1].key) {
                getActiveProcess()
              }
            }}
          />

          <div className="buttons flex-align-center">
            <Button
              type="primary"
              className="page-margin-right"
              onClick={async () => {
                let serverId = homeStore.getSelectServer().id || ''
                await pipelineStore.onSavePipeline(serverId, () => {
                  pipelineStore.onResetAddConfig()
                  // navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.URL}`)
                  navigate(-1)
                })
              }}
            >
              保存
            </Button>
            <Button
              type="default"
              onClick={() => {
                pipelineStore.onResetAddConfig()
                // navigate(`${RouterUrls.HOME_URL}${RouterUrls.PIPELINE.URL}`)
                navigate(-1)
              }}
            >
              取消
            </Button>
          </div>
        </div>

        <Loading show={pipelineStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(PipelineAdd)

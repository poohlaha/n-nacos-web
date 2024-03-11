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
import MBreadcrumb from '@views/modules/breadcrumb'
import { Button, Select, Input, Tabs, Tooltip } from 'antd'
import { open } from '@tauri-apps/plugin-dialog'
import PipelineProcess from '../process'
import PipelineVariable from './variable'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { H5_LOCAL_TEMPLATE, H5_REMOTE_TEMPLATE } from '../process/templates/h5'

const PipelineAdd: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const navigate = useNavigate()

  const { pipelineStore, homeStore } = useStore()

  useMount(async () => {})

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
    return (
      <div className="process-content wh100">
        <PipelineProcess data={pipelineStore.activeProcess} isRun={false} />
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

  const getBreadcrumb = () => {
    let menuList = Utils.deepCopy(homeStore.menuList || [])
    menuList.push(pipelineStore.ADD_PIPELINE_BREADCRUMB)
    return menuList
  }

  const render = () => {
    return (
      <div className="pipeline-add-page page page-white page-padding flex-direction-column wh100">
        <div className="breadcrumb-top flex-align-center">
          <MBreadcrumb
            items={getBreadcrumb()}
            activeIndexes={homeStore.activeIndexes}
            onChange={(activeIndexes: Array<number> = []) => {
              pipelineStore.onResetAddConfig()
              homeStore.setActiveIndexes(activeIndexes)
            }}
          />
        </div>

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
      </div>
    )
  }

  return render()
}

export default observer(PipelineAdd)

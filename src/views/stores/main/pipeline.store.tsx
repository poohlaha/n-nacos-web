/**
 * @fileOverview pipeline store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import React from 'react'
import Utils from '@utils/utils'
import { TOAST } from '@utils/base'
import { invoke } from '@tauri-apps/api/core'
import { info } from '@tauri-apps/plugin-log'
import { Tag } from 'antd'

// @ts-ignore
class PipelineProcessConfig {
  id: string
  pipelineId: string
  stages: Array<PipelineStage>
  createTime: string
  updateTime: string

  constructor(
    stages: Array<PipelineStage>,
    id: string = '',
    pipelineId: string = '',
    createTime: string = '',
    updateTime: string = ''
  ) {
    this.id = id
    this.pipelineId = pipelineId
    this.stages = stages
    this.createTime = createTime
    this.updateTime = updateTime
  }
}

class PipelineStage {
  id: string
  order: number
  processId: string
  groups: Array<PipelineGroup>
  createTime: string
  updateTime: string

  constructor(
    groups: Array<PipelineGroup>,
    order: number = 0,
    id: string = '',
    processId: string = '',
    createTime: string = '',
    updateTime: string = ''
  ) {
    this.id = id
    this.order = order
    this.processId = processId
    this.groups = groups
    this.createTime = createTime
    this.updateTime = updateTime
  }
}

class PipelineGroup {
  id: string
  stageId: string
  order: number
  label: string
  steps: Array<PipelineStep>
  createTime: string
  updateTime: string

  constructor(
    label: string,
    steps: Array<PipelineStep>,
    order: number,
    id: string = '',
    stageId: string = '',
    createTime: string = '',
    updateTime: string = ''
  ) {
    this.id = id
    this.stageId = stageId
    this.order = order
    this.label = label
    this.steps = steps
    this.createTime = createTime
    this.updateTime = updateTime
  }
}

class PipelineStep {
  id: string
  groupId: string
  order: number
  module: string
  command: string
  label: string
  status: string
  components: Array<PipelineStepComponent>
  createTime: string
  updateTime: string

  constructor(
    id: string,
    groupId: string,
    order: number,
    module: string,
    command: string,
    label: string,
    status: string,
    components: Array<PipelineStepComponent>,
    createTime: string = '',
    updateTime: string = ''
  ) {
    this.id = id
    this.groupId = groupId
    this.order = order
    this.command = command
    this.label = label
    this.module = module
    this.status = status
    this.components = components
    this.createTime = createTime
    this.updateTime = updateTime
  }
}

class PipelineStepComponent {
  id: string
  stepId: string
  order: number
  prop: string
  label: string
  value: string
  type: string
  desc: string
  createTime: string
  updateTime: string

  constructor(
    prop: string,
    label: string,
    value: string,
    desc: string,
    order: number,
    type: string = '',
    id: string = '',
    stepId: string = '',
    createTime: string = '',
    updateTime: string = ''
  ) {
    this.prop = prop
    this.label = label
    this.value = value
    this.desc = desc
    this.id = id
    this.stepId = stepId
    this.order = order
    this.type = type
    this.createTime = createTime
    this.updateTime = updateTime
  }
}

class PipelineStore extends BaseStore {
  // 标签类型
  readonly TAGS: Array<{ [K: string]: string }> = [
    {
      label: '开发',
      value: 'Develop',
      color: 'processing'
    },
    {
      label: '测试',
      value: 'Test',
      color: 'orange'
    },
    {
      label: 'C++',
      value: 'CAddAdd',
      color: 'lime'
    },
    {
      label: 'Rust',
      value: 'Rust',
      color: 'gold'
    },
    {
      label: 'Java',
      value: 'Java',
      color: 'purple'
    },
    {
      label: 'Android',
      value: 'Android',
      color: 'volcano'
    },
    {
      label: 'Ios',
      value: 'Ios',
      color: 'cyan'
    },
    {
      label: 'H5',
      value: 'H5',
      color: 'success'
    },
    {
      label: 'Docker-H5',
      value: 'DockerH5',
      color: 'magenta'
    }
  ]

  // 流水线状态
  readonly RUN_STATUS: Array<{ [K: string]: string }> = [
    {
      label: '尚未运行',
      value: 'No',
      color: 'default'
    },
    {
      label: '排队中',
      value: 'Queue',
      color: 'processing'
    },
    {
      label: '构建中',
      value: 'Process',
      color: 'processing'
    },
    {
      label: '运行成功',
      value: 'Success',
      color: 'success'
    },
    {
      label: '运行失败',
      value: 'Failed',
      color: 'error'
    },
    {
      label: '运行中止',
      value: 'Stop',
      color: 'error'
    }
  ]

  readonly SELECT_OPTIONS: any = [
    {
      label: '是',
      value: 'yes'
    },
    {
      label: '否',
      value: 'no'
    }
  ]

  readonly VARIABLE_OPTIONS: any = [
    {
      label: '字符串',
      value: 'str'
    },
    {
      label: '下拉框',
      value: 'select'
    },
    {
      label: '输入框',
      value: 'input'
    }
  ]

  @observable list: Array<{ [K: string]: any }> = []

  // 添加页面启动变量
  @observable addVariableList: Array<{ [K: string]: any }> = []

  // 添加页面启动变量表单
  @observable addVariableDefaultForm: { [K: string]: any } = {
    id: '',
    order: 0,
    name: '',
    genre: this.VARIABLE_OPTIONS[0].value,
    str: '',
    select: '',
    disabled: this.SELECT_OPTIONS[1].value || '',
    require: this.SELECT_OPTIONS[1].value || '',
    desc: ''
  }

  // 添加页面基本信息表单
  @observable addBasicDefaultForm: { [K: string]: any } = {
    name: '',
    tag: '',
    path: '',
    desc: ''
  }

  @observable addDefaultForm: { [K: string]: any } = {
    id: '',
    serverId: '',
    status: '',
    basic: Utils.deepCopy(this.addBasicDefaultForm), // 基本信息
    processConfig: {
      // 流程配置
      steps: []
    }
  }

  @observable addForm: { [K: string]: any } = Utils.deepCopy(this.addDefaultForm)
  @observable detailInfo: { [K: string]: any } = {} // 详情
  @observable osCommands: { [K: string]: any } = {} // 系统命令
  @observable isEditor: boolean = false // 是否为编辑状态

  // 是否显示运行对话框
  @observable showRunDialog: boolean = false

  // 选中的一行
  @observable selectItem: { [K: string]: any } = {}

  readonly runDialogDefaultProps: { [K: string]: any } = {
    value: '0',
    h5: {
      node: '',
      branch: '',
      make: '',
      command: '',
      script: ''
    },
    variable: {},
    remark: ''
  }

  @observable runDialogProps: { [K: string]: any } = Utils.deepCopy(this.runDialogDefaultProps)

  // 激活的模板
  @observable activeProcess: Array<Array<any>> = []

  // 日志
  @observable loggerList: Array<string> = []

  // 运行历史
  @observable historyList: Array<{ [K: string]: any }> = []

  // 添加启动变量
  @action
  onAddVariable(form: { [K: string]: any } = {}) {
    let name = (form.name || '').trim()
    let genre = form.genre || ''
    let str = (form.str || '').trim()
    let select = (form.select || '').trim()
    let input = (form.input || '').trim()
    let disabled = (form.disabled || '').trim()
    let require = (form.require || '').trim()
    let desc = (form.desc || '').trim()
    let value = ''
    let id = (form.id || '').trim()
    let order = this.addVariableList.length + 1

    if (Utils.isBlank(name)) {
      TOAST.show({ message: '请输入变量名', type: 4 })
      return false
    }

    if (Utils.isBlank(genre)) {
      TOAST.show({ message: '请选择变量类型', type: 4 })
      return false
    }

    if (genre === this.VARIABLE_OPTIONS[0].value) {
      if (Utils.isBlank(str)) {
        TOAST.show({ message: '请输入变量类型的值', type: 4 })
        return false
      }
    }

    if (genre === this.VARIABLE_OPTIONS[1].value) {
      if (Utils.isBlank(select)) {
        TOAST.show({ message: '请输入变量类型的值', type: 4 })
        return false
      }
    }

    if (Utils.isBlank(disabled)) {
      disabled = this.SELECT_OPTIONS[1].value || ''
    }

    if (Utils.isBlank(require)) {
      require = this.SELECT_OPTIONS[1].value || ''
    }

    if (genre === this.VARIABLE_OPTIONS[1].value) {
      value = select
    } else if (genre === this.VARIABLE_OPTIONS[2].value) {
      value = input
    } else {
      value = str
    }

    // 判断名字是否已存在
    let hasExists = false
    let v = this.addVariableList.find(v => v.name === name) || {}
    if (Utils.isObjectNull(v)) {
      hasExists = false
    } else if (Utils.isBlank(id)) {
      if (!Utils.isObjectNull(v)) {
        hasExists = true
      }
    } else if (v.id !== id) {
      hasExists = true
    }

    if (hasExists) {
      TOAST.show({ message: '变量名已存在', type: 4 })
      return false
    }

    // 如果存在 ID, 找到记录修改
    if (!Utils.isBlank(id)) {
      let variable = this.addVariableList.find(v => v.id === id) || {}
      if (!Utils.isObjectNull(variable)) {
        variable.name = name
        variable.genre = genre
        variable.value = value
        variable.disabled = disabled
        variable.require = require
        variable.desc = desc
        variable.order = order
        console.log('addVariableList:', this.addVariableList)
        this.addForm.variable = Utils.deepCopy(this.addVariableDefaultForm)
        return true
      }
      id = Utils.generateUUID()
    }

    if (Utils.isBlank(id)) {
      id = Utils.generateUUID()
    }

    this.addVariableList.push({
      id,
      order,
      name,
      genre,
      value,
      disabled,
      require,
      desc
    })

    console.log('addVariableList:', this.addVariableList)
    this.addForm.variable = Utils.deepCopy(this.addVariableDefaultForm)
    return true
  }

  // 移除启动变量
  @action
  onRemoveVariable(item: { [K: string]: any }) {
    if (this.addVariableList.length === 0) return
    let addVariableList = Utils.deepCopy(this.addVariableList) || []
    this.addVariableList = addVariableList.filter((v: { [K: string]: any } = {}) => v.id !== item.id) || []
  }

  // 重置添加配置
  @action
  onResetAddConfig() {
    this.addForm = Utils.deepCopy(this.addDefaultForm)
    this.addVariableList = []
    this.activeProcess = []
    this.loggerList = []
    this.detailInfo = {}
    this.runDialogProps = Utils.deepCopy(this.runDialogDefaultProps)
    this.selectItem = {}
    this.showRunDialog = false
    this.isEditor = false
    this.osCommands = {}
  }

  /**
   * 获取列表
   */
  @action
  async getList(serverId: string = '', form: { [K: string]: any } = {}) {
    try {
      if (Utils.isObjectNull(form)) {
        form = {
          name: '',
          status: ''
        }
      }
      console.log('get pipeline list query params:', form)
      await info(`get pipeline list query params: ${JSON.stringify(form)}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_pipeline_list', { serverId, form })) || {}
      this.loading = false
      let data = this.handleResult(result) || []
      this.list = data.map((item: { [K: string]: any } = {}) => {
        return {
          ...item,
          key: item.id || ''
        }
      })
      console.log('get pipeline list result:', this.list)
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  trimBasic(basic: { [K: string]: any } = {}) {
    if (Utils.isObjectNull(basic)) return {}

    let id = (basic.id || '').trim()
    let name = (basic.name || '').trim()
    let tag = (basic.tag || '').trim()
    let path = (basic.path || '').trim()
    let desc = (basic.desc || '').trim()

    return {
      id,
      name,
      tag,
      path,
      desc
    }
  }

  /**
   * 重试
   */
  onRerun(record: { [K: string]: any } = {}, callback?: Function) {
    this.selectItem = this.detailInfo || {}
    this.selectItem.runtime = record || {}
    this.selectItem.snapshot = record.snapshot || {}
    this.runDialogProps = Utils.deepCopy(this.runDialogDefaultProps)
    this.runDialogProps.value = '1'

    this.onSetRadioRunProps(this.selectItem || {}, this.runDialogProps, record.snapshot || {}, {})
    this.runDialogProps.remark = record.remark || ''
    this.showRunDialog = true
    console.log('runDialogProps', this.runDialogProps)
    callback?.()
  }

  getTagHtml(t: string = '') {
    let tag = this.TAGS.find((tag: { [K: string]: any } = {}) => tag.value === t) || {}
    if (!Utils.isObjectNull(tag)) {
      return (
        <Tag className="m-ant-tag" color={tag.color || ''}>
          {tag.label || ''}
        </Tag>
      )
    }

    return <div className="tag"></div>
  }

  @action
  getProcessConfig() {
    if (this.activeProcess.length === 0) return { stages: [] }

    let stages: Array<PipelineStage> = []
    this.activeProcess.forEach((items: Array<{ [K: string]: any }>, index: number) => {
      let groups: Array<PipelineGroup> = []

      items.forEach((item: { [K: string]: any }) => {
        let newSteps: Array<PipelineStep> = []
        let steps = item.steps || []

        steps.forEach((step: { [K: string]: any }) => {
          let newComponents: Array<PipelineStepComponent> = []
          let components = step.components || []
          components.forEach((component: { [K: string]: any }) => {
            newComponents.push(
              new PipelineStepComponent(
                component.name || '',
                component.label || '',
                component.value || '',
                component.desc || '',
                component.order || 1,
                component.type || ''
              )
            )
          })

          newSteps.push(
            new PipelineStep(
              step.id || '',
              item.id || '',
              step.order || 1,
              step.module || '',
              step.command || '',
              step.label || '',
              this.RUN_STATUS[0].value,
              newComponents
            )
          )
        })

        groups.push(new PipelineGroup(item.title?.label || '', newSteps, item.order || 1))
      })

      stages.push(new PipelineStage(groups, index + 1))
    })

    return stages
  }

  /**
   * 保存流水线
   */
  @action
  async onSavePipeline(serverId: string = '', callback?: Function) {
    let basic = this.trimBasic(this.addForm.basic || {})

    // 检查
    if (Utils.isBlank(basic.name)) {
      TOAST.show({ message: '请输入流水线名称', type: 4 })
      return false
    }

    if (Utils.isBlank(basic.tag)) {
      TOAST.show({ message: '请选择流水线标签', type: 4 })
      return false
    }

    if (Utils.isBlank(serverId || '')) {
      TOAST.show({ message: '请选择服务器', type: 4 })
      return false
    }

    if (Utils.isBlank(basic.path)) {
      TOAST.show({ message: '请输入或选择项目路径', type: 4 })
      return false
    }

    let pipeline = {
      id: this.addForm.id || '',
      serverId: serverId,
      basic,
      status: this.RUN_STATUS[0].value,
      processConfig: {
        id: '',
        pipelineId: '',
        stages: this.getProcessConfig()
      },
      duration: '',
      variables: this.addVariableList || []
    }

    try {
      console.log('save pipeline params:', pipeline)
      await info(`save pipeline params: ${JSON.stringify(pipeline)}`)
      this.loading = true
      let cmd = !Utils.isBlank(pipeline.id) ? 'update_pipeline' : 'insert_pipeline'

      let result: { [K: string]: any } = (await invoke(cmd, { pipeline })) || {}
      this.loading = false
      console.log('save pipeline result:', result)
      let success = this.handleResult(result)
      if (success) {
        this.onResetAddConfig()
        TOAST.show({ message: '保存流水线成功', type: 2 })
        callback?.()
      }
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `保存流水线失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  /**
   * 删除流水线
   */
  @action
  async onDeletePipeline(id: string = '', serverId: string = '', callback?: Function) {
    try {
      console.log('delete pipeline params:', { id, serverId })
      await info(`delete pipeline params: ${JSON.stringify({ id, serverId })}`)
      let result: { [K: string]: any } = (await invoke('delete_pipeline', { id, serverId })) || {}
      this.loading = false
      console.log('delete pipeline result:', result)
      let success = this.handleResult(result)
      if (success) {
        TOAST.show({ message: '删除流水线成功', type: 2 })
        setTimeout(async () => {
          await this.getList('', { name: '', status: '' })
          callback?.()
        }, 500)
      }
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 获取变量相同的列
   */
  @action
  getAddVariableCommonColumns() {
    return [
      {
        title: '变量名',
        dataIndex: 'name',
        key: 'name',
        width: '30%'
      },
      {
        title: '类型',
        dataIndex: 'genre',
        key: 'genre',
        width: '20%',
        needTooltip: false,
        render: (record: { [K: string]: any } = {}) => {
          let genre = record.genre || ''
          if (genre === this.VARIABLE_OPTIONS[1].value) {
            return <span>{this.VARIABLE_OPTIONS[1].label || ''}</span>
          }

          if (genre === this.VARIABLE_OPTIONS[2].value) {
            return <span>{this.VARIABLE_OPTIONS[2].label || ''}</span>
          }

          return <span>{this.VARIABLE_OPTIONS[0].label || ''}</span>
        }
      },
      {
        title: '值',
        key: 'value',
        dataIndex: 'value',
        multiLine: true,
        width: '20%',
        needTooltip: false
      },
      {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        multiLine: true,
        width: '20%'
      }
    ]
  }

  /**
   * 判断是否为远程地址
   * @param url
   */
  @action
  isRemoteUrl(url: string = '') {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ssh://')
  }

  @action
  onSetAddForm(record: { [K: string]: any } = {}) {
    this.addForm = {
      id: record.id || '',
      serverId: record.serverId || '',
      status: record.status || '',
      basic: record.basic || {},
      variable: {},
      steps: record.steps || []
    }

    this.addVariableList = record.variables || []
    this.addVariableList = this.addVariableList
      .slice()
      .sort((variable1: { [K: string]: any } = {}, variable2: { [K: string]: any } = {}) => {
        return variable1.order - variable2.order
      })
  }

  /**
   * 获取流水线详情
   */
  @action
  async getDetailInfo(id: string, serverId: string, callback?: Function) {
    try {
      console.log('get detailInfo params:', { id, serverId })
      await info(`get detailInfo params: ${JSON.stringify({ id, serverId })}`)
      let result: { [K: string]: any } = (await invoke('get_pipeline_detail', { id, serverId })) || {}
      this.loading = false
      console.log('get detailInfo result:', result)
      this.detailInfo = this.handleResult(result) || {}

      // log list
      let logger = this.detailInfo?.runtime?.log || ''
      this.loggerList = logger.split('\r\n') || []

      // 如果存在记录，默认选择上一条
      let flag = this.isNeedSelectedLastSelected(this.detailInfo || {}, this.runDialogProps)
      if (flag) {
        this.runDialogProps = Utils.deepCopy(this.runDialogDefaultProps)
        // this.onSetRadioRunProps(this.detailInfo || {}, this.runDialogProps)
      }

      callback?.()
      return result
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  isNeedSelectedLastSelected(detailInfo: { [K: string]: any } = {}, runDialogProps: { [K: string]: any } = {}) {
    let flag = this.hasRadioNeedChange(detailInfo)
    if (flag) {
      runDialogProps.value = '1'
    }

    return flag
  }

  @action
  hasRadioNeedChange(detailInfo: { [K: string]: any } = {}) {
    let runtime = detailInfo.runtime || {}
    let basic = detailInfo.basic || {}
    let runnableInfo = detailInfo.runnableInfo || {}
    let snapshot = runtime.snapshot || {}
    let tag = basic.tag || ''
    if (!Utils.isObjectNull(runtime)) {
      tag = runtime.tag || ''
    }
    let tagExtra = runnableInfo[tag.toLowerCase()] || {}
    let displayFields = tagExtra.displayFields || []

    let hasEmpty = true
    for (let field of displayFields) {
      if (Object.prototype.hasOwnProperty.call(snapshot, field.value)) {
        if (!Utils.isBlank(snapshot[field.value] || '')) {
          hasEmpty = false
        }
      }
    }

    return !hasEmpty
  }

  /**
   * 设置复用上次运行记录
   */
  @action
  onSetRadioRunProps(
    selectedItem: { [K: string]: any } = {},
    runDialogProps: { [K: string]: any } = {},
    snapshot: { [K: string]: any } = {},
    tagExtra: { [K: string]: any } = {}
  ) {
    let detailInfo = selectedItem || {}
    let runtime = detailInfo.runtime || {}
    if (Utils.isObjectNull(tagExtra)) {
      snapshot = runtime.snapshot || {}
    }

    let basic = runtime.basic || {}
    let runnableInfo = detailInfo.runnableInfo || {}
    let tag = this.getTag(basic.tag || '').toLowerCase()
    if (Utils.isObjectNull(tagExtra)) {
      tagExtra = runnableInfo[tag] || {}
    }
    let displayFields = tagExtra.displayFields || []

    runDialogProps[tag] = {}
    for (let field of displayFields) {
      if (Object.prototype.hasOwnProperty.call(snapshot, field.value)) {
        runDialogProps[tag][field.value] = snapshot[field.value] || ''
      }
    }

    runDialogProps.remark = runtime.remark || ''
    if (tag === this.TAGS[7].value.toLowerCase()) {
      runDialogProps.h5.node = runnableInfo.h5?.node || ''
    }

    // 设置 variable
    runDialogProps.variable = {}
    let runnableVariables: Array<{ [K: string]: any }> = snapshot.runnableVariables || []
    if (runnableVariables.length > 0) {
      runnableVariables.forEach(item => {
        runDialogProps.variable[item.name] = {
          id: item.id || '',
          value: item.value || '',
          name: item.name,
          order: item.order || 0,
          desc: item.desc || '',
          genre: item.genre || this.VARIABLE_OPTIONS[0].value,
          require: item.require || '',
          disabled: item.disabled || ''
        }
      })
    }

    console.log('runDialogProps', runDialogProps)
  }

  /**
   * 校验流水线运行对话框
   */
  @action
  onValidateRun(item: { [K: string]: any } = {}, dialogProps: { [K: string]: any } = {}, tip: string = '') {
    let info = item || {}
    if (Utils.isObjectNull(info)) {
      info = this.detailInfo || {}
    }

    if (Utils.isObjectNull(info)) {
      info = this.selectItem || {}
    }

    let runDialogProps = dialogProps || {}
    if (Utils.isObjectNull(runDialogProps)) {
      runDialogProps = this.runDialogProps || {}
    }

    let tag = info.basic?.tag || ''
    let variables = info.variables || []

    // h5 ｜ docker-h5
    if (tag === this.TAGS[7].value || tag === this.TAGS[8].value) {
      let h5 = runDialogProps.h5 || {}
      if (Utils.isObjectNull(h5.branch || '')) {
        TOAST.show({ message: `请选择${tip || ''} branch`, type: 4 })
        return false
      }

      // make 为空时
      if (Utils.isObjectNull(h5.make || '')) {
        if (!this.isRemoteUrl(info.basic.path || '')) {
          if (Utils.isObjectNull(h5.command || '') || Utils.isObjectNull(h5.script || '')) {
            TOAST.show({ message: `请选择${tip || ''} make 或 command 和 script 的值`, type: 4 })
            return false
          }
        }
      }
    }

    // variables
    if (variables.length > 0) {
      let variable = runDialogProps.variable || {}

      for (let v of variables) {
        if (v.require === 'no') {
          continue
        }

        let value = variable[v.name || ''] || {}
        if (Utils.isObjectNull(value)) {
          TOAST.show({ message: `请选择${tip || ''} ${v.name || ''} 的值`, type: 4 })
          return false
        }
      }
    }

    return true
  }

  @action
  getStepProps(
    item: { [K: string]: any } = {},
    runDialogProps: { [K: string]: any } = {},
    isReadonly: boolean = false,
    isRetry: boolean = false
  ) {
    let runnableInfo = item.runnableInfo || {}
    let id = item.id || ''
    let serverId = item.serverId || ''
    let tag = this.getTag(item.basic.tag || '')
    let extraH5 = runnableInfo[tag.toLowerCase()] || {}
    let runtime = item.runtime || {}
    let stage = runtime.stage || {}
    if (!isRetry) {
      stage.stageIndex = 0
      stage.groupIndex = 0
      stage.stepIndex = 0
      stage.finished = false
    }

    let h5 = runDialogProps.h5 || {}
    let variable = runDialogProps.variable || {}
    h5.node = extraH5.node || ''
    let params: { [K: string]: any } = {
      pipelineId: id,
      serverId,
      tag,
      stage: {
        ...stage
      },
      stages: [],
      snapshot: {
        ...h5,
        runtimeId: '',
        variables: []
      },
      status: this.RUN_STATUS[0].value,
      remark: runDialogProps.remark || ''
    }

    if (isRetry) {
      params.id = runtime.id || ''
    }

    let runnableVariable: Array<{ [K: string]: any }> = []
    for (let key in variable) {
      runnableVariable.push({
        ...variable[key],
        genre: this.VARIABLE_OPTIONS[0].value || ''
      })
    }

    // 补充其他的值
    if (!isReadonly) {
      for (let variable of item.variables) {
        let v = runnableVariable.find(v => v.id === variable.id || v.name === variable.name) || {}
        if (Utils.isObjectNull(v)) {
          runnableVariable.push({
            name: variable.name || '',
            value: variable.value || '',
            order: variable.order || 0,
            genre: variable.genre || '',
            require: variable.require || '',
            disabled: variable.disabled || '',
            desc: variable.desc || ''
          })
        }
      }
    }

    params.snapshot.runnableVariables = runnableVariable
    // params.variables = item.variables || []
    return params
  }

  /**
   * 运行流水线
   */
  @action
  async onRun(isReadonly: boolean = false, callback?: Function, isRetry: boolean = false) {
    try {
      let params = this.getStepProps(this.selectItem || this.detailInfo || {}, this.runDialogProps, isReadonly, isRetry)
      this.loggerList = []
      console.log('run pipeline params:', params)
      await info(`run pipeline param: ${JSON.stringify(params)}`)
      let result: { [K: string]: any } = (await invoke('pipeline_run', { props: params })) || {}
      this.loading = false
      console.log('get run pipeline result:', result)
      let res = this.handleResult(result) || {}
      if (Utils.isObjectNull(res)) {
        return
      }

      this.detailInfo = res || {}
      TOAST.show({ message: '已在后台运行流水线', type: 1 })
      callback?.()
    } catch (e: any) {
      this.loading = false
      TOAST.show({ message: `运行流水线失败: ${e}`, type: 4 })
      throw new Error(e)
    }
  }

  @action
  getTag(tag: string = '') {
    if (!tag.endsWith(this.TAGS[7].value || '')) return tag || ''
    return this.TAGS[7].value || ''
  }

  /**
   * 获取运行对话框属性
   */
  @action
  getDialogRunProps(item: { [K: string]: any } = {}) {
    let runnableInfo = item.runnableInfo || {}
    let basic = item.basic || {}
    let tag = this.getTag(basic.tag || '')
    let tagExtra = runnableInfo[tag.toLowerCase()] || {}
    let branches = runnableInfo.branches || []
    let displayFields = tagExtra.displayFields || []

    let list: Array<{ [K: string]: any }> = []
    for (let field of displayFields) {
      list.push({
        name: field.label,
        value: field.key === 'branches' ? branches : tagExtra[field.key],
        genre: field.type,
        desc: field.desc || '',
        tag
      })
    }

    return list
  }

  @action
  getReadonlyDialogRunProps(item: { [K: string]: any } = {}) {
    let runnableInfo = item.runnableInfo || {}
    let snapshot = item.snapshot || {}
    let basic = item.basic || {}
    let tag = this.getTag(basic.tag || '')
    let tagExtra = runnableInfo[tag.toLowerCase()] || {}
    let displayFields = tagExtra.displayFields || []

    let list: Array<{ [K: string]: any }> = []
    for (let field of displayFields) {
      list.push({
        name: field.label,
        value: snapshot[field.value || ''],
        genre: this.VARIABLE_OPTIONS[0].value,
        desc: field.desc || '',
        tag
      })
    }

    return list
  }

  /**
   * 对话框打开属性
   */
  @action
  getDialogOpenProps(selectItem: { [K: string]: any } = {}, isReadonly: boolean = false) {
    let props = []
    if (isReadonly) {
      props = this.getReadonlyDialogRunProps(selectItem || {})
    } else {
      props = this.getDialogRunProps(selectItem || {})
    }
    let list: Array<{ [K: string]: any }> = []
    props.forEach(item => {
      list.push(this.getAddDialogProps(item.name, item.value, item.genre || '', item.desc || '', item.tag || ''))
    })

    let variables = isReadonly ? selectItem?.runtime?.snapshot?.runnableVariables || [] : selectItem.variables || []
    variables =
      variables.map((item: { [K: string]: any } = {}) => {
        return { ...item, isVariable: true }
      }) || []

    // 排序
    variables = variables.sort((variable1: { [K: string]: any } = {}, variable2: { [K: string]: any } = {}) => {
      return variable1.order - variable2.order
    })
    list = list.concat(variables) || []
    console.log('run variable list', list)
    return list
  }

  /**
   * 添加对方框打开属性
   */
  getAddDialogProps(name: string = '', value: any, genre: string = '', desc: string = '', tag: string = '') {
    let id = Utils.generateUUID()

    if (Array.isArray(value)) {
      // branches
      value = value.map((b: string = '') => {
        return {
          label: b,
          value: b
        }
      })
    }

    return {
      id,
      name,
      genre,
      value,
      disabled: this.SELECT_OPTIONS[1].value,
      require: this.SELECT_OPTIONS[0].value,
      desc,
      tag
    }
  }

  /**
   * 批量运行
   */
  @action
  async onBatchRun(list: Array<{ [K: string]: any }> = [], callback?: Function) {
    try {
      TOAST.show({ message: '已在后台批量运行流水线', type: 1 })
      let paramsList: Array<{ [K: string]: any }> = []
      list.forEach(item => {
        paramsList.push(this.getStepProps(item || {}, item.runDialogProps || {}))
      })
      console.log('run batch pipeline param list:', paramsList)
      await info(`run batch pipeline param list: ${JSON.stringify(paramsList)}`)
      let result: { [K: string]: any } = (await invoke('pipeline_batch_run', { list: paramsList })) || {}
      this.loading = false
      console.log('get batch run pipeline result:', result)
      let res = this.handleResult(result) || {}
      if (Utils.isObjectNull(res)) {
        return
      }

      // this.onRunStep(params)
      await this.getList()
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 查询系统已安装的 commands 列表
   */
  @action
  async queryOsCommand(callback?: Function) {
    try {
      this.loading = true
      let result: { [K: string]: any } = (await invoke('query_os_commands', {})) || {}
      this.loading = false
      console.log('get query os command:', result)
      let res = this.handleResult(result) || {}
      if (Utils.isObjectNull(res)) {
        return
      }

      this.osCommands = res || {}
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 清空运行历史记录
   */
  async onClearRunHistory(callback?: Function) {
    try {
      this.loading = true
      let params = {
        id: this.detailInfo.id || '',
        serverId: this.detailInfo.serverId || ''
      }
      console.log('clear run history param:', params)
      let result: { [K: string]: any } = (await invoke('clear_run_history', { ...params })) || {}
      console.log('get clear run history result:', result)
      this.loading = false
      let res = this.handleResult(result) || {}
      if (Utils.isObjectNull(res)) {
        return
      }

      TOAST.show({ message: '删除流水线运行历史记录成功', type: 2 })
      this.detailInfo = res || {}
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 点击运行事件
   */
  async onRunDialog(id: string = '', serverId: string = '', callback?: Function) {
    if (Utils.isObjectNull(this.detailInfo || {})) {
      await this.getDetailInfo(id || '', serverId || '')
    }

    this.selectItem = this.detailInfo || {}
    let variables = this.detailInfo?.runtime?.snapshot?.runnableVariables || []
    if (variables.length > 0) {
      this.detailInfo.variables = this.detailInfo.variables.map((v: { [K: string]: any } = {}) => {
        if (v.genre === this.VARIABLE_OPTIONS[0].value || v.genre === this.VARIABLE_OPTIONS[2].value) {
          let value = variables.find((k: { [K: string]: any } = {}) => k.name === v.name) || {}
          if (!Utils.isObjectNull(value)) {
            return { ...v, value: value.value || '' }
          }
        }

        return v
      })
    }

    this.runDialogProps = Utils.deepCopy(this.runDialogDefaultProps)
    this.isNeedSelectedLastSelected(this.detailInfo || {}, this.runDialogProps)
    this.onSetRadioRunProps(this.detailInfo || {}, this.runDialogProps)
    console.log('runDialogProps:', this.runDialogProps)
    let status = this.detailInfo?.status || ''
    if (!this.onDisabledRunButton(status || '')) {
      callback?.()
    }
  }

  /**
   * 禁用 运行按钮
   */
  onDisabledRunButton(status: string = '') {
    return status === this.RUN_STATUS[1].value || status === this.RUN_STATUS[2].value
  }

  /**
   * 禁用重试按钮
   */
  onDisabledRerunButton(status: string = '') {
    return status !== this.RUN_STATUS[4].value && status !== this.RUN_STATUS[5].value
  }

  /**
   * 查看流水线运行历史
   */
  @action
  async getHistoryList(id: string, serverId: string, callback?: Function) {
    try {
      this.historyList = []
      let params = { id, serverId }
      console.log('get pipeline history list params:', params)
      await info(`get pipeline history list params: ${JSON.stringify(params)}`)
      let result: { [K: string]: any } = (await invoke('get_runtime_history', { ...params })) || {}
      this.loading = false
      console.log('get pipeline history list result:', result)
      let res = this.handleResult(result) || {}
      if (Utils.isObjectNull(res)) {
        return
      }

      res = res.slice().sort((h1: { [K: string]: any } = {}, h2: { [K: string]: any } = {}) => {
        return h2.order - h1.order
      })

      this.historyList = res || []
      callback?.()
      return result
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }
}

export default new PipelineStore()

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

class PipelineProcessConfig {
  stages: Array<PipelineStage>
  constructor(stages: Array<PipelineStage>) {
    this.stages = stages
  }
}

class PipelineStage {
    groups: Array<PipelineGroup>

  constructor(groups: Array<PipelineGroup>) {
    this.groups = groups
  }
}

class PipelineGroup {
  title: string
  steps: Array<PipelineStep>

  constructor(title: string, steps: Array<PipelineStep>) {
    this.title = title
    this.steps = steps
  }
}

class PipelineStep {
  id: string
  module: string
  command: string
  label: string
  status: string
  components: Array<PipelineStepComponent>

  constructor(id: string, module: string, command: string, label: string, status: string, components: Array<PipelineStepComponent>) {
    this.id = id
    this.command = command
    this.label = label
    this.module = module
    this.status = status
    this.components = components
  }
}

class PipelineStepComponent {
  prop: string
  value: string

  constructor(prop: string, value: string) {
    this.prop = prop
    this.value = value
  }
}

class PipelineStore extends BaseStore {
  // 添加面包宵
  readonly ADD_PIPELINE_BREADCRUMB: { [K: string]: any } = {
    key: 'pipeline-add',
    name: '新建',
    icon: (
      <svg
        key="pipeline-add-svg"
        className="svg-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M754.753851 475.715769a29.759795 29.759795 0 0 0-29.759795 29.759796v187.518711H545.731288a29.759795 29.759795 0 0 0-29.759795 29.823795v0.063999c0 16.447887 13.311908 29.759795 29.759795 29.759796h179.262768v185.470724c0 16.447887 13.311908 29.759795 29.759795 29.759796h0.127999a29.759795 29.759795 0 0 0 29.759796-29.759796V752.641866h163.006879a29.759795 29.759795 0 0 0 29.759795-29.759796v-0.127999a29.759795 29.759795 0 0 0-29.759795-29.759795H784.641646v-187.518711a29.759795 29.759795 0 0 0-29.887795-29.759796z"
          fill="currentColor"
        ></path>
        <path
          d="M393.412335 662.594485c18.047876 0 30.079793-12.031917 30.079794-30.079794 0-18.111875-12.031917-30.143793-30.079794-30.143792H92.230406V361.412555h783.098616c0 18.111875 12.031917 30.079793 30.079793 30.079793s30.079793-11.967918 30.079794-30.079793V150.598005A149.118975 149.118975 0 0 0 785.025643 0.00704H182.597785A149.118975 149.118975 0 0 0 32.00682 150.598005v662.587444a149.118975 149.118975 0 0 0 150.590965 150.590965h210.81455c18.047876 0 30.079793-12.031917 30.079794-30.079793 0-18.111875-12.031917-30.143793-30.079794-30.143793H182.597785c-48.191669 0-90.367379-42.17571-90.367379-90.367379v-150.590964h301.181929z m-301.181929-511.99648C92.230406 102.406336 134.406116 60.230626 182.597785 60.230626h602.363858c48.191669 0 90.367379 42.23971 90.367379 90.367379v150.590964H92.166406V150.598005z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  }

  // 标签类型
  readonly TAGS: Array<{ [K: string]: string }> = [
    {
      label: '开发',
      value: 'Develop',
      color: 'processing',
    },
    {
      label: '测试',
      value: 'Test',
      color: 'orange',
    },
    {
      label: 'C++',
      value: 'CAddAdd',
      color: 'lime',
    },
    {
      label: 'Rust',
      value: 'Rust',
      color: 'gold',
    },
    {
      label: 'Java',
      value: 'Java',
      color: 'purple',
    },
    {
      label: 'Android',
      value: 'Android',
      color: 'volcano',
    },
    {
      label: 'Ios',
      value: 'Ios',
      color: 'cyan',
    },
    {
      label: 'H5',
      value: 'H5',
      color: 'success',
    },
  ]

  // 流水线状态
  readonly RUN_STATUS: Array<{ [K: string]: string }> = [
    {
      label: '尚未运行',
      value: 'No',
      color: 'default',
    },
    {
      label: '排队中',
      value: 'Queue',
      color: 'processing',
    },
    {
      label: '构建中',
      value: 'Process',
      color: 'processing',
    },
    {
      label: '运行成功',
      value: 'Success',
      color: 'success',
    },
    {
      label: '运行失败',
      value: 'Failed',
      color: 'error',
    },
  ]

  readonly SELECT_OPTIONS: any = [
    {
      label: '是',
      value: 'yes',
    },
    {
      label: '否',
      value: 'no',
    },
  ]

  readonly VARIABLE_OPTIONS: any = [
    {
      label: '字符串',
      value: 'str',
    },
    {
      label: '下拉框',
      value: 'select',
    },
  ]

  @observable list: Array<{ [K: string]: any }> = []

  // 添加页面启动变量
  @observable addVariableList: Array<{ [K: string]: any }> = []

  // 添加页面启动变量表单
  @observable addVariableDefaultForm: { [K: string]: any } = {
    id: '',
    name: '',
    genre: this.VARIABLE_OPTIONS[0].value,
    str: '',
    select: '',
    disabled: this.SELECT_OPTIONS[1].value || '',
    require: this.SELECT_OPTIONS[1].value || '',
    desc: '',
  }

  // 添加页面基本信息表单
  @observable addBasicDefaultForm: { [K: string]: any } = {
    name: '',
    tag: '',
    path: '',
    desc: '',
  }

  @observable addBasicForm: { [K: string]: any } = Utils.deepCopy(this.addBasicDefaultForm)
  @observable addVariableForm: { [K: string]: any } = Utils.deepCopy(this.addVariableDefaultForm)

  @observable addDefaultForm: { [K: string]: any } = {
    id: '',
    serverId: '',
    status: '',
    basic: Utils.deepCopy(this.addBasicDefaultForm), // 基本信息
    processConfig: {
      // 流程配置
      steps: [],
    },
  }

  @observable addForm: { [K: string]: any } = Utils.deepCopy(this.addDefaultForm)
  @observable detailInfo: { [K: string]: any } = {} // 详情
  @observable osCommands: { [K: string]: any } = {} // 系统命令

  // H5 本地模板
  readonly H5_LOCAL_TEMPLATE: Array<{ [K: string]: any }> = [
    {
      key: '1-3',
      label: '项目打包',
      status: 'Pack',
      commands: [],
    },
    {
      key: '1-4',
      label: '文件压缩',
      status: 'Compress',
      commands: [],
    },
    {
      key: '1-5',
      label: '项目部署',
      status: 'Deploy',
      commands: [],
    },
    {
      key: '1-6',
      label: '发送通知',
      status: 'Notice',
      commands: [],
    },
  ]

  // H5 远程模板
  @observable H5_REMOTE_TEMPLATE: Array<{ [K: string]: any }> = []

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
      script: '',
    },
    variable: {},
    remark: '',
  }

  @observable runDialogProps: { [K: string]: any } = Utils.deepCopy(this.runDialogDefaultProps)

  // 激活的模板
  @observable activeProcess: Array<Array<any>> = []

  // 日志
  @observable loggerList: Array<string> = []

  // 添加启动变量
  @action
  onAddVariable(form: { [K: string]: any } = {}) {
    let name = (form.name || '').trim()
    let genre = form.genre || ''
    let str = (form.str || '').trim()
    let select = (form.select || '').trim()
    let disabled = (form.disabled || '').trim()
    let require = (form.require || '').trim()
    let desc = (form.desc || '').trim()
    let value = ''
    let id = (form.id || '').trim()

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
        console.log('addVariableList:', this.addVariableList)
        this.addForm.variable = Utils.deepCopy(this.addVariableDefaultForm)
        return true
      } else {
        id = Utils.generateUUID()
      }
    }

    if (Utils.isBlank(id)) {
      id = Utils.generateUUID()
    }

    this.addVariableList.push({
      id,
      name,
      genre,
      value,
      disabled,
      require,
      desc,
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
    // this.activeProcess = this.H5_LOCAL_TEMPLATE
  }

  /**
   * 获取列表
   */
  @action
  async getList(serverId: string = '', form: { [K: string]: any } = {}) {
    try {
      console.log('get pipeline list query params:', form)
      await info(`get pipeline list query params: ${JSON.stringify(form)}`)
      this.loading = true
      let result: { [K: string]: any } = (await invoke('get_pipeline_list', { serverId, form })) || {}
      this.loading = false
      console.log('get pipeline list result:', result)
      let data = this.handleResult(result) || []
      this.list = data.map((item: { [K: string]: any } = {}) => {
        return {
          ...item,
          key: item.id || '',
          ...(item.basic || {}),
        }
      })
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  trimBasic(basic: { [K: string]: any } = {}) {
    if (Utils.isObjectNull(basic)) return {}

    let name = (basic.name || '').trim()
    let tag = (basic.tag || '').trim()
    let path = (basic.path || '').trim()
    let desc = (basic.desc || '').trim()

    return {
      name,
      tag,
      path,
      desc,
    }
  }

  @action
  getProcessConfig() {
    if (this.activeProcess.length === 0) return {stages: []}

    let stages: Array<PipelineStage> = []
    this.activeProcess.forEach((items: Array<{[K: string]: any}>) => {
      let groups: Array<PipelineGroup> = []

      items.forEach((item: {[K: string]: any}) => {
        let newSteps: Array<PipelineStep> = []
        let steps = item.steps || []

        steps.forEach((step: {[K: string]: any}) => {
          let newComponents: Array<PipelineStepComponent> = []
          let components = step.components || []
          components.forEach((component: {[K: string]: any}) => {
            newComponents.push(new PipelineStepComponent(component.name || '', component.value || ''))
          })

          newSteps.push(new PipelineStep(step.id || '', step.module || '', step.command || '', step.label || '', 'None', newComponents))
        })

        groups.push(new PipelineGroup(item.title?.label || '', newSteps))
      })

      stages.push(new PipelineStage(groups))
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

    if (Utils.isBlank(basic.path)) {
      TOAST.show({ message: '请输入或选择项目路径', type: 4 })
      return false
    }

    // 判断是不是远程 url
    if (this.isRemoteUrl(basic.path || '')) {
      // this.activeProcess = this.H5_REMOTE_TEMPLATE
    } else {
      // this.activeProcess = this.H5_LOCAL_TEMPLATE
    }

    let pipeline = {
      id: this.addForm.id || '',
      serverId: serverId,
      basic,
      status: 'No',
      processConfig: {
        stages: this.getProcessConfig(),
      },
      variables: this.addVariableList || [],
    }

    try {
      console.log('save pipeline params:', pipeline)
      await info(`save pipeline params: ${JSON.stringify(pipeline)}`)
      this.loading = true
      let cmd = !Utils.isBlank(pipeline.id) ? 'update_pipeline' : 'insert_pipeline'

      let result: { [K: string]: any } = (await invoke(cmd, {pipeline})) || {}
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
          await this.getList(serverId, { name: '', status: '' })
          callback?.()
        }, 500)
      }
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  readonly DIALOG_PROPS_LIST: Array<{ [K: string]: any }> = [
    {
      label: 'node',
      value: 'node',
      type: this.VARIABLE_OPTIONS[0].value,
      owner: 'H5',
      desc: 'NodeJs版本号',
      key: 'node',
    },
    {
      label: 'branch',
      value: 'branch',
      type: this.VARIABLE_OPTIONS[1].value,
      owner: 'all',
      desc: '分支列表',
      key: 'branches',
    },
    {
      label: 'make',
      value: 'make',
      type: this.VARIABLE_OPTIONS[1].value,
      owner: 'H5',
      desc: 'Make命令',
      key: 'makeCommands',
    },
    {
      label: 'command',
      value: 'command',
      type: this.VARIABLE_OPTIONS[1].value,
      owner: 'H5',
      desc: '本机安装的命令列表',
      key: 'installedCommands',
    },

    {
      label: 'script',
      value: 'script',
      type: this.VARIABLE_OPTIONS[1].value,
      owner: 'H5',
      desc: 'package.json中的scripts命令',
      key: 'packageCommands',
    },
  ]

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
        width: '10%',
        fixed: 'left',
      },
      {
        title: '类型',
        dataIndex: 'genre',
        key: 'genre',
        width: '10%',
        render: (record: { [K: string]: any } = {}) => {
          let genre = record.genre || ''
          if (genre === this.VARIABLE_OPTIONS[1].value) {
            return <span>{this.VARIABLE_OPTIONS[1].label || ''}</span>
          }

          return <span>{this.VARIABLE_OPTIONS[0].label || ''}</span>
        },
      },
      {
        title: '值',
        key: 'value',
        dataIndex: 'value',
        multiLine: true,
        width: '25%',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        multiLine: true,
        width: '20%',
      },
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
  setAddForm(record: { [K: string]: any } = {}) {
    this.addForm = {
      id: record.id || '',
      serverId: record.serverId || '',
      status: record.status || '',
      basic: record.basic || {},
      variable: {},
      steps: record.steps || [],
    }

    this.addVariableList = record.variables || []
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
      let logger = this.detailInfo?.run?.current?.log || ''
      this.loggerList = logger.split('\r\n') || []

      // 如果存在记录，默认选择上一条
      let flag = this.isNeedSelectedLastSelected(this.detailInfo?.run || {}, this.runDialogProps)
      if (flag) {
        this.runDialogProps = Utils.deepCopy(this.runDialogDefaultProps)
        this.onSetRadioRunProps(this.detailInfo || {}, this.runDialogDefaultProps)
      }

      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  @action
  isNeedSelectedLastSelected(run: { [K: string]: any } = {}, runDialogProps: { [K: string]: any } = {}) {
    let flag = this.hasRadioNeedChange(run, runDialogProps)
    if (flag) {
      runDialogProps.value = '1'
    }

    return flag
  }

  @action
  hasRadioNeedChange(run: { [K: string]: any } = {}, runDialogProps: { [K: string]: any } = {}) {
    let current = run.current || {}
    let runnable = current.runnable || {}

    if (
      !Utils.isBlank(runnable.branch || '') ||
      !Utils.isBlank(runnable.make || '') ||
      !Utils.isBlank(runnable.command || '') ||
      !Utils.isBlank(runnable.script || '')
    ) {
      return true
    }

    return false
  }

  /**
   * 设置复用上次运行记录
   */
  @action
  onSetRadioRunProps(selectedItem: { [K: string]: any } = {}, runDialogProps: { [K: string]: any } = {}) {
    let detail = selectedItem || {}
    let run = detail.run || {}
    let current = run.current || {}
    let runnable = current.runnable || {}
    runDialogProps.h5 = {
      branch: runnable.branch || '',
      make: runnable.make || '',
      command: runnable.command || '',
      script: runnable.script || '',
    }

    // 设置 variable
    runDialogProps.variable = {}
    let selectedVariables: Array<{ [K: string]: any }> = runnable.selectedVariables || []
    let variables: Array<{ [K: string]: any }> = runnable.variables || []
    if (selectedVariables.length > 0) {
      selectedVariables.forEach(item => {
        let selectedItem = variables.find(s => s.id === item.id) || {}
        if (!Utils.isObjectNull(selectedItem)) {
          runDialogProps.variable[selectedItem.name] = {
            id: selectedItem.id || '',
            value: item.value || '',
            name: selectedItem.name,
          }
        }
      })
    }
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

    let runDialogProps = dialogProps || {}
    if (Utils.isObjectNull(runDialogProps)) {
      runDialogProps = this.runDialogProps || {}
    }

    let tag = info.basic.tag || ''
    let variables = info.variables || []

    // h5
    if (tag === this.TAGS[7].value) {
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
  getStepProps(item: { [K: string]: any } = {}, runDialogProps: { [K: string]: any } = {}) {
    let extra = item.extra || {}
    let id = item.id || ''
    let serverId = item.serverId || ''
    let tag = item.basic.tag || ''
    let extraH5 = extra.h5 || {}

    let h5 = runDialogProps.h5 || {}
    let variable = runDialogProps.variable || {}
    h5.node = extraH5.node || ''
    let params = {
      id,
      serverId,
      step: 1, // 从第一步开始
      tag,
      ...h5,
      remark: runDialogProps.remark || '',
    }

    let variables: Array<{ [K: string]: any }> = []
    for (let key in variable) {
      variables.push(variable[key])
    }

    // 补充其他的值
    for (let variable of item.variables) {
      let v = variables.find(v => v.id === variable.id) || {}
      if (Utils.isObjectNull(v)) {
        variables.push({
          id: variable.id,
          value: '',
          name: variable.name || '',
        })
      }
    }

    params.selectedVariables = variables
    params.variables = item.variables || []
    return params
  }

  /**
   * 运行流水线
   */
  @action
  async onRun(isReadonly: boolean = false, callback?: Function) {
    try {
      let params = this.getStepProps(isReadonly ? this.selectItem || {} : this.detailInfo || {}, this.runDialogProps)
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
      this.onRunStep(params)
      callback?.()
    } catch (e: any) {
      this.loading = false
      throw new Error(e)
    }
  }

  /**
   * 异步运行流水线步骤
   */
  @action
  onRunStep(params: { [K: string]: any }) {
    try {
      console.log('run pipeline step params:', params)
      invoke('exec_steps', { props: params }) || {}
    } catch (e: any) {
      throw new Error(e)
    }
  }

  /**
   * 获取运行对话框属性
   */
  @action
  getDialogRunProps(item: { [K: string]: any } = {}) {
    let extra = item.extra || {}
    let h5 = this.TAGS[this.TAGS.length - 1].value
    let h5Extra = extra[h5.toLowerCase()] || {}
    let branches = extra.branches || []
    let displayFields = h5Extra.displayFields || []

    let list: Array<{ [K: string]: any }> = []
    for (let field of displayFields) {
      list.push({
        name: field.label,
        value: field.key === 'branches' ? branches : h5Extra[field.key],
        genre: field.type,
        desc: field.desc || '',
        tag: h5,
      })
    }

    return list
  }

  @action
  getReadonlyDialogRunProps(item: { [K: string]: any } = {}) {
    let current = item.current || {}
    let extra = item.extra || {}
    let h5 = this.TAGS[this.TAGS.length - 1].value
    let h5Extra = extra[h5.toLowerCase()] || {}
    let runnable = current.runnable || {}
    let displayFields = h5Extra.displayFields || []

    let list: Array<{ [K: string]: any }> = []
    for (let field of displayFields) {
      list.push({
        name: field.label,
        value: runnable[field.value || ''],
        genre: this.VARIABLE_OPTIONS[0].value,
        desc: field.desc || '',
        tag: h5,
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

    let variables = isReadonly ? selectItem?.current?.runnable.selectedVariables || [] : selectItem.variables || []
    variables =
      variables.map((item: { [K: string]: any } = {}) => {
        return { ...item, isVariable: true }
      }) || []
    list = list.concat(variables) || []
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
          value: b,
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
      tag,
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

}

export default new PipelineStore()
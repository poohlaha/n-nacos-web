/**
 * @fileOverview H5 模板
 * @date 2024-03-11
 * @author poohlaha
 */
import MarketTemplateData from '../../../pipelineMarket/templates/template.json'
import Utils from '@utils/utils'

const LOCAL_TEMPLATE: Array<Array<{ [K: string]: any }>> = [
  [
    {
      title: {
        label: '依赖安装',
      },
      marketId: '2',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '项目打包',
      },
      marketId: '3',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '文件压缩',
      },
      marketId: '4',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '图片压缩',
      },
      marketId: '5',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '项目部署',
      },
      marketId: '6',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '发送通知',
      },
      marketId: '7',
      steps: [],
    },
  ],
]

const REMOTE_TEMPLATE: Array<Array<{ [K: string]: any }>> = [
  [
    {
      title: {
        label: '代码拉取',
      },
      marketId: '1',
      steps: [],
    },
  ],
  ...LOCAL_TEMPLATE,
]

const getSteps = (list: Array<Array<any>> = []) => {
  return list.map((items: Array<{ [K: string]: any }> = []) => {
    return items.map(item => {
      let marketId = item.marketId || ''
      let marketTemplate: { [K: string]: any } =
        MarketTemplateData.find((d: { [K: string]: any } = {}) => d.id === marketId) || {}
      if (!Utils.isObjectNull(marketTemplate)) {
        item.steps = [marketTemplate]
      }
      return item
    })
  })
}

// 启动变量
const H5_VARIABLE_LIST: Array<{ [K: string]: any }> = [
  {
    id: Utils.generateUUID(),
    name: 'deployDir',
    genre: 'select',
    value: 'build\ndist',
    disabled: 'no',
    require: 'no',
    desc: '项目部署目录',
  },
  {
    id: Utils.generateUUID(),
    name: 'needIncrement',
    genre: 'select',
    value: 'Yes\nNo',
    disabled: 'no',
    require: 'no',
    desc: '是否增量发布',
  },
]

const getH5InstalledSelect = (h5InstalledCommands: Array<string>) => {
  if (h5InstalledCommands.length === 0) return []

  let options: Array<{ [K: string]: any }> = []
  h5InstalledCommands.forEach(command => {
    options.push({
      label: command,
      value: command,
    })
  })

  return options
}

const replaceStepsComponentValue = (list: Array<Array<any>> = [], os: { [K: string]: any } = {}) => {
  if (Utils.isObjectNull(os)) return list
  if (list.length === 0) return []

  let h5InstalledCommands = os.h5InstalledCommands || []
  if (h5InstalledCommands.length === 0) return list

  let h5InstalledOptions = getH5InstalledSelect(h5InstalledCommands) || []
  return list.map((items: Array<{ [K: string]: any }> = []) => {
    return items.map(item => {
      let marketId = item.marketId || ''
      let marketTemplate: { [K: string]: any } =
        MarketTemplateData.find((d: { [K: string]: any } = {}) => d.id === marketId) || {}
      if (!Utils.isObjectNull(marketTemplate)) {
        let components = marketTemplate.components || []
        if (components.length === 0) {
          item.steps = [marketTemplate]
        } else {
          components.map((component: { [K: string]: any }) => {
            let type = component.type || ''
            if (type === 'select') {
              let options = component.options || ''

              // h5InstalledCommands
              if (options === '${h5InstalledCommands}') {
                component.options = h5InstalledOptions || []
              }
            }

            return component
          })
        }
      }
      return item
    })
  })
}

const updateMarket = (list: Array<Array<any>> = [], market: { [K: string]: any } = {}) => {
  if (Utils.isObjectNull(market)) return list
  if (list.length === 0) return []

  return list.map((items: Array<{ [K: string]: any }> = []) => {
    return items.map(item => {
      let steps = item.steps || []
      item.steps = steps.map((step: { [K: string]: any } = {}) => {
        if (step.id === market.id) {
          return market
        }

        return step
      })
      return item
    })
  })
}

const H5_LOCAL_TEMPLATE = getSteps(LOCAL_TEMPLATE)
const H5_REMOTE_TEMPLATE = getSteps(REMOTE_TEMPLATE)

export { H5_LOCAL_TEMPLATE, H5_REMOTE_TEMPLATE, H5_VARIABLE_LIST, replaceStepsComponentValue, updateMarket }

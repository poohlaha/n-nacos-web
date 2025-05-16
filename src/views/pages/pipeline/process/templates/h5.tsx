/**
 * @fileOverview H5 模板
 * @date 2024-03-11
 * @author poohlaha
 */
import MarketTemplateData from '@pages/pipeline/market/templates/template.json'
import H5Data from '@pages/pipeline/market/pipeline/h5.json'
import Utils from '@utils/utils'
import { getSteps } from '@pages/pipeline/process/templates/common'

const LOCAL_TEMPLATE: Array<Array<{ [K: string]: any }>> = H5Data.common || []

const REMOTE_TEMPLATE: Array<Array<{ [K: string]: any }>> = [...H5Data.remote, ...LOCAL_TEMPLATE]

// 启动变量
const H5_VARIABLE_LIST: Array<{ [K: string]: any }> = [
  {
    id: Utils.generateUUID(),
    order: 1,
    name: 'deployDir',
    genre: 'select',
    value: 'build\ndist',
    disabled: 'no',
    require: 'no',
    desc: '项目部署目录'
  },
  {
    id: Utils.generateUUID(),
    order: 2,
    name: 'needIncrement',
    genre: 'select',
    value: 'Yes\nNo',
    disabled: 'no',
    require: 'no',
    desc: '是否增量发布'
  }
]

const getH5InstalledSelect = (h5InstalledCommands: Array<string>) => {
  if (h5InstalledCommands.length === 0) return []

  let options: Array<{ [K: string]: any }> = []
  h5InstalledCommands.forEach(command => {
    options.push({
      label: command,
      value: command
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
              if (options === `${h5InstalledCommands}`) {
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

const H5_LOCAL_TEMPLATE = getSteps(LOCAL_TEMPLATE)
const H5_REMOTE_TEMPLATE = getSteps(REMOTE_TEMPLATE)

export {
  LOCAL_TEMPLATE,
  REMOTE_TEMPLATE,
  H5_LOCAL_TEMPLATE,
  H5_REMOTE_TEMPLATE,
  H5_VARIABLE_LIST,
  replaceStepsComponentValue
}

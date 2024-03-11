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
        label: '项目部署',
      },
      marketId: '5',
      steps: [],
    },
  ],
  [
    {
      title: {
        label: '发送通知',
      },
      marketId: '6',
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

const H5_LOCAL_TEMPLATE = getSteps(LOCAL_TEMPLATE)
const H5_REMOTE_TEMPLATE = getSteps(REMOTE_TEMPLATE)

export { H5_LOCAL_TEMPLATE, H5_REMOTE_TEMPLATE }

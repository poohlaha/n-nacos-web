import MarketTemplateData from '@pages/pipeline/market/templates/template.json'
import Utils from '@utils/utils'

const getSteps = (list: Array<Array<any>> = []) => {
  return list.map((items: Array<{ [K: string]: any }> = []) => {
    return items.map(item => {
      let marketId = item.marketId || ''
      if (!Utils.isBlank(marketId)) {
        let marketTemplate: { [K: string]: any } =
          MarketTemplateData.find((d: { [K: string]: any } = {}) => d.id === marketId) || {}
        if (!Utils.isObjectNull(marketTemplate)) {
          item.steps = [marketTemplate]
        }
      } else {
        let steps = item.steps || []
        if (steps.length > 0) {
          item.steps = steps.map((step: { [K: string]: any } = {}) => {
            let marketId = step.marketId || ''
            if (!Utils.isBlank(marketId)) {
              let marketTemplate: { [K: string]: any } =
                MarketTemplateData.find((d: { [K: string]: any } = {}) => d.id === marketId) || {}
              if (!Utils.isObjectNull(marketTemplate)) {
                step.components = marketTemplate.components || []
              }
            }

            return step
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
        let stepId = step.id || ''
        let marketId = market.id || ''
        if (!Utils.isBlank(stepId) && !Utils.isBlank(marketId)) {
          if (stepId === marketId) {
            return market
          }
        }

        let stepMarketId = step.marketId || ''
        let marketMarketId = market.marketId || ''
        if (!Utils.isBlank(stepMarketId) && !Utils.isBlank(marketMarketId)) {
          if (stepMarketId === marketMarketId) {
            return market
          }
        }

        return step
      })
      return item
    })
  })
}

export { getSteps, updateMarket }

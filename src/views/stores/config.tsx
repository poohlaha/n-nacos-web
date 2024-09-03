/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import homeStore from './main/home.store'
import dashboardStore from './modules/dashboard.store'
import monitorStore from './modules/monitor.store'
import nginxStore from './modules/nginx.store'
import directoryStore from './modules/directory.store'
import mainStore from './main/main.store'
import pipelineStore from './main/pipeline.store'
import serverStore from './modules/server.store'
import pipelineMarketStore from './main/pipeline.market.store'
import writingStore from '@stores/writing/writing.store'

export function createStore() {
  return {
    commonStore,
    homeStore,
    dashboardStore,
    monitorStore,
    nginxStore,
    directoryStore,
    mainStore,
    pipelineStore,
    serverStore,
    pipelineMarketStore,
    writingStore,
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>

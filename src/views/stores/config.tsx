/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import leftStore from './main/left.store'
import dashboardStore from './modules/dashboard.store'
import monitorStore from './modules/monitor.store'
import nginxStore from './modules/nginx.store'
export function createStore() {
  return {
    commonStore,
    leftStore,
    dashboardStore,
    monitorStore,
    nginxStore
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>

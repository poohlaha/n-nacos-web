/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import leftStore from './main/left.store'
import nginxStore from './modules/nginx.store'
import dashboardStore from './modules/dashboard.store'
export function createStore() {
  return {
    commonStore,
    leftStore,
    dashboardStore,
    nginxStore
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>

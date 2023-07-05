/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import leftStore from './main/left.store'
import nginxStore from './main/nginx.store'

export function createStore() {
  return {
    commonStore,
    leftStore,
    nginxStore
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>

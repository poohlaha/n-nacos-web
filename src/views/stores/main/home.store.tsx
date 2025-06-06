/**
 * @fileOverview home store
 * @date 2023-07-03
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import { lazy } from 'react'
import RouterUrls from '@route/router.url.toml'
import React from 'react'
import Utils from '@utils/utils'
import PipelineAdd from '@pages/pipeline/add'
import PipelineDetail from '@pages/pipeline/detail'
import { ADDRESS } from '@utils/base'
import { SYSTEM } from '@config/index'

class HomeStore extends BaseStore {
  // 选中的菜单
  @observable selectedMenuKeys: Array<string> = []

  // 用户信息
  @observable userInfo: { [K: string]: any } = {}

  readonly MENU_LIST_BAK: Array<{ [K: string]: any }> = [
    {
      key: RouterUrls.DASHBOARD.KEY,
      label: RouterUrls.DASHBOARD.NAME,
      url: RouterUrls.DASHBOARD.URL,
      icon: (
        <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M902.016 130.016H123.008q-23.008 0-40 16.992t-16.992 40v480q0 24 16.992 40.512t40 16.512H480v108h-147.008q-12.992 0-22.496 9.504t-9.504 22.496 9.504 22.016 22.496 8.992h358.016q12.992 0 22.496-8.992t9.504-22.016-9.504-22.496-22.496-9.504h-148v-108h359.008q24 0 40.512-16.512t16.512-40.512v-480q0-23.008-16.512-40t-40.512-16.992zM896 192.992v468H128.992V192.992H896z"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@views/pages/dashboard'))
    },
    {
      key: RouterUrls.SERVER.KEY,
      label: RouterUrls.SERVER.NAME,
      url: RouterUrls.SERVER.URL,
      type: 'group',
      children: [
        {
          key: RouterUrls.SERVER.LIST.KEY,
          label: RouterUrls.SERVER.LIST.NAME,
          url: RouterUrls.SERVER.LIST.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M960 42.666667H64c-12.8 0-21.333333 8.533333-21.333333 21.333333v896c0 12.8 8.533333 21.333333 21.333333 21.333333h896c12.8 0 21.333333-8.533333 21.333333-21.333333V64c0-12.8-8.533333-21.333333-21.333333-21.333333z m-21.333333 896H85.333333V682.666667h853.333334v256z m0-298.666667H85.333333V384h853.333334v256z m0-298.666667H85.333333V85.333333h853.333334v256zM298.666667 768h-42.666667v85.333333h42.666667v-85.333333z m-85.333334 0H170.666667v85.333333h42.666666v-85.333333z m661.333334 21.333333h-170.666667v42.666667h170.666667v-42.666667zM298.666667 469.333333h-42.666667v85.333334h42.666667v-85.333334z m-85.333334 0H170.666667v85.333334h42.666666v-85.333334z m661.333334 21.333334h-170.666667v42.666666h170.666667v-42.666666zM298.666667 170.666667h-42.666667v85.333333h42.666667V170.666667z m-85.333334 0H170.666667v85.333333h42.666666V170.666667z m661.333334 21.333333h-170.666667v42.666667h170.666667V192z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'serverList' */ '@views/pages/server'))
        }
      ]
    },
    {
      key: RouterUrls.PIPELINE.KEY,
      label: RouterUrls.PIPELINE.NAME,
      url: RouterUrls.PIPELINE.URL,
      type: 'group',
      children: [
        {
          key: RouterUrls.PIPELINE.LIST.KEY,
          label: RouterUrls.PIPELINE.LIST.NAME,
          url: RouterUrls.PIPELINE.LIST.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M204.8 51.2a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4zM819.2 665.6a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z"
                fill="currentColor"
              ></path>
              <path
                d="M818.9952 153.6c81.92 0 148.8896 63.9488 153.5488 144.5888L972.8 307.2v102.4a153.7024 153.7024 0 0 1-144.7424 153.344l-9.0624 0.256H205.0048a51.2 51.2 0 0 0-50.944 45.2096L153.7024 614.4v102.4a51.2 51.2 0 0 0 45.312 50.8416l5.9904 0.3584h510.1568v102.4H205.0048a153.7024 153.7024 0 0 1-153.5488-144.5888L51.2 716.8v-102.4a153.7024 153.7024 0 0 1 144.7424-153.344L205.0048 460.8h613.9904a51.2 51.2 0 0 0 50.944-45.2096L870.2976 409.6V307.2a51.2 51.2 0 0 0-45.312-50.8416L818.9952 256H258.1504V153.6h560.8448z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'pipelineList' */ '@views/pages/pipeline/index'))
        },
        {
          key: RouterUrls.PIPELINE.MARKET.KEY,
          label: RouterUrls.PIPELINE.MARKET.NAME,
          url: RouterUrls.PIPELINE.MARKET.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M115.808 774.88a128 128 0 1 0 0-205.728L97.12 544H64v-128a96 96 0 0 1 96-96h74.944a192 192 0 1 1 362.144 0H640a96 96 0 0 1 96 96v74.944a192 192 0 1 1 0 362.144V896a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96v-96a32 32 0 0 1 51.808-25.12zM128 853.056V896a32 32 0 0 0 32 32h480a32 32 0 0 0 32-32v-96a32 32 0 0 1 51.808-25.12 128 128 0 1 0 0-205.76A32 32 0 0 1 672 544v-128a32 32 0 0 0-32-32h-96a32 32 0 0 1-20.864-56.256l-0.768-0.512a128 128 0 1 0-210.88 2.752l-0.16 0.128A32 32 0 0 1 288 384H160.032a32 32 0 0 0-32 32v74.944a192 192 0 1 1 0 362.144zM96 576a32 32 0 1 1 0-64 32 32 0 0 1 0 64z m0 256a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'pipelineMarket' */ '@views/pages/pipeline/market'))
        }
      ]
    },
    {
      key: RouterUrls.NOTE.KEY,
      label: RouterUrls.NOTE.NAME,
      url: RouterUrls.NOTE.URL,
      // type: 'group',
      children: [
        {
          key: RouterUrls.NOTE.LIST.KEY,
          label: RouterUrls.NOTE.LIST.NAME,
          url: RouterUrls.NOTE.LIST.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M903.104 0a120.224 120.224 0 0 1 119.872 119.936v783.2a120.224 120.224 0 0 1-119.84 119.872H119.872A120.224 120.224 0 0 1 0 903.168V119.968A120.192 120.192 0 0 1 119.84 0.032h0.032z m-18.656 85.248H138.528a52.8 52.8 0 0 0-37.504 15.68c-9.696 9.6-15.744 22.88-15.776 37.6v745.92c0 14.08 5.632 27.52 15.68 37.6 9.6 9.664 22.88 15.68 37.6 15.68h745.92a52.8 52.8 0 0 0 37.504-15.68 52.8 52.8 0 0 0 15.776-37.504V138.624v-0.032c0-14.72-5.984-28.032-15.68-37.632a52.8 52.8 0 0 0-37.6-15.68zM312.864 255.744l184.896 311.328c7.744 17.056 13.888 30.848 18.336 41.344l26.016-56.608 12.032-25.408 171.168-270.656h127.2v511.488h-91.2V339.104l-207.488 342.88h-85.408l-206.72-350.112v435.36H170.56V255.744h142.368z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'note' */ '@views/pages/note/index'))
        }
      ]
    },
    {
      key: RouterUrls.TOOLS.KEY,
      label: RouterUrls.TOOLS.NAME,
      url: RouterUrls.TOOLS.URL,
      type: 'group',
      children: [
        {
          key: RouterUrls.TOOLS.FILELOOK.KEY,
          label: RouterUrls.TOOLS.FILELOOK.NAME,
          url: RouterUrls.TOOLS.FILELOOK.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M758.442667 0a180.167111 180.167111 0 0 1 179.882666 169.870222l0.284445 10.24v311.068445a28.444444 28.444444 0 0 1-56.433778 5.12l-0.455111-5.12V180.110222a123.278222 123.278222 0 0 0-114.460445-122.936889l-8.817777-0.341333H209.237333a123.278222 123.278222 0 0 0-122.993777 114.460444l-0.284445 8.817778v662.641778c0 65.080889 50.460444 118.385778 114.460445 122.88l8.817777 0.341333h397.653334a28.444444 28.444444 0 0 1 5.12 56.433778l-5.12 0.455111h-397.653334a180.167111 180.167111 0 0 1-179.882666-169.927111l-0.284445-10.24V180.167111A180.167111 180.167111 0 0 1 198.997333 0.227556L209.237333 0h549.205334z m-71.964445 487.822222a227.555556 227.555556 0 0 1 180.167111 366.535111l120.035556 119.978667a28.444444 28.444444 0 0 1-36.352 43.52l-3.925333-3.299556-119.864889-119.808a227.555556 227.555556 0 1 1-140.060445-406.926222z m0 56.888889a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333zM360.789333 682.666667a28.444444 28.444444 0 0 1 5.12 56.433777l-5.12 0.455112H199.111111a28.444444 28.444444 0 0 1-5.12-56.433778L199.111111 682.666667h161.678222z m113.777778-227.555556a28.444444 28.444444 0 0 1 5.12 56.433778L474.510222 512H199.111111a28.444444 28.444444 0 0 1-5.12-56.433778L199.111111 455.111111h275.456zM768 227.555556a28.444444 28.444444 0 0 1 5.12 56.433777L768 284.444444H199.111111a28.444444 28.444444 0 0 1-5.12-56.433777L199.111111 227.555556h568.888889z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'note' */ '@views/pages/tools/look'))
        }
      ]
    },
    {
      key: RouterUrls.SETTING.KEY,
      label: RouterUrls.SETTING.NAME,
      url: RouterUrls.SETTING.URL,
      type: 'group',
      icon: (
        <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M204.8 51.2a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4zM819.2 665.6a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z"
            fill="currentColor"
          ></path>
          <path
            d="M818.9952 153.6c81.92 0 148.8896 63.9488 153.5488 144.5888L972.8 307.2v102.4a153.7024 153.7024 0 0 1-144.7424 153.344l-9.0624 0.256H205.0048a51.2 51.2 0 0 0-50.944 45.2096L153.7024 614.4v102.4a51.2 51.2 0 0 0 45.312 50.8416l5.9904 0.3584h510.1568v102.4H205.0048a153.7024 153.7024 0 0 1-153.5488-144.5888L51.2 716.8v-102.4a153.7024 153.7024 0 0 1 144.7424-153.344L205.0048 460.8h613.9904a51.2 51.2 0 0 0 50.944-45.2096L870.2976 409.6V307.2a51.2 51.2 0 0 0-45.312-50.8416L818.9952 256H258.1504V153.6h560.8448z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      children: [
        {
          key: RouterUrls.SETTING.SYSTEM.KEY,
          label: RouterUrls.SETTING.SYSTEM.NAME,
          url: RouterUrls.SETTING.SYSTEM.URL,
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path d="M512 671.72c-88.05 0-159.7-71.64-159.7-159.69 0-88.06 71.65-159.7 159.7-159.7s159.68 71.64 159.68 159.7c0 88.05-71.63 159.69-159.68 159.69z m0-265.67c-58.44 0-105.98 47.54-105.98 105.98C406.02 570.46 453.56 618 512 618c58.43 0 105.97-47.54 105.97-105.97 0-58.44-47.54-105.98-105.97-105.98z"></path>
              <path d="M650.46 926.48c-20.51 0-40.5-10.64-51.48-29.65-17.46-30.22-49.94-48.97-84.83-48.97h-0.12l-3.82-0.01c-0.31-0.01-0.63-0.01-0.96-0.01-34.6 0-66.32 17.89-83.04 46.88-8.25 14.29-21.57 24.51-37.52 28.77-15.96 4.29-32.59 2.09-46.87-6.16L244.3 861c-13.81-7.97-23.69-20.84-27.81-36.24-4.12-15.4-2.01-31.48 5.97-45.29 17.72-30.69 17.74-68.84 0.06-99.55l-0.69-1.2c-17.62-30.61-50.5-49.62-85.8-49.62-33.12 0-60.07-26.95-60.07-60.07V457.81c0-34.63 28.17-62.8 62.8-62.8 33.66 0 65-18.12 81.79-47.28 18.92-32.85 18.9-73.65-0.05-106.48l-3.06-5.29c-13.7-23.74-5.54-54.16 18.16-67.84l105.79-61.08c29.77-17.17 67.93-6.93 85.1 22.8 16.6 28.78 48.07 46.54 82.26 46.54 0.35 0 0.71 0 1.05-0.01l3.53-0.02h0.12c35.57 0 68.03-18.73 85.44-48.91 8.08-14 20.84-23.79 36.12-27.88 15.24-4.12 31.2-2 44.89 5.91l100.25 57.89c13.69 7.89 23.48 20.65 27.57 35.92 4.09 15.26 1.99 31.21-5.9 44.89-17.22 29.82-16.58 67.77 1.68 99.04l1.08 1.87c17.7 30.73 50.03 49.91 84.31 49.91 32.63 0 59.17 26.54 59.17 59.17v115.87c0 32.56-26.49 59.05-59.06 59.05-34.31 0-66.69 19.21-84.48 50.13l-0.98 1.69c-18.26 31.29-18.89 69.27-1.65 99.11 16.26 28.2 6.57 64.37-21.61 80.65l-100.22 57.86c-9.35 5.4-19.54 7.96-29.6 7.96zM514.2 794.14c53.98 0 104.29 29.04 131.3 75.83 0.96 1.67 2.39 2.33 3.41 2.61 1.04 0.3 2.58 0.39 4.26-0.55l100.22-57.86c2.54-1.47 3.41-4.73 1.94-7.28-26.85-46.49-26.16-105.13 1.78-153.04l24.1 11.99-23.28-13.4c27.36-47.53 77.57-77.06 131.04-77.06 2.94 0 5.34-2.39 5.34-5.33V454.18c0-3-2.45-5.45-5.46-5.45-53.43 0-103.61-29.49-130.95-76.96l-0.84-1.46c-27.95-47.89-28.64-106.5-1.81-152.98 0.93-1.61 0.81-3.14 0.55-4.14-0.26-0.99-0.92-2.37-2.53-3.3L653.04 152a5.369 5.369 0 0 0-4.13-0.54c-1 0.26-2.37 0.92-3.3 2.53-27.17 47.07-77.46 76.09-131.44 76.09H514l-3.58 0.02c-54.11 0.52-103.99-27.55-130.45-73.4-1.53-2.68-3.92-3.65-5.21-3.99-1.3-0.34-3.84-0.68-6.5 0.85L266 212.6l1.01 1.76c28.52 49.4 28.55 110.76 0.09 160.17-26.35 45.76-75.53 74.19-128.34 74.19-5.01 0-9.08 4.07-9.08 9.08v111.22c0 3.5 2.85 6.35 6.35 6.35 54.47 0 105.18 29.32 132.35 76.53l0.69 1.19c27.21 47.28 27.18 105.99-0.09 153.22-1.02 1.78-0.89 3.44-0.6 4.54 0.29 1.08 1.01 2.6 2.77 3.61l97.55 56.31c3.84 2.22 8.79 0.92 11-2.94 26.31-45.58 75.84-73.74 129.51-73.74 0.5 0 0.97 0 1.46 0.01l3.36 0.01c0.04 0.03 0.11 0.03 0.17 0.03z"></path>
            </svg>
          ),
          component: lazy(() => import(/* webpackChunkName:'setting' */ '@views/pages/setting/system'))
        }
      ]
    }
  ]

  readonly MENU_LIST: Array<{ [K: string]: any }> = [
    {
      key: RouterUrls.DASHBOARD.KEY,
      label: RouterUrls.DASHBOARD.NAME,
      url: RouterUrls.DASHBOARD.URL,
      parentUrl: '',
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M902.016 130.016H123.008q-23.008 0-40 16.992t-16.992 40v480q0 24 16.992 40.512t40 16.512H480v108h-147.008q-12.992 0-22.496 9.504t-9.504 22.496 9.504 22.016 22.496 8.992h358.016q12.992 0 22.496-8.992t9.504-22.016-9.504-22.496-22.496-9.504h-148v-108h359.008q24 0 40.512-16.512t16.512-40.512v-480q0-23.008-16.512-40t-40.512-16.992zM896 192.992v468H128.992V192.992H896z"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@views/pages/dashboard'))
    },
    {
      key: RouterUrls.SERVER.LIST.KEY,
      label: RouterUrls.SERVER.LIST.NAME,
      url: RouterUrls.SERVER.LIST.URL,
      parentUrl: RouterUrls.SERVER.URL,
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M960 42.666667H64c-12.8 0-21.333333 8.533333-21.333333 21.333333v896c0 12.8 8.533333 21.333333 21.333333 21.333333h896c12.8 0 21.333333-8.533333 21.333333-21.333333V64c0-12.8-8.533333-21.333333-21.333333-21.333333z m-21.333333 896H85.333333V682.666667h853.333334v256z m0-298.666667H85.333333V384h853.333334v256z m0-298.666667H85.333333V85.333333h853.333334v256zM298.666667 768h-42.666667v85.333333h42.666667v-85.333333z m-85.333334 0H170.666667v85.333333h42.666666v-85.333333z m661.333334 21.333333h-170.666667v42.666667h170.666667v-42.666667zM298.666667 469.333333h-42.666667v85.333334h42.666667v-85.333334z m-85.333334 0H170.666667v85.333334h42.666666v-85.333334z m661.333334 21.333334h-170.666667v42.666666h170.666667v-42.666666zM298.666667 170.666667h-42.666667v85.333333h42.666667V170.666667z m-85.333334 0H170.666667v85.333333h42.666666V170.666667z m661.333334 21.333333h-170.666667v42.666667h170.666667V192z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'serverList' */ '@views/pages/server'))
    },
    {
      key: RouterUrls.PIPELINE.LIST.KEY,
      label: RouterUrls.PIPELINE.LIST.NAME,
      url: RouterUrls.PIPELINE.LIST.URL,
      parentUrl: RouterUrls.PIPELINE.URL,
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M204.8 51.2a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4zM819.2 665.6a153.6 153.6 0 1 1 0 307.2 153.6 153.6 0 0 1 0-307.2z m0 102.4a51.2 51.2 0 1 0 0 102.4 51.2 51.2 0 0 0 0-102.4z"
            fill="currentColor"
          ></path>
          <path
            d="M818.9952 153.6c81.92 0 148.8896 63.9488 153.5488 144.5888L972.8 307.2v102.4a153.7024 153.7024 0 0 1-144.7424 153.344l-9.0624 0.256H205.0048a51.2 51.2 0 0 0-50.944 45.2096L153.7024 614.4v102.4a51.2 51.2 0 0 0 45.312 50.8416l5.9904 0.3584h510.1568v102.4H205.0048a153.7024 153.7024 0 0 1-153.5488-144.5888L51.2 716.8v-102.4a153.7024 153.7024 0 0 1 144.7424-153.344L205.0048 460.8h613.9904a51.2 51.2 0 0 0 50.944-45.2096L870.2976 409.6V307.2a51.2 51.2 0 0 0-45.312-50.8416L818.9952 256H258.1504V153.6h560.8448z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'pipelineList' */ '@views/pages/pipeline/index'))
    },
    {
      key: RouterUrls.PIPELINE.MARKET.KEY,
      label: RouterUrls.PIPELINE.MARKET.NAME,
      url: RouterUrls.PIPELINE.MARKET.URL,
      parentUrl: RouterUrls.PIPELINE.URL,
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M115.808 774.88a128 128 0 1 0 0-205.728L97.12 544H64v-128a96 96 0 0 1 96-96h74.944a192 192 0 1 1 362.144 0H640a96 96 0 0 1 96 96v74.944a192 192 0 1 1 0 362.144V896a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96v-96a32 32 0 0 1 51.808-25.12zM128 853.056V896a32 32 0 0 0 32 32h480a32 32 0 0 0 32-32v-96a32 32 0 0 1 51.808-25.12 128 128 0 1 0 0-205.76A32 32 0 0 1 672 544v-128a32 32 0 0 0-32-32h-96a32 32 0 0 1-20.864-56.256l-0.768-0.512a128 128 0 1 0-210.88 2.752l-0.16 0.128A32 32 0 0 1 288 384H160.032a32 32 0 0 0-32 32v74.944a192 192 0 1 1 0 362.144zM96 576a32 32 0 1 1 0-64 32 32 0 0 1 0 64z m0 256a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'pipelineMarket' */ '@views/pages/pipeline/market'))
    },
    {
      key: RouterUrls.NOTE.LIST.KEY,
      label: RouterUrls.NOTE.LIST.NAME,
      url: RouterUrls.NOTE.LIST.URL,
      parentUrl: RouterUrls.NOTE.URL,
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M903.104 0a120.224 120.224 0 0 1 119.872 119.936v783.2a120.224 120.224 0 0 1-119.84 119.872H119.872A120.224 120.224 0 0 1 0 903.168V119.968A120.192 120.192 0 0 1 119.84 0.032h0.032z m-18.656 85.248H138.528a52.8 52.8 0 0 0-37.504 15.68c-9.696 9.6-15.744 22.88-15.776 37.6v745.92c0 14.08 5.632 27.52 15.68 37.6 9.6 9.664 22.88 15.68 37.6 15.68h745.92a52.8 52.8 0 0 0 37.504-15.68 52.8 52.8 0 0 0 15.776-37.504V138.624v-0.032c0-14.72-5.984-28.032-15.68-37.632a52.8 52.8 0 0 0-37.6-15.68zM312.864 255.744l184.896 311.328c7.744 17.056 13.888 30.848 18.336 41.344l26.016-56.608 12.032-25.408 171.168-270.656h127.2v511.488h-91.2V339.104l-207.488 342.88h-85.408l-206.72-350.112v435.36H170.56V255.744h142.368z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'note' */ '@views/pages/note/index'))
    },
    {
      key: RouterUrls.TOOLS.FILELOOK.KEY,
      label: RouterUrls.TOOLS.FILELOOK.NAME,
      url: RouterUrls.TOOLS.FILELOOK.URL,
      parentUrl: RouterUrls.TOOLS.URL,
      icon: (
        <svg className="wh100" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M758.442667 0a180.167111 180.167111 0 0 1 179.882666 169.870222l0.284445 10.24v311.068445a28.444444 28.444444 0 0 1-56.433778 5.12l-0.455111-5.12V180.110222a123.278222 123.278222 0 0 0-114.460445-122.936889l-8.817777-0.341333H209.237333a123.278222 123.278222 0 0 0-122.993777 114.460444l-0.284445 8.817778v662.641778c0 65.080889 50.460444 118.385778 114.460445 122.88l8.817777 0.341333h397.653334a28.444444 28.444444 0 0 1 5.12 56.433778l-5.12 0.455111h-397.653334a180.167111 180.167111 0 0 1-179.882666-169.927111l-0.284445-10.24V180.167111A180.167111 180.167111 0 0 1 198.997333 0.227556L209.237333 0h549.205334z m-71.964445 487.822222a227.555556 227.555556 0 0 1 180.167111 366.535111l120.035556 119.978667a28.444444 28.444444 0 0 1-36.352 43.52l-3.925333-3.299556-119.864889-119.808a227.555556 227.555556 0 1 1-140.060445-406.926222z m0 56.888889a170.666667 170.666667 0 1 0 0 341.333333 170.666667 170.666667 0 0 0 0-341.333333zM360.789333 682.666667a28.444444 28.444444 0 0 1 5.12 56.433777l-5.12 0.455112H199.111111a28.444444 28.444444 0 0 1-5.12-56.433778L199.111111 682.666667h161.678222z m113.777778-227.555556a28.444444 28.444444 0 0 1 5.12 56.433778L474.510222 512H199.111111a28.444444 28.444444 0 0 1-5.12-56.433778L199.111111 455.111111h275.456zM768 227.555556a28.444444 28.444444 0 0 1 5.12 56.433777L768 284.444444H199.111111a28.444444 28.444444 0 0 1-5.12-56.433777L199.111111 227.555556h568.888889z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      component: lazy(() => import(/* webpackChunkName:'note' */ '@views/pages/tools/look'))
    }
  ]

  @observable breadcrumbItems: Array<{ [K: string]: any }> = [] // 面包屑

  @observable selectedMenu: string = this.MENU_LIST[2].key

  constructor() {
    super()
    this.getSelectMenuByUrl()
  }

  /**
   * 根据 url 获取选中的 key
   */
  @action
  getSelectMenuByUrl() {
    let { addressUrl } = ADDRESS.getAddress()
    console.log('addressUrl', addressUrl)
    if (addressUrl === `${RouterUrls.SETTING.URL}${RouterUrls.SETTING.SYSTEM.URL}`) {
      this.selectedMenu = RouterUrls.SETTING.SYSTEM.KEY
      return
    }

    // 根据key查找url
    let obj =
      this.MENU_LIST.find((item: { [K: string]: any } = {}) => `${item.parentUrl}${item.url}` === addressUrl) || {}
    if (!Utils.isObjectNull(obj || {})) {
      this.selectedMenu = obj.key
      return
    }

    this.selectedMenu = ''
  }

  /**
   * 获取其他子路由
   */
  getOtherSubRoutes() {
    return [
      {
        name: '新建',
        key: 'pipelineAdd',
        type: 'new',
        path: RouterUrls.PIPELINE.ADD_URL,
        belong: 'pipeline',
        // component: lazy(() => import(/* webpackChunkName:'pipelineAdd' */ '@pages/delivery/pipeline/add')),
        component: PipelineAdd
      },
      {
        name: '',
        key: 'pipelineDetail',
        type: 'detail',
        path: RouterUrls.PIPELINE.DETAIL_URL,
        belong: 'pipeline',
        component: PipelineDetail
      }
    ]
  }

  getMonition = () => {
    return {
      name: 'Monitor',
      children: [
        {
          name: 'Process',
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M197.01 502.2h74.84l47.26 71.48a39.096 39.096 0 0 0 36.53 17.47 39.287 39.287 0 0 0 32.64-23.98l59.55-141.67 65.73 150.04a39.327 39.327 0 0 0 36.05 23.61h1.11c16.04-0.57 30.17-10.72 35.82-25.74l52.19-140.8 27.31 64.8c6.13 14.63 20.46 24.14 36.32 24.12h134.16c10.45 0.01 20.47-4.14 27.85-11.52a39.297 39.297 0 0 0 11.51-27.84 39.302 39.302 0 0 0-11.52-27.82 39.321 39.321 0 0 0-27.84-11.51H728.51l-55.9-132.33c-6.31-14.82-21.02-24.32-37.13-23.98-16.16 0.37-30.45 10.56-36.05 25.7l-52.8 142.65-63.4-144.74a39.493 39.493 0 0 0-36.29-23.61c-15.75 0.11-29.93 9.58-36.05 24.08l-66.61 158.54-18.33-27.9a39.258 39.258 0 0 0-32.85-17.71h-96.01a39.368 39.368 0 0 0-27.86 11.51 39.321 39.321 0 0 0-11.54 27.82 39.353 39.353 0 0 0 11.51 27.89 39.464 39.464 0 0 0 27.88 11.58l-0.07-0.14z m748.33 256.29H78.86V128.82h866.48v629.67z m0-708.36H78.86C35.37 50.18 0.14 85.4 0.1 128.86v629.67c0.06 43.44 35.28 78.64 78.76 78.7h866.48c43.47-0.06 78.7-35.26 78.76-78.7V128.86c-0.04-43.46-35.27-78.68-78.76-78.73z m-719.6 859.95h576.89c17.7 0 32.05 14.34 32.05 32.02 0 17.69-14.35 32.02-32.05 32.02H225.74c-17.7 0-32.05-14.34-32.05-32.02 0-17.68 14.35-32.02 32.05-32.02z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          url: RouterUrls.PROCESS_URL,
          component: lazy(() => import(/* webpackChunkName:'process' */ '@pages/monitor/process'))
        },
        {
          name: 'Command',
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M355.400383 504.697687c-3.620457-8.68787-13.598716-12.794397-22.286586-9.17394L121.278157 583.816652c-13.857613 5.77554-14.017248 25.350364-0.255827 31.351032l211.390501 92.178399c8.627495 3.761674 18.671245-0.182149 22.432918-8.809643 3.761674-8.627495-0.182149-18.671245-8.809643-22.432918L171.282015 599.899956l174.944428-72.916706C354.914312 523.362792 359.02084 513.384533 355.400383 504.697687z"
                fill="currentColor"
              ></path>
              <path
                d="M921.386948 583.816652 709.551308 495.523747c-8.68787-3.620457-18.665105 0.48607-22.286586 9.17394-3.620457 8.68787 0.48607 18.665105 9.17394 22.286586l174.944428 72.916706-174.755116 76.202543c-8.627495 3.761674-12.571317 13.805424-8.809643 22.432918 3.761674 8.627495 13.805424 12.571317 22.432918 8.809643l211.390501-92.178399C935.403173 609.167017 935.24456 589.592192 921.386948 583.816652z"
                fill="currentColor"
              ></path>
              <path
                d="M571.71401 367.050724c-9.051143-2.579755-18.479887 2.666736-21.059642 11.718903l-119.67566 419.944398c-2.579755 9.051143 2.666736 18.48091 11.718903 21.059642s18.479887-2.666736 21.059642-11.718903l119.67566-419.944398C586.012667 379.059222 580.766177 369.630479 571.71401 367.050724z"
                fill="currentColor"
              ></path>
              <path
                d="M0.021489 0l0 1022.506996 1022.506996 0L1022.528486 204.501604l0-34.08326L1022.528486 0 0.021489 0zM34.104749 988.423737 34.104749 204.501604l17.042141 0 937.298336 0 0 783.922133L34.104749 988.423737zM988.445226 170.417321 51.14689 170.417321 34.104749 170.417321 34.104749 34.08326l954.339454 0L988.444203 170.417321z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          url: RouterUrls.COMMAND_URL,
          component: lazy(() => import(/* webpackChunkName:'command' */ '@pages/monitor/command'))
        },
        {
          name: 'Directory',
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.666667 42.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h896a42.666667 42.666667 0 0 1 42.666667 42.666667v938.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666667V42.666667z m85.333333 42.666666v853.333334h810.666667V85.333333H128z"
                fill="currentColor"
              ></path>
              <path
                d="M542.165333 225.834667a42.666667 42.666667 0 0 1 0 60.330666l-170.666666 170.666667a42.666667 42.666667 0 0 1-60.330667 0l-85.333333-85.333333a42.666667 42.666667 0 0 1 60.330666-60.330667L341.333333 366.336l140.501334-140.501333a42.666667 42.666667 0 0 1 60.330666 0zM853.333333 725.333333a42.666667 42.666667 0 0 1-42.666666 42.666667h-213.333334a42.666667 42.666667 0 1 1 0-85.333333h213.333334a42.666667 42.666667 0 0 1 42.666666 42.666666zM853.333333 384a42.666667 42.666667 0 0 1-42.666666 42.666667h-213.333334a42.666667 42.666667 0 1 1 0-85.333334h213.333334a42.666667 42.666667 0 0 1 42.666666 42.666667zM362.666667 640a64 64 0 1 0 0 128 64 64 0 0 0 0-128zM213.333333 704a149.333333 149.333333 0 1 1 298.666667 0 149.333333 149.333333 0 0 1-298.666667 0z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          url: RouterUrls.DIRECTORY_URL,
          component: lazy(() => import(/* webpackChunkName:'directory' */ '@pages/monitor/directory'))
        }
      ]
    }
  }

  getConfiguration() {
    return {
      name: 'Configuration',
      children: [
        {
          name: 'Nginx',
          icon: (
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M512 0L68.48 256v512L512 1024l443.52-256V256L512 0z m256 707.84c0 30.08-27.562667 55.04-65.237333 55.04-26.922667 0-57.642667-10.88-76.842667-34.56l-256-304.682667v284.16c0 30.762667-24.32 55.04-54.357333 55.04H312.32c-30.762667 0-55.04-25.6-55.04-55.04V316.16c0-30.08 26.88-55.04 64-55.04 27.562667 0 58.88 10.88 78.08 34.56l254.72 304.682667V316.16c0-30.762667 25.6-55.04 55.04-55.04h3.2c30.72 0 55.04 25.6 55.04 55.04v391.68H768z"
                fill="currentColor"
              ></path>
            </svg>
          ),
          url: RouterUrls.NGINX_URL,
          component: lazy(() => import('@pages/configuration/nginx'))
        }
      ]
    }
  }

  /**
   * 获取选中的菜单
   */
  @action
  getSelectedKeysByUrl() {
    const list = this.MENU_LIST || []
    if (list.length === 0) return []

    let { addressUrl } = ADDRESS.getAddress()
    console.log('addressUrl', addressUrl)

    // dashboard
    if (addressUrl === RouterUrls.DASHBOARD.URL || Utils.isBlank(addressUrl || '')) {
      this.selectedMenuKeys = [RouterUrls.DASHBOARD.KEY]
      return
    }

    // 如果有三层 /, 去掉最后一层
    if (addressUrl.endsWith('/')) {
      addressUrl = addressUrl.substring(0, addressUrl.length - 1)
    }

    let moreSplit = addressUrl.split('/').filter(Boolean).length > 2
    let path = addressUrl
    if (moreSplit) {
      path = addressUrl.substring(0, addressUrl.lastIndexOf('/'))
    }

    let obj = this.findMenu(this.MENU_LIST, '', path) || {}
    this.selectedMenuKeys.push(obj.key || '')
  }

  /**
   * 查找菜单
   */
  findMenu(list: Array<{ [K: string]: any }> = [], key: string = '', url: string = ''): { [K: string]: any } {
    if (list.length === 0) return {}

    for (const item of list) {
      if (item.key === key || (item.url === url && !Utils.isBlank(url || ''))) {
        return item || {}
      }

      const children = item.children || []
      if (children.length === 0) {
        continue
      }

      let obj = this.findMenu(children, key, url) || {}
      if (!Utils.isObjectNull(obj || {})) {
        return obj
      }
    }

    return {}
  }

  // 直接根据 url 查找
  getUrl(needParams: boolean = true) {
    let relativePath = this.getRelativePath(window.location.href || '')
    relativePath = relativePath.replace(RouterUrls.HOME_URL, '')
    if (!needParams) {
      let index = relativePath.indexOf('?')
      if (index !== -1) {
        relativePath = relativePath.substring(0, index)
      }
    }

    return relativePath
  }

  @action
  reset() {
    this.breadcrumbItems = []
  }

  @action
  onSetSelectMenu(key: string = '') {
    this.selectedMenu = key || ''
    Utils.setLocal(SYSTEM.LEFT_MENU_NAME, this.selectedMenu)
  }

  onGetSelectMenu() {
    this.selectedMenu = Utils.getLocal(SYSTEM.LEFT_MENU_NAME) || ''
  }

  /**
   * 获取面包屑
   */
  getBreadcrumbItemList(name: string = '', isNew: boolean = true) {
    let routes: Array<{ [K: string]: any }> = []

    routes.push({
      name: this.MENU_LIST[0].label || '',
      url: this.MENU_LIST[0].url || '',
      icon: this.MENU_LIST[0].icon || '',
      onClick: () => {
        this.selectedMenuKeys = [RouterUrls.DASHBOARD.KEY]
        this.selectedMenu = RouterUrls.DASHBOARD.KEY
      }
    }) // dashboard

    routes.push({
      name: this.MENU_LIST[2].label || '',
      url: this.MENU_LIST[2].url || '',
      icon: this.MENU_LIST[2].icon || ''
    }) // pipeline

    if (!isNew) {
      routes.push({
        name: name || '',
        type: 'detail'
      }) // 流水线详情
    } else {
      routes.push({
        name: this.getOtherSubRoutes()[0].name || '',
        type: 'new'
      }) // 新建流水线
    }

    return routes
  }

  /**
   * 重置数据
   */
  @action
  onReset() {
    this.selectedMenuKeys = []
    this.userInfo = {}
  }
}

export default new HomeStore()

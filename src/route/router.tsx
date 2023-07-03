/**
 * @fileOverview route
 * @date 2023-04-13
 * @author poohlaha
 */
import React from 'react'
import { RouteInterface } from '@router/router.interface'
import RouterUrls from '@route/router.url.toml'
const { lazy } = React
import Dashboard from '@pages/dashboard'

export const routes: RouteInterface[] = [
  {
    path: '/',
    exact: true,
    component: Dashboard,
    name: 'dashboard',
    auth: false,
    title: '首页'
  },
  {
    path: RouterUrls.HOME_URL,
    component: Dashboard,
    exact: true,
    name: 'home',
    title: '首页',
    auth: false
  },
]

/**
 * @fileOverview route
 * @date 2023-04-13
 * @author poohlaha
 */
import React from 'react'
import { RouteInterface } from '@router/router.interface'
import RouterUrls from '@route/router.url.toml'
const { lazy } = React

export const routes: RouteInterface[] = [
  {
    path: '*',
    exact: true,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/main/index')),
    auth: false,
    title: '首页',
  },
  {
    path: RouterUrls.MAIN_URL,
    exact: true,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/main/index')),
    auth: false,
    title: '首页',
  },
  {
    path: `${RouterUrls.HOME_URL}/*`,
    exact: false,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/home/index')),
    auth: false,
    title: '首页',
  },
  {
    path: RouterUrls.ARTICLE_URL,
    exact: false,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/article/index')),
    auth: false,
    title: '文章',
  },
  {
    path: RouterUrls.ARTICLE_EDIT_URL,
    exact: false,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/article/edit')),
    auth: false,
    title: '文章',
  },
  {
    path: RouterUrls.ARTICLE_DETAIL_URL,
    exact: false,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/article/detail')),
    auth: false,
    title: '文章',
  },
  {
    path: RouterUrls.ARTICLE_TAG_URL,
    exact: false,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/article/tag')),
    auth: false,
    title: '文章标签',
  },
]

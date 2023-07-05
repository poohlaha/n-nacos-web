/**
 * @fileOverview nginx store
 * @date 2023-07-04
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import BaseStore from '../base/base.store'
import {lazy} from 'react'
import RouterUrls from '@route/router.url.toml'
import React from 'react'

class NginxStore extends BaseStore {

}

export default new NginxStore()

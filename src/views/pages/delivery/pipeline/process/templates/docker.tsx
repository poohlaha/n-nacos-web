import { getSteps } from '@pages/delivery/pipeline/process/templates/common'
import { H5_VARIABLE_LIST } from '@pages/delivery/pipeline/process/templates/h5'
import DockerData from '../../../pipelineMarket/pipeline/docker.json'
import H5Data from '../../../pipelineMarket/pipeline/h5.json'
import Utils from '@utils/utils'

let H5_LOCAL_TEMPLATE = Utils.deepCopy(H5Data.common || [])
H5_LOCAL_TEMPLATE.splice(H5_LOCAL_TEMPLATE.length - 2, 2)

let H5_REMOTE_TEMPLATE = [...H5Data.remote, ...H5_LOCAL_TEMPLATE]
const DOCKER_H5_LOCAL_TEMPLATE = getSteps([
  ...H5_LOCAL_TEMPLATE,
  ...DockerData,
  H5Data.common[H5Data.common.length - 1],
])
const DOCKER_H5_REMOTE_TEMPLATE = getSteps([
  ...H5_REMOTE_TEMPLATE,
  ...DockerData,
  H5Data.common[H5Data.common.length - 1],
])

// 启动变量
const DOCKER_VARIABLE_LIST: Array<{ [K: string]: any }> = [
  ...H5_VARIABLE_LIST,
  {
    id: Utils.generateUUID(),
    order: 3,
    name: 'dockerImage',
    genre: 'input',
    value: '',
    disabled: 'no',
    require: 'no',
    desc: 'Docker Image',
  },
  {
    id: Utils.generateUUID(),
    order: 4,
    name: 'dockerVersion',
    genre: 'input',
    value: '',
    disabled: 'no',
    require: 'no',
    desc: 'Docker Version',
  },
]

export { DOCKER_H5_LOCAL_TEMPLATE, DOCKER_H5_REMOTE_TEMPLATE, DOCKER_VARIABLE_LIST }

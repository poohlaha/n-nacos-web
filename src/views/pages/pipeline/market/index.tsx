/**
 * @fileOverview 流水线插件市场
 * @date 2024-03-11
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Templates from './templates/template.json'
import { Drawer } from 'antd'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'

const PipelinePluginMarket = (): ReactElement => {
  const [open, setOpen] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null)

  /**
   * 获取单个模板
   */
  const getTemplateHtml = (title: string = '', desc: string = '', date: string = '', onClick?: Function) => {
    return (
      <div className="template-item cursor-pointer flex-direction-column" onClick={() => onClick?.()}>
        <div className="item-top flex">
          <div className="svg-box">
            <svg
              className="svg-icon"
              viewBox="0 0 48 48"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-246.000000, -179.000000)">
                  <g transform="translate(228.000000, 163.000000)">
                    <g transform="translate(18.000000, 16.000000)">
                      <circle cx="24" cy="24" r="24"></circle>
                      <g id="chajian" transform="translate(10.000000, 12.000000)" fillRule="nonzero">
                        <path
                          d="M25.4210786,0 C26.6221714,0 27.6,1.0095 27.6,2.25 L27.6,17.25 C27.6,18.4905 26.6221714,19.5 25.4210786,19.5 L16.3855286,19.5 L16.3855286,22.5 L19.6102929,22.5 C20.0114786,22.5 20.3367643,22.836 20.3367643,23.25 C20.3367643,23.664 20.0114786,24 19.6102929,24 L7.98970714,24 C7.58852143,24 7.26323571,23.664 7.26323571,23.25 C7.26323571,22.836 7.58852143,22.5 7.98970714,22.5 L11.2144714,22.5 L11.2144714,19.5 L2.17842857,19.5 C0.977828571,19.5 0,18.4905 0,17.25 L0,2.25 C0,1.0095 0.977828571,0 2.17892143,0 L25.4215714,0 L25.4210786,0 Z M26.14755,17.25 L26.14755,2.25 C26.14755,1.836 25.8222643,1.5 25.4210786,1.5 L2.17842857,1.5 C1.77773571,1.5 1.45195714,1.836 1.45195714,2.25 L1.45195714,17.25 C1.45195714,17.664 1.77724286,18 2.17842857,18 L25.4215714,18 C25.8222643,18 26.1480429,17.664 26.1480429,17.25 L26.14755,17.25 Z M15.3672857,16.8 L12.5865857,8.9295 L20.3466214,11.3555 L17.3771571,12.887 L20.4885643,15.876 L19.7773714,16.6545 L16.6664571,13.6655 L15.3672857,16.8 L15.3672857,16.8 Z M12.6600214,6.532 C12.28545,6.532 11.9823429,6.2215 11.9823429,5.8375 L11.9823429,4.0535 C11.9810305,3.87020686 12.0518173,3.69394916 12.1790207,3.56377603 C12.3062241,3.4336029 12.4793422,3.36026139 12.6600214,3.36 C13.0336071,3.36 13.3357286,3.67 13.3357286,4.0535 L13.3357286,5.8375 C13.3369088,6.02050055 13.2663806,6.1964811 13.1396601,6.32672597 C13.0129396,6.45697083 12.8404077,6.53081041 12.6600214,6.532 L12.6600214,6.532 Z M10.8886929,6.9005 C10.8886929,7.085 10.8177214,7.2615 10.6905643,7.3905 C10.4254071,7.6605 9.99908571,7.6605 9.73392857,7.3905 L8.50277143,6.1295 C8.37583936,5.99895572 8.30481648,5.82286806 8.30513464,5.6395 C8.30513464,5.4555 8.37610714,5.2795 8.50277143,5.1495 C8.62894461,5.01950255 8.80125709,4.94630063 8.98108929,4.94630063 C9.16092148,4.94630063 9.33323396,5.01950255 9.45940714,5.1495 L10.6905643,6.4105 C10.8177214,6.54 10.8886929,6.7165 10.8886929,6.9005 L10.8886929,6.9005 Z M14.38305,6.148 L15.6142071,4.888 C15.7402289,4.75790637 15.912485,4.68462879 16.0922786,4.68462879 C16.2720722,4.68462879 16.4443282,4.75790637 16.57035,4.888 C16.6970143,5.017 16.7684786,5.1935 16.7684786,5.378 C16.7684786,5.562 16.6970143,5.739 16.57035,5.868 L15.3411643,7.1295 C15.0765,7.3995 14.6472214,7.3995 14.3835429,7.1295 C14.2567173,6.99868093 14.1857245,6.82248823 14.1859068,6.639 C14.1859068,6.4545 14.2568786,6.278 14.38305,6.148 L14.38305,6.148 Z M10.0666159,9.26 C10.0675245,9.44300009 9.99674503,9.6188744 9.86984001,9.74893139 C9.74293498,9.87898838 9.57030011,9.95257409 9.38991429,9.9535 L7.64963571,9.9525 C7.27506429,9.9525 6.97245,9.6425 6.97245,9.259 C6.97245,8.876 7.27457143,8.566 7.64963571,8.566 L9.38991429,8.566 C9.76399286,8.566 10.0666159,8.876 10.0666159,9.26 L10.0666159,9.26 Z M11.16075,10.98 C11.2874143,11.11 11.3588786,11.286 11.3593714,11.47 C11.3593714,11.654 11.2884,11.83 11.1617357,11.96 L9.93057857,13.22 C9.80442386,13.3498425 9.63221757,13.4229456 9.45250714,13.4229456 C9.27279672,13.4229456 9.10059043,13.3498425 8.97443571,13.22 C8.84705156,13.0896792 8.7756503,12.9135319 8.775814,12.73 C8.775814,12.546 8.84727857,12.3695 8.97394286,12.24 L10.2036214,10.9785 C10.330077,10.8486108 10.5026446,10.7756699 10.6825988,10.7760445 C10.8625529,10.776422 11.0348229,10.8500834 11.16075,10.9805 L11.16075,10.98 Z"
                          id="形状"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          <div className="item-top-right flex-1">
            <p className="over-two-ellipsis title">{title || ''}</p>
            <div className="desc flex">
              <p>自定义插件</p>
              <p className="spec">|</p>
              <p>构建</p>
            </div>
          </div>
        </div>
        <div className="item-desc over-two-ellipsis flex-1">{desc || ''}</div>
        <div className="item-footer flex-jsc-between">
          <div className="item-footer-left flex-align-center">
            <div className="svg-box flex-align-center">
              <svg
                className="svg-icon"
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="calendar"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path>
              </svg>
            </div>
            <p>{date}</p>
          </div>

          <div className="item-footer-right">
            <div className="button tag-orange">发布</div>
          </div>
        </div>
      </div>
    )
  }

  const render = () => {
    // @ts-ignore
    let prism = window['Prism']
    let language = prism.languages['json']
    const html = prism.highlight(JSON.stringify(selectedPlugin || '', null, 2), language, 'json')
    return (
      <Page className="pipeline-plugin-market-page overflow-y-auto">
        {/* title */}
        <div className="page-title flex-align-center">
          <p className="flex-1 font-bold text-xl">{RouterUrls.PIPELINE.MARKET.NAME}</p>
        </div>

        {/* form */}
        <div className="form"></div>

        {/* list */}
        <div className="plugin-list w100 page-margin-top grid gap-4 auto-rows-auto mt-4 lg:grid-cols-2 xl:grid-cols-4 pb-6">
          {Templates.map((template: { [K: string]: any }, index: number) => {
            return (
              <div key={template.key || `${index}`} className="plugin-item mb-5">
                {getTemplateHtml(template.label || '', template.desc || '', template.date, () => {
                  setOpen(true)
                  setSelectedPlugin(template)
                })}
              </div>
            )
          })}
        </div>

        <Drawer
          title={selectedPlugin?.title || ''}
          width={500}
          onClose={() => {
            setOpen(false)
            setSelectedPlugin(null)
          }}
          open={open}
        >
          <pre>
            <code className="file-detail language-json" dangerouslySetInnerHTML={{ __html: html || '' }} />
          </pre>
        </Drawer>
      </Page>
    )
  }

  return render()
}

export default observer(PipelinePluginMarket)

/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Navigation from '@pages/home/navigation'
import { Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'

const WritingList = (): ReactElement => {
  const navigate = useNavigate()

  const getNavigationRightNode = () => {
    return (
      <Tooltip title="写作">
        <div
          className="page-margin-right writing-button flex-align-center cursor-pointer"
          onClick={() => navigate(RouterUrls.WRITING_EDIT_URL)}
        >
          <div className="svg-box">
            <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M151.007153 942.267769C128.013885 963.528445 86.413281 1006.950675 107.626494 906.756096 144.844165 743.232334 555.501811 114.238761 901.629542 53.894737 998.682268 53.894737 721.170389 286.205673 721.170389 286.205673 721.170389 286.205673 816.508427 298.051442 879.132672 231.909329 841.59972 427.727174 664.222569 427.0579 618.413525 442.637841 672.003196 450.52789 711.854231 474.231682 794.792518 450.006262 774.570232 505.525339 694.717246 573.845623 407.617084 641.459852 280.697363 687.077058 174.00042 921.007099 151.007153 942.267769Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </Tooltip>
    )
  }

  const render = () => {
    return (
      <div className="writing-list-page flex-direction-column wh100">
        <Navigation rightNode={getNavigationRightNode()} />

        <div className="writing-box flex wh100">
          <div className="box-wrapper flex overflow-y-auto w100">
            <div className="box-left flex-1">
              <div className="content-item">
                <div className="content-info">
                  <p className="item-title font-bold over-two-ellipsis">Dart学习笔记（一）</p>
                </div>
              </div>
            </div>

            <div className="box-right">
              {/* 网站信息 */}
              <div className="info-list list-item">
                <div className="list-item-title new-list-title flex-align-center">
                  <div className="svg-box">
                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M879.09434 57.962264H144.90566a77.283019 77.283019 0 0 0-77.283018 77.283019v618.264151a77.283019 77.283019 0 0 0 77.283018 77.283019h734.18868a77.283019 77.283019 0 0 0 77.283018-77.283019V135.245283a77.283019 77.283019 0 0 0-77.283018-77.283019z m38.641509 689.461132C917.735849 782.799698 908.230038 792.150943 872.660528 792.150943H151.339472C115.769962 792.150943 106.264151 782.799698 106.264151 747.423396V141.312C106.264151 105.955019 115.769962 96.603774 151.339472 96.603774h721.321056C908.230038 96.603774 917.735849 105.955019 917.735849 141.312v606.111396zM86.943396 927.396226h850.113208a19.320755 19.320755 0 0 1 0 38.64151H86.943396a19.320755 19.320755 0 0 1 0-38.64151z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M569.962264 231.849057h251.169811a19.320755 19.320755 0 0 1 0 38.641509H569.962264a19.320755 19.320755 0 0 1 0-38.641509zM569.962264 347.773585h251.169811a19.320755 19.320755 0 0 1 0 38.641509H569.962264a19.320755 19.320755 0 0 1 0-38.641509zM569.962264 463.698113h251.169811a19.320755 19.320755 0 0 1 0 38.64151H569.962264a19.320755 19.320755 0 0 1 0-38.64151zM222.188679 579.622642h598.943396a19.320755 19.320755 0 0 1 0 38.641509H222.188679a19.320755 19.320755 0 0 1 0-38.641509zM434.716981 231.849057H241.509434a38.641509 38.641509 0 0 0-38.641509 38.641509v193.207547a38.641509 38.641509 0 0 0 38.641509 38.64151h193.207547a38.641509 38.641509 0 0 0 38.64151-38.64151V270.490566a38.641509 38.641509 0 0 0-38.64151-38.641509z m0 212.528301a19.320755 19.320755 0 0 1-19.320755 19.320755h-154.566037a19.320755 19.320755 0 0 1-19.320755-19.320755v-154.566037a19.320755 19.320755 0 0 1 19.320755-19.320755h154.566037a19.320755 19.320755 0 0 1 19.320755 19.320755v154.566037zM492.679245 830.792453h38.64151v96.603773h-38.64151z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <p>网站信息</p>
                </div>

                <div className="list-item-content">
                  <div className="item-content">
                    <div className="page-margin-bottom item flex-align-center flex-jsc-between">
                      <p>文章数目:</p>
                      <p>999</p>
                    </div>

                    <div className="page-margin-bottom item flex-align-center flex-jsc-between">
                      <p>最后更新时间:</p>
                      <p>2024-09-11</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最新文章 */}
              <div className="new-list list-item page-margin-top">
                <div className="list-item-title new-list-title flex-align-center">
                  <div className="svg-box">
                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M512.736 992a483.648 483.648 0 0 1-164.672-28.8 36.88 36.88 0 1 1 25.104-69.36 407.456 407.456 0 1 0-184.608-136.512A36.912 36.912 0 0 1 129.488 801.6a473.424 473.424 0 0 1-97.472-290A480 480 0 1 1 512.736 992z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M685.6 638.592a32 32 0 0 1-14.032-2.96l-178.048-73.888a36.8 36.8 0 0 1-22.912-34.016V236.672a36.944 36.944 0 1 1 73.888 0v266.72l155.2 64.272a36.336 36.336 0 0 1 19.952 48 37.616 37.616 0 0 1-34.048 22.928z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <p>最新文章</p>
                </div>

                <div className="list-item-content"></div>
              </div>

              {/* 分类 */}
              <div className="feilei-list list-item page-margin-top">
                <div className="list-item-title new-list-title flex-align-center">
                  <div className="svg-box">
                    <svg className="svg—icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M855.04 385.024q19.456 2.048 38.912 10.24t33.792 23.04 21.504 37.376 2.048 54.272q-2.048 8.192-8.192 40.448t-14.336 74.24-18.432 86.528-19.456 76.288q-5.12 18.432-14.848 37.888t-25.088 35.328-36.864 26.112-51.2 10.24l-567.296 0q-21.504 0-44.544-9.216t-42.496-26.112-31.744-40.96-12.288-53.76l0-439.296q0-62.464 33.792-97.792t95.232-35.328l503.808 0q22.528 0 46.592 8.704t43.52 24.064 31.744 35.84 12.288 44.032l0 11.264-53.248 0q-40.96 0-95.744-0.512t-116.736-0.512-115.712-0.512-92.672-0.512l-47.104 0q-26.624 0-41.472 16.896t-23.04 44.544q-8.192 29.696-18.432 62.976t-18.432 61.952q-10.24 33.792-20.48 65.536-2.048 8.192-2.048 13.312 0 17.408 11.776 29.184t29.184 11.776q31.744 0 43.008-39.936l54.272-198.656q133.12 1.024 243.712 1.024l286.72 0z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <p>分类</p>
                </div>

                <div className="list-item-content"></div>
              </div>

              {/* 标签 */}
              <div className="tag-list list-item page-margin-top">
                <div className="list-item-title new-list-title flex-align-center">
                  <div className="svg-box">
                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M867.126867 516.953333l-416-416A52.986667 52.986667 0 0 0 413.413533 85.333333H53.333533a53.393333 53.393333 0 0 0-53.333333 53.333334v360.08a52.986667 52.986667 0 0 0 15.62 37.713333l416 416a53.333333 53.333333 0 0 0 75.426667 0l360.08-360.08a53.4 53.4 0 0 0 0-75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 1-85.333333-85.333333 85.426667 85.426667 0 0 1 85.333333 85.333333z m653.793334 251.046667l-382.706667 382.706667a21.333333 21.333333 0 0 1-30.173333-30.173334l382.706666-382.706666a10.666667 10.666667 0 0 0 0-15.08L539.5802 121.753333a21.333333 21.333333 0 0 1 30.173333-30.173333l425.373334 425.373333a53.4 53.4 0 0 1 0 75.426667z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <p>标签</p>
                </div>

                <div className="list-item-content"></div>
              </div>

              {/* 归档 */}
              <div className="guidang-list list-item page-margin-top">
                <div className="list-item-title new-list-title flex-align-center">
                  <div className="svg-box">
                    <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M143 398v415h737V398H143z m-80-48c0-17.673 14.327-32 32-32h833c17.673 0 32 14.327 32 32v511c0 17.673-14.327 32-32 32H95c-17.673 0-32-14.327-32-32V350z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M296.657 581.044a8 8 0 0 1 0-11.314l45.255-45.255a8 8 0 0 1 11.313 0l125.158 125.158 195.162-195.162a8 8 0 0 1 11.313 0l45.255 45.255a8 8 0 0 1 0 11.314L489.697 751.456c-6.248 6.249-16.379 6.249-22.627 0L296.657 581.044zM225 199a8 8 0 0 1 8-8h560a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H233a8 8 0 0 1-8-8v-56zM352 72a8 8 0 0 1 8-8h303a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H360a8 8 0 0 1-8-8V72z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <p>归档</p>
                </div>

                <div className="list-item-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return render()
}

export default observer(WritingList)

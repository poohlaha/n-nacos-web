/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Tag, Tooltip, Pagination, Popover } from 'antd'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import Loading from '@views/components/loading/loading'
import Utils from '@utils/utils'
import Markdown from 'markdown-to-jsx'
import { SyntaxHighlightedCode } from '@views/components/page/type'
import Page from '@views/components/page'

const ArticleList = (): ReactElement => {
  const { articleStore } = useStore()
  const navigate = useNavigate()

  useMount(async () => {
    await articleStore.getList()
  })

  const getNavigationRightNode = () => {
    return (
      <Tooltip title="写作">
        <div
          className="page-margin-right article-button flex-align-center cursor-pointer"
          onClick={() => navigate(RouterUrls.ARTICLE_EDIT_URL)}
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

  const tagColorList: Array<string> = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
    'error',
    'success',
    'warning',
    'processing',
  ]

  const getCardContent = (content: string = '') => {
    return (
      <div className="markdown-body preview-markdown-body">
        <Markdown
          children={content || ''}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    )
  }

  const render = () => {
    let list = articleStore.info?.list || []
    let archiveList = articleStore.info?.archiveList || []
    if (archiveList.length > 0) {
      archiveList = archiveList.slice(0, 7)
    }

    let tagList = articleStore.info?.tagList || []
    let tagClassifyList = articleStore.info?.tagClassifyList || []
    if (tagClassifyList.length > 0) {
      tagClassifyList = tagClassifyList.slice(0, 10)
    }
    let newDate = articleStore.new?.createTime || ''
    if (!Utils.isBlank(newDate || '')) {
      newDate = new Date(newDate.replace(/-/g, '/'))
    }

    let listCount = articleStore.info?.listCount || 0
    return (
      <Page
        className="article-list-page"
        pageBodyNeedPadding={false}
        navigationProps={{
          rightNode: getNavigationRightNode(),
        }}
      >
        {!articleStore.loading && (
          <div className="article-content flex w100 center overflow-y-auto">
            <div className="box-left flex-1 flex-direction-column">
              <div className="flex-1 flex-direction-column">
                {list.length > 0 &&
                  list.map((item: { [K: string]: any } = {}, index: number) => {
                    let tags = item.tags || []
                    return (
                      <div className={`content-item ${index !== 0 ? 'page-margin-top' : ''}`} key={item.id || index}>
                        <div className="content-info flex-direction-column h100 flex-jsc-between">
                          <div className="flex-direction-column">
                            <p
                              className="item-title font-bold over-two-ellipsis cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `${RouterUrls.ARTICLE_DETAIL_URL}?id=${Utils.encrypt(
                                    encodeURIComponent(item.id || '')
                                  )}`
                                )
                              }}
                            >
                              {item.title || ''}
                            </p>

                            <div className="item-desc flex-align-center">
                              <svg
                                className="svg-icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M667.648 85.333333L853.333333 256v597.589333A85.12 85.12 0 0 1 768.256 938.666667H255.744A85.205333 85.205333 0 0 1 170.666667 853.76V170.24C170.666667 123.392 208.853333 85.333333 256.085333 85.333333h411.562667zM597.333333 170.666667H256v682.666666h512V341.333333h-149.333333a21.504 21.504 0 0 1-21.333334-21.674666V170.666667z m42.794667 512c21.802667 0 39.808 16.341333 42.24 37.674666L682.666667 725.333333c0 23.552-19.328 42.666667-42.538667 42.666667H383.872A42.496 42.496 0 0 1 341.333333 725.333333c0-23.552 19.328-42.666667 42.538667-42.666666h256.256z m0-170.666667c21.802667 0 39.808 16.341333 42.24 37.674667L682.666667 554.666667c0 23.552-19.328 42.666667-42.538667 42.666666H383.872A42.496 42.496 0 0 1 341.333333 554.666667c0-23.552 19.328-42.666667 42.538667-42.666667h256.256zM469.333333 341.333333a42.666667 42.666667 0 0 1 0 85.333334H384a42.666667 42.666667 0 1 1 0-85.333334h85.333333z m213.333334-135.850666V256h61.952L682.666667 205.482667z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                              <div className="desc flex-align-center">
                                <p>发表于</p>
                                <p>{item.createTime || ''}</p>
                                {!Utils.isBlank(item.updateTime || '') && <span className="spec">|</span>}

                                {!Utils.isBlank(item.updateTime || '') && (
                                  <div className="update flex-align-center">
                                    <p>更新于</p>
                                    <p>{item.updateTime || '-'}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {tags.length > 0 && (
                              <div className="item-desc flex-align-center">
                                {tags.map((t: string = '') => {
                                  return (
                                    <div className="flex-wrap" key={t}>
                                      <Tag>{t || ''}</Tag>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          <Popover
                            overlayClassName="card-item-popover"
                            placement="right"
                            content={getCardContent(item.content || '')}
                            title={item.title || ''}
                            trigger="hover"
                          >
                            <div
                              className="item-content over-three-ellipsis"
                              dangerouslySetInnerHTML={{ __html: item.content || '' }}
                            ></div>
                          </Popover>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {listCount > articleStore.articlePageSize && (
                <div className="pagination flex-center page-margin-top">
                  <Pagination
                    current={articleStore.currentPage}
                    total={listCount}
                    pageSize={articleStore.articlePageSize}
                    onChange={async (page: number, pageSize: number) => {
                      articleStore.currentPage = articleStore.articlePageSize !== pageSize ? 1 : page
                      // articleStore.pageSize = pageSize
                      await articleStore.getList()
                    }}
                  />
                </div>
              )}
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
                      <p>{listCount || '-'}</p>
                    </div>

                    <div className="page-margin-bottom item flex-align-center flex-jsc-between">
                      <p>最后更新时间:</p>
                      <p>{Utils.formatDateStr(newDate || '') || '-'}</p>
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

                <div className="list-item-content">
                  <div className="new-list item-content">
                    {articleStore.newList.length > 0 &&
                      articleStore.newList.map((item: { [K: string]: any } = {}, index: number) => {
                        return (
                          <div
                            className="content-list-item over-two-ellipsis"
                            key={item.id || index}
                            onClick={() => {
                              navigate(
                                `${RouterUrls.ARTICLE_DETAIL_URL}?id=${Utils.encrypt(
                                  encodeURIComponent(item.id || '')
                                )}`
                              )
                            }}
                          >
                            {item.title || ''}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* 分类 */}
              {tagClassifyList.length > 0 && (
                <div className="feilei-list list-item page-margin-top">
                  <div className="list-item-title new-list-title flex-jsc-between">
                    <div className="flex-align-center list-item-title-left flex-1">
                      <div className="svg-box flex-center">
                        <svg
                          className="svg—icon wh100"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M855.04 385.024q19.456 2.048 38.912 10.24t33.792 23.04 21.504 37.376 2.048 54.272q-2.048 8.192-8.192 40.448t-14.336 74.24-18.432 86.528-19.456 76.288q-5.12 18.432-14.848 37.888t-25.088 35.328-36.864 26.112-51.2 10.24l-567.296 0q-21.504 0-44.544-9.216t-42.496-26.112-31.744-40.96-12.288-53.76l0-439.296q0-62.464 33.792-97.792t95.232-35.328l503.808 0q22.528 0 46.592 8.704t43.52 24.064 31.744 35.84 12.288 44.032l0 11.264-53.248 0q-40.96 0-95.744-0.512t-116.736-0.512-115.712-0.512-92.672-0.512l-47.104 0q-26.624 0-41.472 16.896t-23.04 44.544q-8.192 29.696-18.432 62.976t-18.432 61.952q-10.24 33.792-20.48 65.536-2.048 8.192-2.048 13.312 0 17.408 11.776 29.184t29.184 11.776q31.744 0 43.008-39.936l54.272-198.656q133.12 1.024 243.712 1.024l286.72 0z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>

                      <p>分类</p>
                    </div>

                    <div className="list-item-title-right">
                      <div
                        className="svg-box arrow-svg cursor-pointer"
                        onClick={() => navigate(RouterUrls.ARTICLE_TAG_URL)}
                      >
                        <svg
                          className="svg-icon wh100"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M236.552013 926.853955a55.805997 55.805997 0 0 0 0 80.454996 59.682997 59.682997 0 0 0 82.794996 0l468.099978-455.081978a55.805997 55.805997 0 0 0 0-80.453996L319.348009 16.689999a59.682997 59.682997 0 0 0-82.794996 0 55.805997 55.805997 0 0 0 0 80.454996L663.401993 511.999975 236.624013 926.853955z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="list-item-content">
                    <div className="item-content">
                      {tagClassifyList.map((item: { [K: string]: any } = {}, index: number) => {
                        return (
                          <div
                            className="content-list-item flex-jsc-between"
                            key={item.id || index}
                            onClick={() => {
                              navigate(
                                `${RouterUrls.ARTICLE_TAG_DETAIL_URL}?id=${Utils.encrypt(
                                  encodeURIComponent(item.id || '')
                                )}&name=${Utils.encrypt(encodeURIComponent(item.tagName || ''))}&title=${Utils.encrypt(
                                  encodeURIComponent('分类')
                                )}`
                              )
                            }}
                          >
                            <p>{item.tagName || ''}</p>
                            <p>{item.articleCount || 0}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 标签 */}
              {tagList.length > 0 && (
                <div className="tag-list list-item page-margin-top">
                  <div className="list-item-title new-list-title flex-align-center">
                    <div className="svg-box">
                      <svg
                        className="svg-icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M867.126867 516.953333l-416-416A52.986667 52.986667 0 0 0 413.413533 85.333333H53.333533a53.393333 53.393333 0 0 0-53.333333 53.333334v360.08a52.986667 52.986667 0 0 0 15.62 37.713333l416 416a53.333333 53.333333 0 0 0 75.426667 0l360.08-360.08a53.4 53.4 0 0 0 0-75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 1-85.333333-85.333333 85.426667 85.426667 0 0 1 85.333333 85.333333z m653.793334 251.046667l-382.706667 382.706667a21.333333 21.333333 0 0 1-30.173333-30.173334l382.706666-382.706666a10.666667 10.666667 0 0 0 0-15.08L539.5802 121.753333a21.333333 21.333333 0 0 1 30.173333-30.173333l425.373334 425.373333a53.4 53.4 0 0 1 0 75.426667z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>

                    <p>标签</p>
                  </div>

                  <div className="list-item-content">
                    <div className="item-content flex-wrap">
                      {tagList.map((item: { [K: string]: any } = {}, index: number) => {
                        const tagIndex = Math.floor(Math.random() * tagColorList.length)
                        return (
                          <div
                            className="tag-list-item cursor-pointer"
                            key={item.id || index}
                            onClick={() => {
                              navigate(
                                `${RouterUrls.ARTICLE_TAG_DETAIL_URL}?id=${Utils.encrypt(
                                  encodeURIComponent(item.id || '')
                                )}&name=${Utils.encrypt(encodeURIComponent(item.name || ''))}&title=${Utils.encrypt(
                                  encodeURIComponent('标签')
                                )}`
                              )
                            }}
                          >
                            <Tag color={tagColorList[tagIndex]}>{item.name || ''}</Tag>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 归档 */}
              {archiveList.length > 0 && (
                <div className="guidang-list list-item page-margin-top">
                  <div className="list-item-title new-list-title flex-align-center">
                    <div className="svg-box">
                      <svg
                        className="svg-icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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

                  <div className="list-item-content">
                    <div className="item-content">
                      {archiveList.map((item: { [K: string]: any } = {}, index: number) => {
                        return (
                          <div
                            className="content-list-item flex-jsc-between"
                            key={item.id || index}
                            onClick={() => {
                              navigate(
                                `${RouterUrls.ARTICLE_TAG_DETAIL_URL}?monthName=${Utils.encrypt(
                                  encodeURIComponent(item.monthName || '')
                                )}&yearName=${Utils.encrypt(
                                  encodeURIComponent(item.yearName || '')
                                )}&title=${Utils.encrypt(encodeURIComponent('文章总览'))}`
                              )
                            }}
                          >
                            <div className="archive-item flex-align-center">
                              <p>{item.monthName || ''}</p>
                              <p>{item.yearName || ''}</p>
                            </div>
                            <p>{item.articleCount || 0}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Loading show={articleStore.loading} />
      </Page>
    )
  }

  return render()
}

export default observer(ArticleList)

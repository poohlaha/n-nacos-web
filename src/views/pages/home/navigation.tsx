/**
 * 上部 Navigation
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import AvatarImg from '@assets/images/navigation/avatar.jpeg'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'

interface INavigationProps {
  rightNode?: React.ReactNode
  leftNode?: React.ReactNode
  needLogo?: boolean
  needBack?: boolean
  onBack?: () => void
}

const Navigation: React.FC<INavigationProps> = (props: INavigationProps): ReactElement => {
  const navigate = useNavigate()

  const render = () => {
    let needLogo = props.needLogo
    if (needLogo === null || needLogo === undefined) {
      needLogo = true
    }

    let needBack = props.needBack
    if (needBack === null || needBack === undefined) {
      needBack = false
    }

    return (
      <div className="navigation flex">
        <div className="navigation-left flex-1 flex-align-center">
          {needLogo && (
            <div className="flex-align-center logo-box">
              <div
                className="svg-box cursor-pointer"
                onClick={() => {
                  navigate(RouterUrls.MAIN_URL)
                }}
              >
                <svg
                  className="svg-icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="128"
                  height="128"
                >
                  <path
                    d="M512 16C785.92 16 1008 238.08 1008 512c0 273.92-222.08 496-496 496C238.08 1008 16 785.92 16 512 16 238.08 238.08 16 512 16z m-68.384 291.392H292.032v408.32h151.584V506.24l143.232 209.408h155.904V307.36h-150.4v212.128l-148.736-212.096z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="logo flex-align-center">n-nacos</div>
            </div>
          )}

          {needBack && (
            <div
              className="back-button flex-align-center cursor-pointer"
              onClick={() => {
                let onBack = props.onBack
                if (onBack) {
                  props.onBack?.()
                } else {
                  window.history.go(-1)
                }
              }}
            >
              <div className="svg-box">
                <svg className="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M324.211517 511.805631 787.889594 73.082583c16.19422-16.630365 16.19422-43.974704 0-60.605068-16.19422-16.630365-42.495607-16.630365-58.613976 0L235.750113 479.360302c-8.647031 8.969398-12.344775 20.934917-11.719003 32.445329-0.644735 11.90863 3.071972 23.874149 11.719003 32.824585l493.506542 466.882788c16.118369 16.649327 42.438718 16.649327 58.613976 0 16.19422-17.085471 16.19422-43.974704 0-60.605068L324.211517 511.805631"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <p>返回</p>
            </div>
          )}

          {props.leftNode}
        </div>
        <div className="navigation-right flex-align-center">
          {props.rightNode}
          <div className="avatar flex-center">
            <img src={AvatarImg} alt="" />
          </div>
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Navigation)

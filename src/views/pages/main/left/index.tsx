/**
 * @fileOverview Left
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import { Dropdown, Menu, MenuProps } from 'antd'
import { useNavigate } from 'react-router'
import AvatarImg from '@assets/images/avatar.jpeg'
import Utils from '@utils/utils'

interface ILeftProps {
  userName: string
  onHome: () => void
  onUpdatePwd: () => void
  onLogout: () => void
}

const Left = (props: ILeftProps): ReactElement => {
  const { homeStore } = useStore()
  const navigate = useNavigate()

  // 递归生成子菜单
  const generateMenuItems = (menuList: Array<{ [K: string]: any }> = [], parentPath: string = ''): Array<any> => {
    return menuList.map((menu: { [K: string]: any } = {}) => {
      let fullPath = parentPath + (menu.url || '')
      if (menu.children) {
        return {
          key: menu.key || '',
          fullPath,
          label: menu.label,
          icon: menu.icon,
          type: menu.type || '',
          children: generateMenuItems(menu.children, fullPath)
        }
      }

      return {
        key: menu.key || '',
        fullPath,
        label: menu.label,
        icon: menu.icon,
        type: menu.type || ''
      }
    })
  }

  const getMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: Utils.generateUUID(),
        label: <p onClick={props.onUpdatePwd}>修改密码</p>
      },
      {
        key: Utils.generateUUID(),
        label: <p onClick={props.onLogout}>退出登录</p>
      }
    ]
  }

  const render = () => {
    const list = generateMenuItems(homeStore.MENU_LIST || [])
    return (
      <div className="left w-64 min-w-64 border-right flex-direction-column">
        {/* LOGO */}
        <div className="navigation-left flex-align-center p-4" onClick={props.onHome}>
          <div className="svg-box cursor-pointer w-6 h-6">
            <svg
              className="svg-icon theme wh100 !w-6 !h-6"
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
          <p className="text-base font-bold ml-2 cursor-pointer">nacos</p>
        </div>

        <div className="menus w100 flex-1 pt-4 pb-4 overflow-y-auto">
          <Menu
            className="wh100 m-ant-menu"
            onClick={(e: any) => {
              let obj = homeStore.findMenu(list, e.key)
              if (Utils.isObjectNull(obj || {})) {
                return
              }

              navigate(obj.fullPath || '')
            }}
            items={generateMenuItems(list)}
            mode="inline"
            selectedKeys={homeStore.selectedMenuKeys}
            onSelect={({ selectedKeys }) => (homeStore.selectedMenuKeys = selectedKeys || [])}
          />
        </div>

        <div className="person-info p-4 border-top flex-align-center">
          <Dropdown menu={{ items: getMenuItems() }} placement="bottom" trigger={['click']} arrow>
            <div className="avatar flex-align-center relative cursor-pointer">
              <img src={AvatarImg} alt="" className="h-10 w-10 rounded-full" />
            </div>
          </Dropdown>

          {!Utils.isBlank(props.userName || '') && (
            <p className="cursor-pointer text-sm ml-2">{props.userName || ''}</p>
          )}
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Left)

/**
 * @fileOverview no chat for left
 * @date 2023-04-14
 * @author poohlaha
 */
import React, { ReactElement } from 'react'

interface INoChatProps {
  show: boolean
}

const NoData: React.FC<INoChatProps> = (props: INoChatProps): ReactElement | null => {
  const render = () => {
    if (!props.show) return null

    return (
      <div className="no-data flex-center flex-direction-column">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="svg-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18ZM7.416 14H4v5h16v-5h-3.416a5.001 5.001 0 0 1-9.168 0ZM20 5H4v7h5a3 3 0 1 0 6 0h5V5Z"
          />
        </svg>
        <p>暂无数据</p>
      </div>
    )
  }

  return render()
}

export default NoData

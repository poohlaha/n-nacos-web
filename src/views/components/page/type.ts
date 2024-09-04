import React from 'react'

export interface INavigationProps {
  rightNode?: React.ReactNode
  leftNode?: React.ReactNode
  needLogo?: boolean
  needBack?: boolean
  onBack?: () => void
}

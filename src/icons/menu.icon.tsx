import * as React from 'react'

export declare type MenuIconProps = {
  className?: string
}

const MenuIcon = ({ className }: MenuIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 96 960 960"
  >
    <path
      className={className}
      d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"
    />
  </svg>
)

export default MenuIcon

import React, { ReactElement, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Open_Sans, Roboto } from 'next/font/google'
import styles from './dropdown.module.css'

import classNames from 'classnames'

export declare type Option = {
  label: string
  value: string
  callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  active: boolean
}

export declare type SelectProps = {
  title: string
  options: Option[]
  onShow?: () => void
}

const opensans = Open_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export const Select = ({ title, options, onShow }: SelectProps) => {
  const showRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const onMouseDown = (ev: MouseEvent) => {
    if (!show) return
    if (
      popupRef.current &&
      !popupRef.current.contains(ev.target as Node) &&
      !showRef.current?.contains(ev.target as Node)
    ) {
      setShow(false)
    }
  }

  useEffect(() => {
    if (!popupRef.current) {
      document.removeEventListener('mousedown', onMouseDown)
      return
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [popupRef, onMouseDown])

  const [show, setShow] = useState(false)

  return (
    <div className={styles.container}>
      <button
        ref={showRef}
        onClick={() => {
          setShow(!show)
          onShow?.()
        }}
        className={classNames(styles.show, roboto.className, {
          [styles.active]: show,
        })}
        title={title}
        type="button"
      >
        {options.find(option => option.active)?.label ?? ' '}
        <Image className={styles.image} src="/icons/arrow_down.svg" alt="Dropdown" width={8} height={8} />
      </button>
      <div ref={popupRef} className={classNames(styles.popup, { [styles.hide]: !show })}>
        <div className={styles.buttons}>
          {options.map((option, index) => (
            <button
              onClick={
                show
                  ? event => {
                      option.callback(event)
                      setShow(false)
                    }
                  : undefined
              }
              className={classNames(styles.option, roboto.className, {
                [styles.active]: option.active,
              })}
              title={option.label}
              key={index}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Select

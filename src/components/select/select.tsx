import React, { ReactElement, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './select.module.css'

import classNames from 'classnames'

export declare type Header = {
  title: string
  iconSrc: string
  iconAlt: string
}

export declare type Option = {
  title: string
  element: ReactElement | string
  callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  active: boolean
}

export declare type SelectProps = {
  header: Header
  options: Option[]
  onShow?: () => void
}

export const Select = ({ header, options, onShow }: SelectProps) => {
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
        className={classNames(styles.show, {
          [styles.active]: show,
        })}
        title={header.title}
      >
        <Image src={header.iconSrc} alt={header.iconAlt} width={20} height={20} />
        <Image
          style={{
            marginLeft: '0.2rem',
            transform: show ? 'rotate(-180deg)' : '',
            transition: 'transform 0.1s',
          }}
          src="/icons/arrow_down.svg"
          alt="Dropdown"
          width={8}
          height={8}
        />
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
              className={classNames(styles.option, {
                [styles.active]: option.active,
              })}
              title={option.title}
              key={index}
            >
              {option.element}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Select

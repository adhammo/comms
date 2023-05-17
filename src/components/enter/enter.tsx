import React, { ReactElement, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './enter.module.css'

import classNames from 'classnames'

export declare type Header = {
  title: string
  iconSrc: string
}

export declare type Action = {
  title: string
  default?: boolean
  element: ReactElement | string
  callback: (value: string) => void
}

export declare type EnterProps = {
  header: Header
  placeholder: string
  initalValue: string
  actions: Action[]
  onShow?: () => void
}

export const Enter = ({ header, placeholder, initalValue, actions, onShow }: EnterProps) => {
  const showRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState(false)
  const [value, setValue] = useState(initalValue)

  useEffect(() => {
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
    if (!popupRef.current) {
      document.removeEventListener('mousedown', onMouseDown)
      return
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [popupRef, show])

  return (
    <div className={styles.container}>
      <button
        ref={showRef}
        onClick={() => {
          if (!show) setValue(initalValue)
          setShow(!show)
          onShow?.()
        }}
        className={classNames(styles.show, {
          [styles.active]: show,
        })}
        title={`Edit ${header.title}`}
      >
        <Image src={header.iconSrc} alt={header.title} width={20} height={20} />
      </button>
      <div ref={popupRef} className={classNames(styles.popup, { [styles.hide]: !show })}>
        <div className={styles.field}>
          <input
            className={styles.enter}
            type="text"
            title={`Enter ${header.title}`}
            placeholder={placeholder}
            value={value}
            onChange={show ? event => setValue(event.target.value) : undefined}
            onKeyDown={
              show
                ? event => {
                    if (event.key === 'Enter') {
                      actions.find(action => action.default)?.callback(value)
                      setShow(false)
                    }
                  }
                : undefined
            }
            disabled={!show}
          />
          {actions.map((action, index) => (
            <button
              onClick={
                show
                  ? () => {
                      action.callback(value)
                      setShow(false)
                    }
                  : undefined
              }
              className={classNames(styles.action)}
              title={action.title}
              key={index}
            >
              {action.element}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Enter

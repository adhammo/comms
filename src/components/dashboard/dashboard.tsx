import { useEffect, useState } from 'react'
import { Open_Sans, Roboto } from 'next/font/google'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Dropdown from '@/components/dropdown/dropdown'
import TipTap from '../tiptap/tiptap'
import classNames from 'classnames'
import styles from './dashboard.module.css'

import allActions from '@/config/actions'
import editor, { getContent, getEditor, setContent } from '@/tiptap/editor'

const opensans = Open_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

declare type User = {
  username: string
  first_name: string
  last_name: string
  role: string
  bio: string
}

export declare type CategoryProps = {
  id: string
  title: string
  description: string
}

declare type DashboardProps = { username: string; role: string }

export const Dashboard = ({ username, role }: DashboardProps) => {
  const supabase = useSupabaseClient()
  const actions = allActions[role]
  const [activeAction, setActiveAction] = useState(actions[0].id)
  const action = allActions[role].find(action => action.id === activeAction)!

  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<any>({})
  const [editors, setEditors] = useState<any>({})
  const [props, setProps] = useState<any>({})
  const [refresh, setRefresh] = useState<any>(false)

  useEffect(() => {
    const changeAction = async () => {
      const loaded: any = await action.load(supabase)
      const newProps: any = {}
      const newFields: any = {}
      const newEditors: any = {}
      action.fields.forEach(field => {
        const loadedField = loaded[field.id]
        if (typeof loadedField !== 'undefined') {
          switch (field.type) {
            case 'drop':
              newProps[field.id] = loadedField[0]
              newFields[field.id] = loadedField[1]
              break
            case 'tiptap':
              newEditors[field.id] = getEditor(loadedField)
            default:
              newFields[field.id] = loadedField
              break
          }
        }
      })
      setProps(newProps)
      setFields(newFields)
      setEditors(newEditors)
    }

    changeAction()
      .then(() => setLoading(false))
      .catch(error => {
        console.log(error)
      })
  }, [activeAction])

  useEffect(() => {
    if (!refresh) return
    action.fields.forEach(field => {
      switch (field.type) {
        case 'tiptap':
          setContent(editors[field.id], fields[field.id])
        default:
          break
      }
    })
    setRefresh(false)
  }, [refresh])

  const getFields = () => {
    const newFields = { ...fields }
    action.fields.forEach(field => {
      switch (field.type) {
        case 'tiptap':
          newFields[field.id] = getContent(editors[field.id])
        default:
          break
      }
    })
    return newFields
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        {actions.map(action => (
          <button
            key={action.name}
            className={classNames(styles.action, opensans.className, {
              [styles.active]: action.id === activeAction,
            })}
            title={action.name}
            onClick={() => {
              if (activeAction === action.id) return
              setLoading(true)
              setActiveAction(action.id)
            }}
          >
            {action.name}
          </button>
        ))}
      </div>
      <div className={styles.main}>
        {/* <div className={classNames(styles.error, { [styles.active]: errorMessage !== '' })}>{errorMessage}</div> */}
        <div className={styles.form}>
          {!loading &&
            (fields['error']
              ? fields['error']
              : action.fields.map(field => (
                  <div
                    key={field.id}
                    className={classNames(styles.field, { [styles.vertical]: field.type === 'tiptap' })}
                  >
                    <label className={opensans.className}>{field.label}</label>
                    {(() => {
                      switch (field.type) {
                        case 'drop':
                          console.log(props, field, loading)
                          return (
                            <Dropdown
                              title={field.label}
                              options={props[field.id].map((option: { label: string; value: string }) => ({
                                active: fields[field.id] === option.value,
                                label: option.label,
                                value: option.value,
                                callback: () => {
                                  const changes = action.changes[field.id]?.(props, {
                                    ...fields,
                                    [field.id]: option.value,
                                  })
                                  setFields((oldFields: any) => ({
                                    ...oldFields,
                                    ...changes,
                                    [field.id]: option.value,
                                  }))
                                  if (changes?.['refresh']) setRefresh(true)
                                },
                              }))}
                            />
                          )
                        case 'tiptap':
                          return <TipTap editor={editors[field.id]} />
                        default:
                          return (
                            <input
                              className={roboto.className}
                              type={field.type}
                              title={field.label}
                              value={fields[field.id]}
                              onChange={e => {
                                const changes = action.changes[field.id]?.(props, {
                                  ...fields,
                                  [field.id]: e.target.value,
                                })
                                setFields((oldFields: any) => ({
                                  ...oldFields,
                                  ...changes,
                                  [field.id]: e.target.value,
                                }))
                                if (changes?.['refresh']) setRefresh(true)
                              }}
                            />
                          )
                      }
                    })()}
                  </div>
                )))}
        </div>
      </div>
      <div className={styles.commands}>
        {action.commands.map(command => (
          <button
            key={command.id}
            className={classNames(styles.command, opensans.className)}
            title={command.label}
            onClick={() => command.callback(supabase, getFields())}
          >
            {command.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

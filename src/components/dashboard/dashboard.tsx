import React, { Component } from 'react'
import { Open_Sans, Roboto } from 'next/font/google'
import { SupabaseClient, useSupabaseClient } from '@supabase/auth-helpers-react'
import Dropdown from '@/components/dropdown/dropdown'
import TipTap from '../tiptap/tiptap'
import { SyncLoader } from 'react-spinners'
import classNames from 'classnames'
import styles from './dashboard.module.css'

import allActions from '@/config/actions'
import { Database } from '@/lib/database'
import { NextRouter, Router, useRouter } from 'next/router'

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

declare type DashboardProps = {
  username: string
  role: string
  setStatus: (message: string, error: boolean) => void
  supabase: SupabaseClient<Database>
  router: NextRouter
}
declare type DashboardState = {
  loading: boolean
  activeAction: string
  fields: any
  props: any
  editors: any
  refresh: boolean
  reload: boolean
}

export class Dashboard extends Component<DashboardProps, DashboardState> {
  state = {
    loading: true,
    activeAction: '',
    fields: {},
    props: {},
    editors: {},
    refresh: false,
    reload: false,
  }

  componentDidMount(): void {
    this.setState({ loading: true, activeAction: allActions[this.props.role][0].id })
  }

  componentDidUpdate(prevProps: Readonly<DashboardProps>, prevState: Readonly<DashboardState>, snapshot?: any): void {
    const actions = allActions[this.props.role]
    const action = actions.find(action => action.id === this.state.activeAction)!

    if (
      (prevState.reload !== this.state.reload && this.state.reload) ||
      prevState.activeAction !== this.state.activeAction
    ) {
      const changeAction = async () => {
        const loaded: any = await action.load(this.props.supabase)
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
              case 'image':
                newFields[field.id] = { value: loadedField, file: null }
                break
              default:
                newFields[field.id] = loadedField
                break
            }
          }
        })
        if (loaded['error']) newFields['error'] = loaded['error']
        if (this.state.activeAction === action.id)
          this.setState({ reload: false, loading: false, props: newProps, fields: newFields, editors: newEditors })
      }
      changeAction().catch(error => {
        console.log(error)
      })
    }

    if (prevState.refresh !== this.state.refresh) {
      if (!this.state.refresh) return
      action.fields.forEach(field => {
        switch (field.type) {
          case 'tiptap':
            ;(this.state.editors as any)[field.id].commands.setContent((this.state.fields as any)[field.id])
            break
          default:
            break
        }
      })
      this.setState({ refresh: false })
    }
  }

  getFields = () => {
    const actions = allActions[this.props.role]
    const action = actions.find(action => action.id === this.state.activeAction)!

    const newFields: any = { ...this.state.fields }
    action.fields.forEach(field => {
      switch (field.type) {
        case 'tiptap':
          newFields[field.id] = (this.state.editors as any)[field.id].getJSON()
          break
        case 'image':
          newFields[field.id] = (this.state.fields as any)[field.id].file
          break
        default:
          break
      }
    })
    return newFields
  }

  render() {
    const { loading, activeAction } = this.state
    const { fields, props }: { fields: any; props: any } = this.state
    const actions = allActions[this.props.role]
    const action = actions.find(action => action.id === activeAction)!
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
                this.setState({ loading: true, activeAction: action.id })
              }}
            >
              {action.name}
            </button>
          ))}
        </div>
        <div className={styles.main}>
          {loading ? (
            <SyncLoader className={styles.loader} />
          ) : fields['error'] ? (
            fields['error']
          ) : (
            <div className={styles.form}>
              {action.fields.map(field => (
                <div
                  key={field.id}
                  className={classNames(styles.field, { [styles.vertical]: field.type === 'tiptap' })}
                >
                  <label className={classNames(styles.label, opensans.className)}>{field.label}</label>
                  {(() => {
                    switch (field.type) {
                      case 'drop':
                        return (
                          <Dropdown
                            className={classNames(styles.input, roboto.className)}
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
                                this.setState(oldState => ({
                                  fields: {
                                    ...oldState.fields,
                                    ...changes,
                                    [field.id]: option.value,
                                  },
                                }))
                                if (changes?.['refresh']) this.setState({ refresh: true })
                              },
                            }))}
                          />
                        )
                      case 'tiptap':
                        return (
                          <TipTap
                            content={fields[field.id]}
                            setEditor={editor =>
                              this.setState(oldState => ({ editors: { ...oldState.editors, [field.id]: editor } }))
                            }
                          />
                        )
                      case 'image':
                        const getFileName = (filename: string) => filename.replace(/^.*[\\\/]/, '')
                        return (
                          <>
                            <label className={classNames(styles.imageLabel, roboto.className)} title={field.label}>
                              <input
                                hidden
                                className={styles.input}
                                type="file"
                                accept="image/jpeg, image/jpg"
                                onChange={e => {
                                  const changes = action.changes[field.id]?.(props, {
                                    ...fields,
                                    [field.id]: { value: e.target.value, file: e.target.files![0] },
                                  })
                                  this.setState(oldState => ({
                                    fields: {
                                      ...oldState.fields,
                                      ...changes,
                                      [field.id]: { value: e.target.value, file: e.target.files![0] },
                                    },
                                  }))
                                }}
                              />
                              {fields[field.id].value ? getFileName(fields[field.id].value) : 'Select image'}
                            </label>
                          </>
                        )
                      case 'textarea':
                        return (
                          <textarea
                            className={classNames(styles.textarea, roboto.className)}
                            title={field.label}
                            value={fields[field.id]}
                            onChange={e => {
                              const value = e.target.value.replace(/\n/g, '')
                              const changes = action.changes[field.id]?.(props, {
                                ...fields,
                                [field.id]: value,
                              })
                              this.setState(oldState => ({
                                fields: {
                                  ...oldState.fields,
                                  ...changes,
                                  [field.id]: value,
                                },
                              }))
                              if (changes?.['refresh']) this.setState({ refresh: true })
                            }}
                          />
                        )
                      default:
                        return (
                          <input
                            className={classNames(styles.input, roboto.className)}
                            type={field.type}
                            title={field.label}
                            value={fields[field.id]}
                            onChange={e => {
                              const changes = action.changes[field.id]?.(props, {
                                ...fields,
                                [field.id]: e.target.value,
                              })
                              this.setState(oldState => ({
                                fields: {
                                  ...oldState.fields,
                                  ...changes,
                                  [field.id]: e.target.value,
                                },
                              }))
                              if (changes?.['refresh']) this.setState({ refresh: true })
                            }}
                          />
                        )
                    }
                  })()}
                  {(() => {
                    const error = field.error?.(fields[field.id])
                    return (
                      (error || field.description) && (
                        <p className={classNames(styles.description, roboto.className, { [styles.error]: error })}>
                          {error ?? field.description}
                        </p>
                      )
                    )
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.commands}>
          {!loading &&
            !fields['error'] &&
            action.commands.map(
              command =>
                (command.valid?.(props, fields) ?? true) && (
                  <button
                    key={command.id}
                    className={classNames(styles.command, opensans.className)}
                    title={command.label}
                    onClick={async () => {
                      this.setState({ loading: true })
                      const error = await command.callback(this.props.supabase, this.getFields())
                      if (!error) {
                        this.props.setStatus(`${action.name} succeeded`, false)
                        this.setState({ reload: true })
                      } else {
                        this.props.setStatus(error, true)
                      }
                    }}
                  >
                    {command.label}
                  </button>
                )
            )}
        </div>
      </div>
    )
  }
}

export default function DashboardWrapper({
  username,
  role,
  setStatus,
}: {
  username: string
  role: string
  setStatus: (message: string, error: boolean) => void
}) {
  const router = useRouter()
  const supabase = useSupabaseClient<Database>()
  return <Dashboard username={username} role={role} setStatus={setStatus} router={router} supabase={supabase} />
}

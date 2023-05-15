import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Open_Sans, Roboto } from 'next/font/google'
import classNames from 'classnames'
import styles from './dashboard.module.css'

import allActions from '@/config/actions'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const opensans = Open_Sans({
  weight: '500',
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

declare type DashboardProps = { username: string; role: string }

export const Dashboard = ({ username, role }: DashboardProps) => {
  const actions = allActions[role]
  const [activeAction, setActiveAction] = useState(actions[0].id)
  const action = allActions[role].filter(action => action.id == activeAction)[0]

  useSupabaseClient()
    .from('user_categories')
    .select('*')
    .then(({ data, error }) => console.log(error))

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
              setActiveAction(action.id)
            }}
          >
            {action.name}
          </button>
        ))}
      </div>
      <div className={styles.main}>
        {/* <div className={classNames(styles.error, { [styles.active]: errorMessage !== '' })}>{errorMessage}</div> */}
        <form className={styles.form}>
          {action.fields.map(field => (
            <div key={field.id} className={styles.field}>
              <label>{field.label}</label>
              {(() => {
                switch (field.type) {
                  case 'category':
                    return <></>
                  default:
                    return (
                      <input
                        type={field.type}
                        title={field.label}
                        // value={email}
                        // onChange={e => setEmail(e.target.value)}
                      />
                    )
                }
              })()}
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}

export default Dashboard

// <div className={styles.field}>
// <label>Email</label>
// <input
//   type="email"
//   placeholder="email@address.com"
//   title="Enter your email address"
//   value={email}
//   onChange={e => setEmail(e.target.value)}
//   onKeyDown={event => {
//     if (event.key === 'Enter') submitForm()
//   }}
// />
// </div>
// <div className={styles.field}>
// <label>Password</label>
// <input
//   type="password"
//   placeholder="•••••••••"
//   title="Enter your password"
//   value={password}
//   onChange={e => setPassword(e.target.value)}
//   onKeyDown={event => {
//     if (event.key === 'Enter') submitForm()
//   }}
// />
// </div>
// <div className={styles.submitCotainer}>
// <button
//   className={styles.submit}
//   type="button"
//   title="Sign in to your account"
//   onClick={e => {
//     e.preventDefault()
//     submitForm()
//   }}
// >
//   Sign in
// </button>
// </div>

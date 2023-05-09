import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'
import { signIn, signUp } from '@/lib/auth'
import styles from './auth.module.css'

export declare type SignProps = {
  setErrorMessage: (error: string) => void
}

const Signin = ({ setErrorMessage }: SignProps) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitForm = () => {
    if (email === '') setErrorMessage('Please enter your email address.')
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      setErrorMessage('Please enter a valid email address.')
    else if (password === '') setErrorMessage('Please enter your password.')
    else
      signIn(email, password).then(value => {
        if (value == null) setErrorMessage('Incorrect email or password.')
        else {
          setErrorMessage('')
          router.push('/author')
        }
      })
  }

  return (
    <>
      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@address.com"
          title="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submitForm()
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Password</label>
        <input
          type="password"
          placeholder="•••••••••"
          title="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submitForm()
          }}
        />
      </div>
      <div className={styles.submitCotainer}>
        <button
          className={styles.submit}
          type="button"
          title="Sign in to your account"
          onClick={e => {
            e.preventDefault()
            submitForm()
          }}
        >
          Sign in
        </button>
      </div>
      <Link className={styles.link} href="/forget">
        Forgot your password?
      </Link>
      <Link className={styles.link} href="/signup">
        Don't have an account? Sign up
      </Link>
    </>
  )
}

const Signup = ({ setErrorMessage }: SignProps) => {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const submitForm = () => {
    if (firstName === '') setErrorMessage('Please enter your first name.')
    else if (lastName === '') setErrorMessage('Please enter your last name.')
    else if (email === '') setErrorMessage('Please enter your email address.')
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      setErrorMessage('Please enter a valid email address.')
    else if (password === '') setErrorMessage('Please enter your password.')
    else if (confirmPass === '') setErrorMessage('Please confirm your password.')
    else if (confirmPass !== password) setErrorMessage("Passwords don't match.")
    else
      signUp(email, password, firstName, lastName).then(value => {
        if (value == null) setErrorMessage('An account exists with this email.')
        else {
          setErrorMessage('')
          router.push('/signin')
        }
      })
  }

  return (
    <>
      <div className={styles.group}>
        <div className={styles.field}>
          <label>First Name</label>
          <input
            type="text"
            placeholder="John"
            title="Enter your first name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') submitForm()
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            title="Enter your last name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') submitForm()
            }}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@address.com"
          title="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submitForm()
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Password</label>
        <input
          type="password"
          placeholder="•••••••••"
          title="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submitForm()
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Comfirm Password</label>
        <input
          type="password"
          placeholder="•••••••••"
          title="Enter your password"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') submitForm()
          }}
        />
      </div>
      <div className={styles.submitCotainer}>
        <button
          className={styles.submit}
          type="button"
          title="Sign up to Comms"
          onClick={e => {
            e.preventDefault()
            submitForm()
          }}
        >
          Sign up
        </button>
      </div>
      <Link className={styles.link} href="/signin">
        Already have an account? Sign in
      </Link>
    </>
  )
}

export declare type AuthType = 'Sign In' | 'Sign Up' | 'Forget Password'

export declare type AuthProps = {
  authType: AuthType
}

export const Auth = ({ authType }: AuthProps) => {
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {(authType === 'Sign In' && 'Sign in') ||
          (authType === 'Sign Up' && 'Sign up') ||
          (authType === 'Forget Password' && 'Reset password')}
      </h1>
      <div className={classNames(styles.error, { [styles.active]: errorMessage !== '' })}>{errorMessage}</div>
      <form className={styles.form}>
        {(authType === 'Sign In' && <Signin setErrorMessage={setErrorMessage} />) ||
          (authType === 'Sign Up' && <Signup setErrorMessage={setErrorMessage} />) ||
          (authType === 'Forget Password' && <Signin setErrorMessage={setErrorMessage} />)}
      </form>
    </div>
  )
}

export default Auth

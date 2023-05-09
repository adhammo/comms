import supabase from './client'

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profiles, error } = await supabase.from('profiles').select('*').eq('id', user.id)
  if (error) console.error(error.message)
  return profiles
}

export async function signIn(email: string, password: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) console.log(error)
  if (!user || error) return null

  const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id)
  if (profileError) console.error(profileError.message)
  return profiles
}

export async function signUp(email: string, password: string, first_name: string, last_name: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
      },
    },
  })
  if (error) console.error(error.message)
  if (!user || error) return null

  const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id)
  if (profileError) console.error(profileError.message)
  return profiles
}

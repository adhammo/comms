import supabase from './client'

export async function getAllLiveProfiles() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio')
    .eq('live', true)
  if (error) throw error
  return profiles
}

export async function getAllProfiles() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio, live')
  if (error) throw error
  return profiles
}

export async function getProfile(username: string) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, first_name, last_name, role, bio')
    .eq('username', username)
  if (error) throw error
  return profiles[0]
}

export async function checkProfile(username: string) {
  const { data: profiles, error } = await supabase.from('profiles').select('id').eq('username', username)
  if (error) throw error
  return profiles.length > 0
}

export async function getProfileById(userId: string) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio')
    .eq('id', userId)
  if (error) throw error
  return profiles[0]
}

export async function createProfile(
  profile: {
    id: any
    username: any
    first_name: any
    last_name: any
  }
) {
  const { error } = await supabase.from('profiles').insert([profile])
  if (error) throw error
}

export async function updateProfile(
  username: string,
  profile: {
    first_name: any
    last_name: any
    bio: any
  }
) {
  const { error } = await supabase.from('profiles').update(profile).eq('username', username)
  if (error) throw error
}

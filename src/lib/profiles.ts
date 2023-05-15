import supabase from './client'

export async function getAllProfiles() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio')
    .eq('live', true)
  if (error) throw error
  return profiles
}

export async function getProfile(username: string) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio')
    .eq('live', true)
    .eq('username', username)
  if (error) throw error
  return profiles[0]
}

export async function getProfileById(userId: string) {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('username, first_name, last_name, role, bio')
    .eq('live', true)
    .eq('id', userId)
  if (error) throw error
  return profiles[0]
}

import supabase from './client'

export function getImageSrc(path: string) {
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}

export default getImageSrc

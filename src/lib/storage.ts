import { SUPABASE_URL } from './client'

export const getImageSrc = (src: string) => `${SUPABASE_URL}/storage/v1/object/public/images${src}`

export default getImageSrc

// import { NextApiRequest, NextApiResponse } from 'next'

// import { checkUserExists, signUp } from '@/lib/auth'

// declare type User = {
//   username: string
//   first_name: string
//   last_name: string
//   email: string
//   password: string
// }

// declare type SignError = { code: number; message: string }

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== 'POST') {
//     res.status(405).send('Only POST requests allowed')
//     return
//   }

//   console.log(req.body)

//   const { username, first_name, last_name, email, password }: User = req.body

//   try {
//     if (await checkUserExists(username, email))
//       throw { code: 400, message: 'There exists a user with this username or email' }
//     await signUp(username, email, password, first_name, last_name)
//     res.status(200)
//   } catch (err) {
//     const error = err as SignError
//     res.status(error.code).json({ message: error.message })
//   }
// }

// export default handler

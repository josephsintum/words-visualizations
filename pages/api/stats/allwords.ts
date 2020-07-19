import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { Connection } from 'mongoose'
import Word from '../../../models/Word'

const handler = nextConnect()
handler.use(middleware)

interface MiddlewareRequest extends NextApiRequest {
    db: Connection
}

handler
    .get(async (req: MiddlewareRequest, res: NextApiResponse) => {
        res.json(await Word.find({}))
    })
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        const letters = new Word({
            word: 'Lalala',
            frequency: 232,
            date: Date.now(),
        })
            .save()
            .then((r) => console.log(r))
            .catch((e) => console.error(e))

        res.json(letters)
    })

export default handler

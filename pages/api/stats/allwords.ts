// testing database middleware
// GET response with all word database entries
// POST adds word with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import middleware from '../../../middleware/middleware'
import Word from '../../../models/Word'

const handler = nextConnect()
handler.use(middleware)

interface MiddlewareRequest extends NextApiRequest {
    body: {
        word: string
        frequency: number
    }
}

handler
    .get(async (req: MiddlewareRequest, res: NextApiResponse) => {
        res.json(await Word.find())
    })
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        try {
            const words = new Word({
                word: req.body.word,
                frequency: req.body.frequency,
                date: Date.now(),
            }).save()
            res.json(await words)
        } catch (e) {
            console.error(e)
            res.status(500).json({ error: e })
        }
    })

export default handler

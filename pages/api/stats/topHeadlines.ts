// GET response with all wordModel database entries
// POST adds wordModel with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import middleware from '../../../middleware/middleware'
import { TopHeadlinesStatsModel } from '../../../models/topHeadlines.model'

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    res.json(await TopHeadlinesStatsModel.find())
})

export default handler

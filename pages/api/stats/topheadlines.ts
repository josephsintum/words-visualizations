// GET response with all wordModel database entries
// POST adds wordModel with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import middleware from '../../../middleware/middleware'
import { Article, ArticleType } from '../../../models/article.model'

const handler = nextConnect()
handler.use(middleware)

interface MiddlewareRequest extends NextApiRequest {
    body: ArticleType
}

handler
    .get(async (req: MiddlewareRequest, res: NextApiResponse) => {
        res.json(await Article.find())
    })

export default handler
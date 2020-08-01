// GET response with all word database entries
// POST adds word with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import NewsAPI from 'newsapi'
import middleware from '../../../middleware/middleware'
import Article, { ArticleType } from '../../../models/article'

const newsapi = new NewsAPI(process.env.API_KEY)

const handler = nextConnect()
handler.use(middleware)

interface MiddlewareRequest extends NextApiRequest {
    body: ArticleType
}

export interface NewsAPIResponse {
    status: string
    totalResults: number
    articles: ArticleType[]
}

handler
    .get(async (req: MiddlewareRequest, res: NextApiResponse) => {
        res.json(await Article.find())
    })
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        // fetching top headlines from newsAPI
        let newsData: NewsAPIResponse = await newsapi.v2.topHeadlines({
            language: 'en',
        })

        newsData.articles.map((article) => {
            // checking if url already exist in database
            Article.exists({ url: article.url }, (err, resBool) => {
                // error handling
                if (err) {
                    console.log({ error: err })
                    res.status(500).json({ error: err })
                    return
                }
                // if article is unique, create in database
                if (!resBool) {
                    Article.create(article, (err) => {
                        // error handling
                        if (err) {
                            console.log({ error: err })
                            res.status(500).json({ error: err })
                            return
                        }
                    })
                }
            })
        })
        res.json({ status: 'success' })
    })

export default handler
// GET response with all wordModel database entries
// POST adds wordModel with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import NewsAPI from 'newsapi'
import middleware from '../../../middleware/middleware'
import Article, { ArticleType } from '../../../models/article.model'

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
    // update to Top headlines model
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        // fetching top headlines from newsAPI
        let newsData: NewsAPIResponse = await newsapi.v2.topHeadlines({
            language: 'en',
        })

        // check if articles doesn't exist in Database, then store article
        newsData.articles.map((article) => {
            // checking if url already exist in database
            Article.exists({ url: article.url })
                .then(async (resBool) => {
                    // if articleModel is unique, create in database
                    if (!resBool) {
                        // article.create throws and error if article is not unique
                        // catching error,
                        // todo: **handle error
                        try {
                            await Article.create(article).catch((reason) => {
                                console.log(reason)
                                return
                            })
                        } catch (e) {
                            console.error(e)
                            return
                        }
                    }
                })
                .catch((reason) => {
                    console.log(reason)
                    res.status(500).json(reason)
                    return
                })
        })
        // respond with success
        res.json({ status: 'success' })

        // create statistics
    })

export default handler

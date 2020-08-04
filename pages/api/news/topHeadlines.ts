// GET response with all wordModel database entries
// POST adds wordModel with frequency to database

import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import NewsAPI from 'newsapi'
import middleware from '../../../middleware/middleware'
import { Article, ArticleType } from '../../../models/article.model'
import {
    TopHeadlinesModel,
    TopHeadlinesStatsModel,
} from '../../../models/topHeadlines.model'
import wordCounter from '../../../utils/wordCounter'

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
    .get((req: MiddlewareRequest, res: NextApiResponse) => {
        TopHeadlinesModel.find()
            .populate({
                path: 'article',
            })
            .then((headlines) => {
                res.json({ headlines: headlines })
            })
            .catch((err) => {
                console.log(err)
                res.status(503).json(err)
            })
    })
    // update to Top headlines model
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        // fetching top headlines from newsAPI
        let newsData: NewsAPIResponse = await newsapi.v2
            .topHeadlines({
                language: 'en',
            })
            .catch((err: any) => {
                console.error(err)
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

        // create top headlines
        newsData.articles.map(async (article) => {
            let articleID = await Article.findOne({ url: article.url })
            if (articleID?._id) {
                await TopHeadlinesModel.create({
                    article: articleID._id,
                }).catch((err) => console.error(err))
            }
        })

        // respond with success
        res.json({ status: 'success' })
    })

export default handler

import nextConnect from 'next-connect'
// @ts-ignore
import NewsAPI from 'newsapi'

import middleware, { MiddlewareRequest } from '../../../middleware/middleware'
import { NewsModel } from '../../../models/news.model'
import { NextApiResponse } from 'next'
import wordCounter from '../../../utils/wordCounter'
import { NewsAPIResponse } from '../../../utils/newsAPITypes'

const newsapi = new NewsAPI(process.env.API_KEY)

const handler = nextConnect()
handler.use(middleware)

handler
    .get((req: MiddlewareRequest, res: NextApiResponse) => {
        NewsModel.find()
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.error(err)
                res.status(500).json(err)
            })
    })
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        // fetching top headlines from newsAPI
        // todo: handle error
        await newsapi.v2
            .topHeadlines({
                language: 'en',
                pageSize: 100,
            })
            .then((newsData: NewsAPIResponse) => {
                let newsStats = wordCounter(newsData.articles)

                // adding news data to the database
                NewsModel.create({
                    sources: 'all',
                    articles: newsData.articles,
                    stats: newsStats,
                    version: 1,
                })
                    .then((data) => {
                        res.json(data)
                    })
                    .catch((err) => {
                        console.error(err)
                        res.status(500).json(err)
                    })
            })
            .catch((err: any) => {
                console.error(err)
            })
    })

export default handler

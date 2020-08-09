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

interface IncomingRequest extends MiddlewareRequest {
    query: {
        // pageSize - returns number of news items per page
        pageSize: string
        // page - returns page (pagination)
        page: string
        // statSize - returns number of statistics per news item
        statSize: string
    }
}

handler
    .get((req: IncomingRequest, res: NextApiResponse) => {
        /*
         * Handles GET request .../api/news
         * returns time series news statistics
         * query param
         *   pageSize: number - returns number of news items per page
         *   page: number - returns page (pagination)
         *   statSize: number - returns number of statistics per news item
         */

        let pageSize = Number(req.query.pageSize) || 20
        let statSize = -(Number(req.query.statSize) || 25)
        let page = Number(req.query.page) || 0

        NewsModel.find({}, 'dateTime stats')
            .slice('stats', statSize)
            .limit(pageSize)
            .skip(pageSize * page)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.error(err)
                res.status(500).json(err)
            })
    })
    .post(async (req: MiddlewareRequest, res: NextApiResponse) => {
        /*
         * Handles POST request .../api/news
         * Makes a request to the news api for the top headlines
         * updates database with the top headlines and news stats
         * no params, body or header
         */
        // fetching top headlines from newsAPI
        await newsapi.v2
            .topHeadlines({
                language: 'en',
                pageSize: 100,
            })
            .then((newsData: NewsAPIResponse) => {
                // adding news data to the database
                NewsModel.create({
                    sources: 'all',
                    articles: newsData.articles,
                    stats: wordCounter(newsData.articles),
                    version: 1,
                    dateTime: Date.now(),
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

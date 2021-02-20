import nextConnect from 'next-connect'
// @ts-ignore
import NewsAPI from 'newsapi'

import middleware, { MiddlewareRequest } from '../../../middleware/middleware'
import { NewsModel } from '../../../models/news.model'
import { NextApiResponse } from 'next'
import wordCounter from '../../../utils/wordCounter'
import { NewsAPIResponse } from '../../../utils/newsAPITypes'
import { endOfToday, startOfToday } from 'date-fns'
import { DailyStatsModel } from '../../../models/dailyStats.model'
import { calcWordFreq } from '../../index'

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

        let pageSize = Number(req.query.pageSize) || 24
        let statSize = -(Number(req.query.statSize) || 25)
        let page = Number(req.query.page) || 0

        NewsModel.find({}, 'dateTime stats')
            .slice('stats', statSize)
            .limit(pageSize)
            .skip(pageSize * page)
            .sort('-dateTime')
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

        // cron-job running on https://cron-job.org/en/
        // schedule every 15 mins

        await newsapi.v2
            // source top headlines from the News API
            .topHeadlines({
                language: 'en',
                pageSize: 100,
            })
            .then((newsData: NewsAPIResponse) => {
                // adding news data to the database
                NewsModel.create({
                    sources: 'all',
                    stats: wordCounter(newsData.articles),
                    version: 2,
                    dateTime: Date.now(),
                })
                    .then((data) => {
                        // update daily Stat database
                        NewsModel.find(
                            {
                                dateTime: {         // query date range
                                    $gte: startOfToday(),
                                    $lte: endOfToday(),
                                },
                            },
                            'dateTime stats'
                        )
                            .then((data) => {
                                let cumulativeList = calcWordFreq(
                                    data,
                                    startOfToday(),
                                    endOfToday(),
                                    -10
                                )
                                // find and update else create daily stats collection
                                DailyStatsModel.findOneAndUpdate(
                                    { dateTime: startOfToday() },
                                    {
                                        dateTime: startOfToday(),
                                        version: 1,
                                        stats: cumulativeList,
                                    },
                                    {
                                        upsert: true,
                                        new: true,
                                        setDefaultsOnInsert: true,
                                    },
                                    (err, result) => {
                                        if (err) {
                                            console.error(err)
                                            res.status(500).json(err)
                                            return
                                        }
                                        res.json(result)
                                    }
                                )
                            })
                            .catch((err) => {
                                console.error(err)
                                res.status(500).json(err)
                            })
                        // res.json({ status: 'success' })
                    })
                    .catch((err) => {
                        console.error(err)
                        res.status(500).json(err)
                    })
            })
            .catch((err: unknown) => {
                console.error(err)
            })
    })

export default handler

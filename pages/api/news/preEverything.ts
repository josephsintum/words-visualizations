// @ts-ignore
import NewsAPI from 'newsapi'
import { NextApiRequest, NextApiResponse } from 'next'
import { NewsAPIResponse } from './topHeadlines'

const newsapi = new NewsAPI(process.env.API_KEY)

async function news(): Promise<NewsAPIResponse[]> {
    let response = await newsapi.v2.sources({
        language: 'en',
        country: 'us',
    })
    let [...sources] = response.sources.map(
        (source: { id: string }) => source.id
    )

    let promises = sources.map((source: string) => {
        return newsapi.v2.everything({
            sources: source,
            pageSize: 100,
        })
    })
    return await Promise.all(promises)
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')

    news()
        .then((response) => {
            let articles = response.map((result) => result.articles).flat()
            res.json(articles)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json(error)
        })
}
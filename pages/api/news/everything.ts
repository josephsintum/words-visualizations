import NewsAPI from 'newsapi'
import { NextApiRequest, NextApiResponse } from 'next'

const newsapi = new NewsAPI(process.env.API_KEY)

export default (req: NextApiRequest, res:NextApiResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')

    news()
        .then((response) => {
            response = response.map((result) => result.articles)
            response = response.flat()
            res.end(JSON.stringify( response ))
        })
        .catch((error) => {
            res.end(JSON.stringify(error))
            console.error(error)
        })
}

async function news() {
    let response = await newsapi.v2.sources({
        language: 'en',
        country: 'us',
    })
    let [...sources] = response.sources.map((source) => source.id)

    let promises = sources.map((source) => {
        return newsapi.v2.everything({
            sources: source,
            pageSize: 100,
        })
    })
    return await Promise.all(promises)
}

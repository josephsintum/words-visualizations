import NewsAPI from 'newsapi'
const newsapi = new NewsAPI(process.env.API_KEY)

export default (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    newsapi.v2
        .sources({
            language: 'en',
            country: 'us',
        })
        .then((response) => {
            res.end(JSON.stringify(response))
        })
        .catch((err) => {
            console.error(err)
            res.end(JSON.stringify(err))
        })
}

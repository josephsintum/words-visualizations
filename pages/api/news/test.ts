import { NextApiRequest, NextApiResponse } from 'next'
import natural from 'natural'
import stopwords from '../../../utils/stopwords'

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')

    let data = news()
        .then((result) => res.end(JSON.stringify(result)))
        .catch((err) => res.end(JSON.stringify(err)))
}

async function news() {
    let response = await (await fetch('http://localhost:3000/api/news')).json()
    let tokenizer = new natural.WordTokenizer()
    let tokens: string[] = response.news
        .map((result: { title: string; description: string }) => {
            return tokenizer.tokenize(result.title + ',' + result.description)
        })
        .flat()

    /* 
        todo: clean up
        remove stop words 
        remove fragments
        stemming - not working as expected
    */
    let counts = tokens.reduce((count: { [key: string]: number }, word) => {
        if (isNaN(parseInt(word))) {
            word = word.toLowerCase()
            if (!stopwords.map.has(word)) {
                // word = natural.PorterStemmer.stem(word)
                count[word] = (count[word] || 0) + 1
            }
        }
        return count
    }, {})

    // sorting object of words in ascending order
    return Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .reduce((accumulator: { [key: string]: number }, v) => {
            accumulator[v] = counts[v]
            return accumulator
        }, {})
}

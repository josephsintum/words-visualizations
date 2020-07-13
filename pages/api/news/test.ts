import { NextApiRequest, NextApiResponse } from 'next'
import natural from 'natural'

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')

    let data = news()
        .then((result) => res.end(JSON.stringify(result)))
        .catch((err) => res.end(JSON.stringify(err)))
}

async function news() {
    let response = await (await fetch('http://localhost:3000/api/news')).json()
    response = response.news
        .map((result) => {
            // this merges the title and description
            return result.title + ' ' + result.description
        })
        .join(' ')
    let tokenizer = new natural.WordTokenizer()
    // tokenize takes texts and splits into words
    let tokens = tokenizer.tokenize(response)

    // cleaning up words
    // removing numbers
    tokens = tokens.filter((word) => {
        return !Number(word)
    })


    // counts is an object of type {...{word: count}}
    let counts = tokens.reduce((count, word) => {
        word = word.toLowerCase()
        count[word] = (count[word] || 0) + 1
        return count
    }, {})

    // sorting object of words in ascending order
    let sorted_counts = Object.keys(counts)
        .sort((a, b) => counts[a] - counts[b])
        .reduce((accumulator, v) => {
            accumulator[v] = counts[v]
            return accumulator
        }, {})
    console.log(sorted_counts)
    return sorted_counts
}

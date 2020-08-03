import natural from 'natural'
import stopWords from './stopWords'
import { ArticleType } from '../models/article.model'

export default function wordCounter(text: ArticleType[]) {
    let tokenizer = new natural.WordTokenizer()
    let tokens: string[] = text
        .map((result) => {
            return tokenizer.tokenize(result.title + ',' + result.description)
        })
        .flat()

    // todo: stemming - not working as expected
    let counts = tokens.reduce((count: { [key: string]: number }, word) => {
        if (isNaN(parseInt(word))) {
            word = word.toLowerCase()
            if (!stopWords.map.has(word)) {
                // wordModel = natural.PorterStemmer.stem(wordModel)
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

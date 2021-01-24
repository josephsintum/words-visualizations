import natural from 'natural'
import stopWords from './stopWords'
import { ArticleType } from './newsAPITypes'

export default function wordCounter(text: ArticleType[]) {
    let tokenizer = new natural.WordTokenizer()

    return (
        text
            // merge and tokenize title and description into a (string[])[]
            .map((result) =>
                tokenizer.tokenize(result.title + ',' + result.description)
            )
            // flatten to string[]
            .flat()
            .reduce((acc: { word: string; frequency: number }[], word) => {
                // remove numbers, turn to lower case and remove stop words
                if (isNaN(parseInt(word))) {
                    word = word.toLowerCase()
                    if (!stopWords.map.has(word)) {
                        // todo: stemming - not working as expected
                        // wordModel = natural.PorterStemmer.stem(wordModel)

                        let count = acc.find((k) => k.word === word)
                        if (count) {
                            ++count.frequency
                        } else {
                            acc.push({ word: word, frequency: 1 })
                        }
                    }
                }
                return acc
            }, [])
            .sort((a, b) => {
                return a.frequency - b.frequency
            })
            .slice(-15)
    )
}

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
                        acc.push({
                            word: word,
                            // frequency: check array if frequency exist ? add 1 : assign 0 then + 1
                            frequency:
                                (acc.find((k) => k.word === word)?.frequency ||
                                    0) + 1,
                        })
                    }
                }
                return acc
            }, [])
    )
}

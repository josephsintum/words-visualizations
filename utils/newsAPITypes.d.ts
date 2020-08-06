import { Document } from 'mongoose'

export interface ArticleType extends Document {
    source: {
        id?: string
        name: string
    }
    author?: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: Date
    content?: string
}

export interface NewsAPIResponse {
    status: string
    totalResults: number
    articles: ArticleType[]
}
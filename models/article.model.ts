// Article Object schema for saving news in database

import mongoose, { Document, Schema } from 'mongoose'

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
    publishedAt: string
    content?: string
}

const ArticleSchema = new Schema<ArticleType>({
    source: {
        id: String,
        name: { type: String, required: true },
    },
    author: String,
    title: String,
    description: String,
    url: { type: String, required: true, unique: true },
    urlToImage: String,
    publishedAt: String,
    content: String,
})

export const Article: mongoose.Model<ArticleType, {}> =
    mongoose.models.Article ||
    mongoose.model<ArticleType>('Article', ArticleSchema)

// Article Object schema for saving news in database

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ArticleType extends Document {
    source: {
        id?: string
        name: string
    }
    author: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string
}

const ArticleSchema: Schema = new mongoose.Schema({
    source: {
        id: String,
        name: { type: String, required: true },
    },
    author: String,
    title: String,
    description: String,
    url: { type: String, unique: true },
    urlToImage: String,
    publishedAt: String,
    content: String,
})

let article: Model<ArticleType, {}>

// using try catch to avoid schema recreation error
try {
    article = mongoose.model<ArticleType>('Article', ArticleSchema)
} catch (e) {
    article = mongoose.model<ArticleType>('Article')
}

export default article

// News Bucket Model for saving news & statistics in database

import mongoose from 'mongoose'
import { ArticleType } from '../utils/newsAPITypes'

export interface NewsType extends mongoose.Document {
    dateTime?: Date
    sources: string
    articles: ArticleType[]
    stats: [
        {
            word: string
            frequency: number
        }
    ]
    version: number
}

const NewsSchema = new mongoose.Schema({
    dateTime: { type: Date, default: Date.now },
    sources: String,
    articles: [
        {
            source: {
                id: String,
                name: { type: String, required: true },
            },
            author: String,
            title: String,
            description: String,
            url: { type: String, required: true },
            urlToImage: String,
            publishedAt: Date,
            content: String,
        },
    ],
    stats: [
        {
            word: String,
            frequency: Number,
        },
    ],
    version: {
        type: Number,
        default: 1,
    },
})

// Resetting models to avoid -> OverwriteModelError:
// Cannot overwrite `news` model once compiled.
mongoose.models = {}

export const NewsModel: mongoose.Model<NewsType> =
    mongoose.models.NewsModel || mongoose.model('news', NewsSchema)

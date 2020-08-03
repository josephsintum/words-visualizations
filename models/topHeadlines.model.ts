// Article Object schema for saving top headlines in database

import mongoose, { Document, Schema } from 'mongoose'
import { ArticleType } from './article.model'

export interface TopHeadlinesStatsType extends Document {
    word: string
    frequency: number
}

// todo: looking into schema types
const TopHeadlinesStatsSchema = new Schema<TopHeadlinesStatsType>({
    word: String,
    frequency: Number,
})

export interface TopHeadlinesType extends Document {
    article: ArticleType['_id']
}

const TopHeadlinesSchema = new Schema<TopHeadlinesType>({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
})

export const TopHeadlinesModel: mongoose.Model<TopHeadlinesType, {}> =
    mongoose.models.TopHeadlinesModel ||
    mongoose.model('TopHeadlinesModel', TopHeadlinesSchema)

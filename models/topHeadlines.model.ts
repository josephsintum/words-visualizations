// Article Object schema for saving top headlines in database

import mongoose, { Document, Schema, model, models } from 'mongoose'
import { ArticleType } from './article.model'

// top headline stats Types, Schema and model

export interface TopHeadlinesStatsType extends Document {
    word: string
    frequency: number
}

const TopHeadlinesStatsSchema = new Schema<TopHeadlinesStatsType>({
    word: String,
    frequency: Number,
})

export const TopHeadlinesStatsModel: mongoose.Model<TopHeadlinesStatsType> =
    models.TopHeadlinesStatsModel ||
    model('TopHeadlinesStatsModel', TopHeadlinesStatsSchema)

// top headline Types, Schema and model

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

export const TopHeadlinesModel: mongoose.Model<TopHeadlinesType> =
    models.TopHeadlinesModel || model('TopHeadlinesModel', TopHeadlinesSchema)

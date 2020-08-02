// Article Object schema for saving top headlines in database

import mongoose, { Schema, Document, Model } from 'mongoose'
import { ArticleType } from './article.model'

export interface TopHeadlinesType extends Document {
    article: ArticleType['url']
}

const TopHeadlinesSchema: Schema = new mongoose.Schema({
    article: {
        type: Schema.Types.String,
        required: true,
    },
})

let TopHeadlinesModel: Model<TopHeadlinesType, {}>

// using try catch to avoid schema recreation error
try {
    TopHeadlinesModel = mongoose.model<TopHeadlinesType>(
        'TopHeadlinesModel',
        TopHeadlinesSchema
    )
} catch (e) {
    TopHeadlinesModel = mongoose.model<TopHeadlinesType>('TopHeadlinesModel')
}

export default TopHeadlinesModel

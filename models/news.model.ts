// News Bucket Model for saving news & statistics in database

import mongoose from 'mongoose'

export interface NewsType {
    dateTime: Date
    sources: string | 'all'
    stats: {
        word: string
        frequency: number
    }[]
    version: number
}

const NewsSchema = new mongoose.Schema({
    dateTime: { type: Date, default: Date.now },
    sources: String,
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
    // data expires after 26 hours from created timestamp
    createdAt: { type: Date, expires: '26h', default: Date.now },
})

// Resetting models to avoid -> OverwriteModelError:
// Cannot overwrite `news` model once compiled.
mongoose.models = {}

export const NewsModel: mongoose.Model<mongoose.Document & NewsType> =
    mongoose.models.NewsModel || mongoose.model('news', NewsSchema)

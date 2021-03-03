// Daily Stats Model for saving cumulative daily statistics in DB

import mongoose from 'mongoose'

export interface DailyStatsType {
    dateTime: Date
    stats: {
        word: string
        frequency: number
    }[]
    version: number
}

const DailyStatsSchema = new mongoose.Schema({
    dateTime: { type: Date, default: Date.now },
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
    // data expires after 8 days from created timestamp
    createdAt: { type: Date, expires: '8d', default: Date.now },
})

// Resetting models to avoid -> OverwriteModelError:
// Cannot overwrite `news` model once compiled.
// mongoose.models = {}

export const DailyStatsModel: mongoose.Model<mongoose.Document & DailyStatsType> =
    mongoose.models.DailyStatsModel || mongoose.model('dailyStats', DailyStatsSchema)

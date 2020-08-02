// Word schema for saving words and frequency in database

import mongoose, { Schema, Document, Model } from 'mongoose'

interface wordTypes extends Document {
    word: string
    frequency: number
    date: Date
}

const wordSchema: Schema = new mongoose.Schema({
    word: String,
    frequency: Number,
    Date: {
        type: Date,
        default: Date.now(),
    },
})

let wordModel: Model<wordTypes, {}>

// using try catch to avoid schema recreation error
try {
    wordModel = mongoose.model<wordTypes>('Word', wordSchema)
} catch (e) {
    wordModel = mongoose.model<wordTypes>('Word')
}

export default wordModel

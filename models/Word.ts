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

let word: Model<wordTypes, {}>

try {
    word = mongoose.model<wordTypes>('Word', wordSchema)
} catch (e) {
    word = mongoose.model<wordTypes>('Word')
}

export default word

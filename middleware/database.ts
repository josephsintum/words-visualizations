// MongoDB connection endpoint middleware
// Connects to DB and returns mongoose connection in request

import mongoose from 'mongoose'
import { NextApiResponse } from 'next'
import { MiddlewareRequest } from './middleware'

export default async function database(
    req: MiddlewareRequest,
    res: NextApiResponse,
    next: () => any
) {
    if (!process.env.MONGO_URL) throw new Error('Missing MONGO_URL env var')
    const mongoURL = process.env.MONGO_URL

    if (
        mongoose.connection.readyState == 0 ||
        mongoose.connection.readyState == 3
    ) {
        try {
            await mongoose.connect(mongoURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
        } catch (err) {
            res.status(503).json(err)
            console.error(err)
            return
        }
    }

    mongoose.connection
        .on('error', (error) => console.error(error))
        .on('close', () => {
            mongoose.connection.removeAllListeners()
        })
        .once('open', () => console.log('DB successfully connected'))

    req.db = mongoose.connection

    return next()
}

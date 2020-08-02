// MongoDB connection endpoint middleware
// Connects to DB and returns mongoose connection in request

import mongoose, { Connection } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

interface dbMiddlewareRequest extends NextApiRequest {
    db: Connection
}

export default async function database(
    req: dbMiddlewareRequest,
    res: NextApiResponse,
    next: () => any
) {
    const MONGODB_URI = (() => {
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.MONGODB_URI)
                throw new Error('Missing MONGODB_URI env var')
            return process.env.MONGODB_URI
        }
        if (!process.env.MONGODB_TEST_URI)
            throw new Error('Missing MONGODB_TEST_URI env var')
        return process.env.MONGODB_TEST_URI
    })()

    if (
        mongoose.connection.readyState == 0 ||
        mongoose.connection.readyState == 3
    ) {
        try {
            await mongoose.connect(MONGODB_URI, {
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

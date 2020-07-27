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
    if (
        mongoose.connection.readyState == 0 ||
        mongoose.connection.readyState == 3
    ) {
        await mongoose
            .connect(
                process.env.MONGODB_URI ||
                    'mongodb://localhost:27017/Test?readPreference=primary&ssl=false',
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }
            )
            .catch((reason) => console.error({ DB_error: reason }))
    }

    mongoose.connection.on('error', (error) => console.error(error))
    mongoose.connection.once('open', () =>
        console.log('DB successfully connected')
    )
    req.db = mongoose.connection

    return next()
}

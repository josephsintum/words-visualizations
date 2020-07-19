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
    mongoose.connect(
        process.env.MONGODB_URI ||
            'mongodb://localhost:27017/Test?readPreference=primary&ssl=false',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    const db = mongoose.connection
    db.on('error', (error) => console.log(error))
    db.once('open', () => console.log('DB successfully connected'))
    req.db = db
    return next()
}

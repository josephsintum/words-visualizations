import { Db, MongoClient } from 'mongodb'

const client = new MongoClient(
    process.env.MONGODB_URI ||
        'mongodb://localhost:27017/?readPreference=primary&ssl=false',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

interface dbMiddlewareRequest {
    db: Db
    dbClient: MongoClient
}

export default async function database(
    req: dbMiddlewareRequest,
    res: any,
    next: () => any
) {
    if (!client.isConnected()) await client.connect()
    req.dbClient = client
    req.db = client.db(process.env.DB_NAME)
    return next()
}

import nextConnect from 'next-connect'
import middleware from '../../../middleware/middleware'
import { Db, ObjectID } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect()
handler.use(middleware)

interface MiddlewareRequest extends NextApiRequest {
    db: Db
}

handler.get(async (req: MiddlewareRequest, res: NextApiResponse) => {
    let user = await req.db
        .collection('newCollection')
        .insertOne({
            _id: new ObjectID(),
            calories: { label: 'Calories', total: 0, target: 0, variant: 0 },
            carbs: { label: 'Carbs', total: 0, target: 0, variant: 0 },
            fat: { label: 'Fat', total: 0, target: 0, variant: 0 },
            protein: { label: 'Protein', total: 0, target: 0, variant: 0 },
        })

    res.json({ hello: 'world' })
})

export default handler

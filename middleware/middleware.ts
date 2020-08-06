// Middleware

import nextConnect from 'next-connect'
import database from './database'
import { NextApiRequest } from 'next'
import mongoose from 'mongoose'

const middleware = nextConnect()

// adding global middleware here
middleware.use(database)

export default middleware

export interface MiddlewareRequest extends NextApiRequest {
    db: mongoose.Connection
}
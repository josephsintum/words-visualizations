// Middleware

import nextConnect from 'next-connect'
import database from './database'

const middleware = nextConnect()

// adding global middleware here
middleware.use(database)

export default middleware

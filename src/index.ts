import dotenv from 'dotenv'
dotenv.config({path: '.env'})
import app from './app'
import mongoose from 'mongoose'
import {createGQLSchema} from '@/graphql/schema'
import {ApolloServer} from 'apollo-server-express'
import http from 'http'

// Check for required environment variables. If not found, throw an error.
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'COGNITO_POOL_REGION', 'COGNITO_POOL_ID', 'COGNITO_CLIENT', 'AWS_KEY', 'AWS_SECRET', 'AWS_S3_BUCKET_NAME']
const missingVars = []
requiredEnvVars.forEach((v) => {
  if (!process.env[v]) {
    missingVars.push(v)
  }
})
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variable ${JSON.stringify(missingVars)}`)
}

// Connect to MongoDB
const dbConfig = {
  name: `${process.env.DB_NAME}`,
  user: `${process.env.DB_USER}`,
  pass: `${process.env.DB_PASS}`,
  host: `${process.env.DB_HOST}`
}

mongoose
  .connect(`mongodb+srv://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}/${dbConfig.name}?retryWrites=true&w=majority&authSource=admin&readPreference=primary&ssl=true`, {
    minPoolSize: 5,
    maxPoolSize: 100
  })
  .catch(async (error) => {
    throw new Error(error)
  })

const port = Number(process.env.PORT || 3000)

// Create Apollo Server
const startApolloGraphQLServer = async (_app: any) => {
  // Setup graphql server
  const schema = createGQLSchema()
  const server = new ApolloServer({
    schema,
    validationRules: [],
    introspection: process.env.NODE_ENV !== 'production',
    context: ({req}) => ({
      req
    })
  })
  // Start the server
  await server.start()

  // Apply app to server
  server.applyMiddleware({app: _app, path: '/graphql', cors: {credentials: true, origin: true}})

  const httpServer = http.createServer(_app)

  return httpServer
}

;(async () => {
  const httpServer = await startApolloGraphQLServer(app)

  httpServer.listen(port, () => {
    console.log(`🚀 Graphql Server ready at https://localhost:${port}/graphql`)
  })
})()

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

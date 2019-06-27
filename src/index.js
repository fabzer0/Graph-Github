const  { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const resolvers = require('./resolvers')

const options = {
  port: 7200,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

const server = new GraphQLServer({
  typeDefs: 'src/schema/app.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

server.start(options, ({ port }) => console.log(`Server is running in http://localhost:${port}`))

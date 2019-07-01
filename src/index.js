require('dotenv').config()
const  { GraphQLServer } = require('graphql-yoga')
const passport = require('passport')
const { prisma } = require('./generated/prisma-client')
const resolvers = require('./resolvers')
require('./utils/githubStrategy')

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
    const { user } = request.request
    return {
      ...request,
      prisma,
      user,
    }
  },
})

server.use(passport.initialize())
server.use('/auth/github', passport.authenticate('github'), () => {})
server.use('/auth/github/callback', passport.authenticate(
  'github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')
  }
)

server.start(options, ({ port }) => console.log(`Server is running in http://localhost:${port}`))

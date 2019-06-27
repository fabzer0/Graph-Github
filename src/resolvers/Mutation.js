const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { APP_SECRET } = require('../utils/auth')


async function signup(_, args, context) {
  const exists = await context.prisma.$exists.user({ email: args.email })
  if (exists) {
    throw new Error('User with that email address already exist')
  }

  const password = await bcrypt.hash(args.password, 10)
  const newUser = { ...args, password }
  const user = await context.prisma.createUser(newUser)
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token, 
    user
  }
}

async function login(_, { email, password }, context) {
  const user = await context.prisma.user({ email })
  if (!user) {
    throw new Error('User not Found!')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid Password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

module.exports = {
  signup,
  login,
}

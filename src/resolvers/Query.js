async function getUsers(_, _, context) {
  return await context.prisma.users()
}

module.exports = {
  getUsers
}

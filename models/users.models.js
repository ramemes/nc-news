const db = require('../db/connection')
const { checkExists } = require('../utils')

exports.fetchUsers = async () => {
    const queryResponse = await db.query(`
    SELECT * FROM users
    `)
    return queryResponse.rows
}

exports.fetchUserByUsername = async (username) => {

    await checkExists('users','username',username)

    const queryResponse = await db.query(`
    SELECT * FROM users
    WHERE username = $1`,[username])
    return queryResponse.rows[0]
}
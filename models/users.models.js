const db = require('../db/connection')
const { checkExists } = require('../utils')

exports.fetchUsers = async () => {
    const queryResponse = await db.query(`
    SELECT * FROM users
    `)
    return queryResponse.rows
}
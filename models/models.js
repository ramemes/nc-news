const db = require('../db/connection')

exports.fetchTopics = async () => {
    const topics = await db.query(`
    SELECT * FROM topics;
    `)
    return topics.rows
}
const db = require('../db/connection');
const fs = require('fs').promises;

exports.fetchTopics = async () => {
    const queryResponse = await db.query(`
    SELECT * FROM topics;
    `)
    return queryResponse.rows
}

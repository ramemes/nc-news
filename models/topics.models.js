const db = require('../db/connection');
const fs = require('fs').promises;

exports.fetchTopics = async () => {
    const {rows} = await db.query(`
    SELECT * FROM topics;
    `)
    return rows
}

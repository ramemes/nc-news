const db = require('../db/connection');
const apiEndPoints = require('../endpoints.json');
const fs = require('fs').promises;

exports.fetchTopics = async () => {
    const {rows} = await db.query(`
    SELECT * FROM topics;
    `)
    return rows
}

exports.fetchEndPoints = async () => {
    const apiEndPoints = await fs.readFile(`./endpoints.json`,'utf-8')
    return JSON.parse(apiEndPoints)

}
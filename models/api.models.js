const db = require('../db/connection');
const fs = require('fs').promises;


exports.fetchEndPoints = async () => {
    const apiEndPoints = await fs.readFile(`./endpoints.json`,'utf-8')
    return JSON.parse(apiEndPoints)

}
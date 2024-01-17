const format = require('pg-format');
const db = require('./db/connection')

exports.checkExists = async (table, column, value) => {
    const formatQuery = format(`
    SELECT * FROM %I 
    WHERE %I  = $1;`,table, column)

    const dbOutput = await db.query(formatQuery, [value])

    if (dbOutput.rows.length === 0) {
        return Promise.reject({status:404, msg: `${column} with value ${value} does not exist in ${table}`})
    }
}

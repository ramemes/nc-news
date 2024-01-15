const db = require('../db/connection');

exports.fetchArticle = async (article_id) => {
    
    const queryResponse = await db.query(`
    SELECT *
    FROM articles
    WHERE article_id = $1`,[article_id])
    if (queryResponse.rows.length === 0) {
        return Promise.reject({status:404, msg: `article with ID: ${article_id} does not exist`})
    } else return queryResponse.rows[0]
}

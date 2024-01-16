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

exports.fetchArticles = async () => {
    const queryResponse = await db.query(`
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC 
    `)
    console.log(queryResponse.rows)
    return queryResponse.rows
}
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
        COUNT(comments) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC 
    `)
    return queryResponse.rows
}

exports.fetchArticleComments = async (article_id) => {
    const queryResponse = await db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [article_id])
    if (queryResponse.rows.length === 0) {
        return Promise.reject({status:404, msg: `article with ID: ${article_id} does not exist`})
    } 
    return queryResponse.rows
}

exports.insertArticleComment = async (article_id, username, body) => {
   
    const queryResponse = await db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `, [article_id, username, body])
    console.log(queryResponse.rows[0])
    return queryResponse.rows[0]
}
const db = require('../db/connection');
const { checkExists } = require('../utils')

exports.fetchArticle = async (article_id) => {
    
    await checkExists('articles','article_id',article_id)
    
    const queryResponse = await db.query(`
    SELECT *
    FROM articles
    WHERE article_id = $1`,[article_id])
    
    return queryResponse.rows[0]
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

    await checkExists('articles','article_id',article_id)

    const queryResponse = await db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [article_id])

    return queryResponse.rows
}


exports.insertArticleComment = async (article_id, username, body) => {
   

    await checkExists('articles','article_id',article_id)

    const queryResponse = await db.query(`
    INSERT INTO comments
        (article_id, author, body)
    VALUES
        ($1, $2, $3)
    RETURNING *
    `, [article_id, username, body])

    return queryResponse.rows[0]
}
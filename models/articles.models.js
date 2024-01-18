const db = require('../db/connection');
const { checkExists } = require('../utils')

exports.fetchArticle = async (article_id) => {
    
    await checkExists('articles','article_id',article_id)
    
    const queryResponse = await db.query(`
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.body,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments) ::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,[article_id])
    
    return queryResponse.rows[0]
}

exports.fetchArticles = async (topic) => {

    const queryValues = []
    let queryStr =  `
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
    `
    if (topic) {
        await checkExists('topics','slug',topic)
        queryValues.push(topic)
        queryStr += `WHERE articles.topic = $1`
    }

    queryStr += ` GROUP BY articles.article_id
    ORDER BY created_at DESC `

    const queryResponse = await db.query(queryStr, queryValues)
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

exports.updateArticle = async (article_id, inc_votes) => {
    
    await checkExists('articles','article_id',article_id)

    const queryResponse = await db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
    `,[inc_votes, article_id])

    return queryResponse.rows[0]
}
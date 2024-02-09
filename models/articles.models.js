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

exports.fetchArticles = async (topic, sort_by='created_at', order='desc') => {
    if (!['title', 'topic','votes','author','body','created_at','article_img_url, comment_count'].includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Invalid sort query'})
    }
    if (!['desc', 'asc'].includes(order)) {
        return Promise.reject({status: 400, msg: 'Invalid order query'})
    }

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

    if (sort_by === "comment_count") {
        queryStr += ` GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order} ` 
    } else {
        queryStr += ` GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order} `
    }



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
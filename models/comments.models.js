const db = require('../db/connection');
const { checkExists } = require('../utils')

exports.removeComment = async (comment_id) => {

    await checkExists('comments', 'comment_id', comment_id)

    const queryResponse = await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *
        `, [comment_id]
    )
    return queryResponse.rows
}

exports.updateComment = async (comment_id, inc_votes) => {
    
    await checkExists('comments', 'comment_id', comment_id)

    const queryResponse = await db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *
    `, [inc_votes, comment_id])

    return queryResponse.rows[0]
}
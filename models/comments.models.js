const db = require('../db/connection');
const { checkExists } = require('../utils')

exports.removeComment = async (comment_id) => {

    await checkExists('comments', 'comment_id', comment_id)

    const queryResponse = await db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    `, [comment_id]
    )
    return queryResponse.rows
}
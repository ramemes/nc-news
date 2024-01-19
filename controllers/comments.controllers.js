const {removeComment, updateComment} = require('../models/comments.models')

exports.deleteComment = async (req, res, next) => {
    try {
        const {comment_id} = req.params
        await removeComment(comment_id)
        res.status(204).send()
    }
    catch(err) {
        next(err)
    }
}

exports.patchComment = async (req, res, next) => {
    try {
        const { comment_id } = req.params
        const { inc_votes } = req.body
        
        const comment = await updateComment(comment_id, inc_votes)
        res.status(200).send({comment:comment})
    }
    catch(err) {
        next(err)
    }
}
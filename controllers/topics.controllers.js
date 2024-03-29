const { fetchTopics } = require('../models/topics.models')



exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics: topics})
    }
    catch(err) {
        next(err)
    }
}



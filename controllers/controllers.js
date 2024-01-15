const { fetchTopics } = require('../models/models')



exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics: topics})
    }
    catch(err) {
        console.log(err)
        next(err)
    }
}
const { fetchArticle } = require('../models/articles.models')



exports.getArticle = async (req, res, next) => {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics: topics})
    }
    catch(err) {
        next(err)
    }
}



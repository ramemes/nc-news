const { fetchTopics, fetchEndPoints } = require('../models/models')



exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchTopics()
        res.status(200).send({topics: topics})
    }
    catch(err) {
        next(err)
    }
}


exports.getEndPoints = async (req, res, next) => {
    try {
        const apiEndPoints = await fetchEndPoints()
        res.status(200).send({apiEndPoints: apiEndPoints})
    }
    catch(err) {
        console.log(err)
        next(err)
    }
}
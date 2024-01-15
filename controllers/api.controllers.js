const { fetchEndPoints } = require('../models/api.models')


exports.getEndPoints = async (req, res, next) => {
    try {
        const apiEndPoints = await fetchEndPoints()
        res.status(200).send({apiEndPoints: apiEndPoints})
    }
    catch(err) {
        next(err)
    }
}
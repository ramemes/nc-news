const { fetchUsers } = require('../models/users.models')


exports.getUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers()
        res.status(200).send({users: users})
    }
    catch(err) {
        next(err)
    }
}
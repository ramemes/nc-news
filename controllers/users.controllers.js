const { fetchUsers, fetchUserByUsername } = require('../models/users.models')


exports.getUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers()
        res.status(200).send({users: users})
    }
    catch(err) {
        next(err)
    }
}

exports.getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params
        const user = await fetchUserByUsername(username)
        res.status(200).send({user: user})
    }
    catch (err) {
        next(err)
    }
}
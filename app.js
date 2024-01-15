const express = require('express');
const { getTopics } = require('./controllers/controllers')

const app = express();
app.use(express.json())
//next(err)


app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    if (err.status = 404) {
        res.status(404).send({msg: err.msg})
    }
    next(err)
})
app.use((err, req, res, next) => {
    if (err.status = 500) {
        res.status(500).send({msg: err.msg})
    }
    next(err)
})

module.exports = app
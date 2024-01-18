const express = require('express');

const apiRouter = require('./routes/api-router')

const app = express();
app.use(express.json())


app.use('/api', apiRouter)


app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({msg: err.msg})
    }
    next(err)
})
app.use((err, req, res, next) => {
    if (err.status === 500) {
        res.status(500).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg : "invalid format"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({msg : err.detail})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({msg : `request body is missing parameters`})
    }
    next(err)
})

module.exports = app
const express = require('express');

const { getEndPoints } = require('./controllers/api.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticle } = require('./controllers/articles.controllers')
const { getArticles } = require('./controllers/articles.controllers')

const app = express();
app.use(express.json())

app.get('/api', getEndPoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.get('/api/articles', getArticles)

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
        res.status(400).send({msg : "invalid article id format"})
    }
    next(err)
})

module.exports = app
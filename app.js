const express = require('express');

const { getEndPoints } = require('./controllers/api.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticle, getArticles, getArticleComments, postArticleComment } = require('./controllers/articles.controllers')

const app = express();
app.use(express.json())

app.get('/api', getEndPoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postArticleComment)




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

app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({msg : err.detail})
    }
    next(err)
})

app.use((err, req, res, next) => {
    const { username, body } = req.body
    const both = !username && !body ? ' and ' : ''
    if (err.code === '23502') {
        res.status(400).send({msg : `request body is missing ${!username ? 'username' : '' }${both}${!body ? 'body' : '' }`})
    }
    next(err)
})

module.exports = app
const { fetchArticle, fetchArticles, fetchArticleComments, insertArticleComment, updateArticle, insertArticle } = require('../models/articles.models')


exports.getArticle = async (req, res, next) => {
    try {
        const {article_id} = req.params
        
        const article = await fetchArticle(article_id)
        res.status(200).send({article: article})
    }
    catch(err) {
        next(err)
    }
}


exports.getArticles = async (req, res, next) => {
    try {
        const { topic, sort_by, order } = req.query
        const articles = await fetchArticles(topic, sort_by, order)
        res.status(200).send({articles: articles})
    }
    catch(err) {
        next(err)
    }
}

exports.getArticleComments = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const comments = await fetchArticleComments(article_id)

        res.status(200).send({comments : comments})
    }
    catch(err) {
        next(err)
    }
}

exports.postArticleComment = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const { username, body } = req.body

        const comment = await insertArticleComment(article_id, username, body)
        res.status(201).send({comment: comment})
    }
    catch(err) {
        next(err)
    }
}

exports.patchArticle = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const { inc_votes } = req.body
        
        const article = await updateArticle(article_id, inc_votes)
        res.status(200).send({article:article})
    }
    catch (err) {
        next(err)
    }
}

exports.postArticle = async (req, res, next) => {
    try {

        const { title, topic, username, body, article_img_url } = req.body

        const article = await insertArticle(title, topic, username, body, article_img_url)
        res.status(201).send({article: article})
    }
    catch(err) {
        next(err)
    }
}
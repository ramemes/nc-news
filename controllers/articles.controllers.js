const { fetchArticle, fetchArticles, fetchArticleComments, insertArticleComment, updateArticle } = require('../models/articles.models')


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
        const articles = await fetchArticles()
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

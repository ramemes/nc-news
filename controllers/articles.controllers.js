const { fetchArticle, fetchArticles, fetchArticleComments } = require('../models/articles.models')


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
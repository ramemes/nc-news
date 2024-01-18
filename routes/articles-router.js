const articlesRouter = require('express').Router()

const { getArticle, getArticles, getArticleComments, postArticleComment, patchArticle } = require('../controllers/articles.controllers')



articlesRouter.route('/')
    .get(getArticles)

articlesRouter.route('/:article_id/comments')
    .get(getArticleComments)
    .post(postArticleComment)

articlesRouter.route('/:article_id')
    .get(getArticle)
    .patch(patchArticle)



module.exports = articlesRouter
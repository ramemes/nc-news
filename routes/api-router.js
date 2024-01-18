const apiRouter = require('express').Router();

const { getEndPoints } = require('../controllers/api.controllers')

const articlesRouter = require('./articles-router');
const topicsRouter = require('./topics-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');


apiRouter.route('/')
    .get(getEndPoints)

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);


module.exports = apiRouter
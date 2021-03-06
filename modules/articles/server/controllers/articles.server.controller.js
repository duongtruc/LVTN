'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Article = mongoose.model('Article'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
    var article = new Article(req.body);
    article.user = req.user;
    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
    res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
    var article = req.article;
    var body = req.body;
    if (body.newReply && body.newReply.trim() !== '') {
        var newReply = {
            is_public: true,
            user: req.user,
            content: body.newReply
        };
        delete body.newReply;
        body.responses.push(newReply);
    }
    for (var key in body) {
        if (key === "type" || key === "priority") {
            body[key] = parseInt(body[key]);
        }
        article[key] = body[key];
    }
    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;

    article.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
            console.log(articles);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Article is invalid'
        });
    }
    Article.findById(id)
        .populate([{path: "user", select: "displayName"}, {path: "responses.user", select: "displayName"}])
        .exec(function (err, article) {
        if (err) {
            return next(err);
        } else if (!article) {
            return res.status(404).send({
                message: 'No article with that identifier has been found'
            });
        }
        req.article = article;
        next();
    });
};

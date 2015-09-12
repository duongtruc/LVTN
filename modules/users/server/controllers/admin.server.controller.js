'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: 'cskh.lvtn@gmail.com',
        pass: 'tuyennguyen'
    }
});

/**
 * Show the current user
 */
exports.read = function (req, res) {
    res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
    var user = req.model;

    //For security purposes only merge these parameters
    user.firstName = req.body.firstName;
    user.displayName = user.firstName;
    user.roles = req.body.roles;

    user.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
    var user = req.model;

    user.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
    User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(users);
    });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findById(id, '-salt -password').exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load user ' + id));
        }

        req.model = user;
        next();
    });
};

exports.newuser = function (req, res) {

    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.displayName = user.firstName;

    var em = user.email; //email to send
    var us = user.displayName;

    var pass = Math.random().toString(36).slice(-8);
    user.password = pass;
    req.body.password = pass;
    req.body.roles = [user.roles];

    // Then save the user
    user.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });

    var mailOptions = {
        from: "CSKH LVTN <cskh.lvtn@gmail.com>",
        to: em,
        subject: "Tai Khoan CSKH",
        headers: {
            'X-Laziness-level': 1000
        },

        // plaintext body
        text: "Chào " + us + "," +
            "\n\n" +
            "Đây là tài khoản và mật khẩu của bạn:\n\n" +
            "Tài khoản: " + em +
            "\n" +
            "Mật khẩu: " + pass
    };

    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
};

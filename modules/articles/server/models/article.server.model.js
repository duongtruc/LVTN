'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Response Schema
 */
var ResonseSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    is_public: Boolean,
    content: {
        type: String,
        require: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    priority: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    requester: {
        type: Schema.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    assignee: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: Number,
    responses: [ResonseSchema]
});

mongoose.model('Article', ArticleSchema);

'use strict'

const { SuccessResponses } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponses({
            message: "Create new comment successfully",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
    getCommentsByParentId = async (req, res, next) => {
        console.log(req.params)
        new SuccessResponses({
            message: "Get all comments belong parentId successfully",
            metadata: await CommentService.getCommentByParentCommentId(req.body)
        }).send(res)
    }
    deleteComment = async (req, res, next) => {
        new SuccessResponses({
            message: "Delete comment successfully",
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController()
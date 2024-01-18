'use strict'
const { NotFoundError } = require('../core/error.response');
const commentSchema = require('../models/comment.model');
const { convertStringToObjectId } = require('../utils');

/**
 * keyFeatures: {
 * addComment
 * get a List of comments
 * delete a comment 
 * 
 * 
 * @class CommentService
 * @description: comment service
 * @method createComment: create comment
 * @method getComment: get comment
 * @method getComments: get comments
 * @method updateComment: update comment
 * @method deleteComment: delete comment
 * @returns comment
 */
class CommentService {
    static async createComment({
        productId, userId,
        content, parentCommentId = null
    }) {
        try {
            const comment = await commentSchema.create({
                comment_productId: productId,
                comment_userId: userId,
                comment_content: content,
                comment_parentId: parentCommentId
            })

            if (!comment) {
                throw new NotFoundError('Comment not found')
            }

            //  find by binary tree [Left, Right]
            let rightValue;
            if (parentCommentId) {
                //  reply comment
                const parentComment = await commentSchema.findOne({
                    _id: convertStringToObjectId(parentCommentId)
                }, 'comment_right');

                console.log("parentComment", parentComment)
                if (!parentComment) {
                    throw new NotFoundError('Comment not found')
                }

                rightValue = parentComment.comment_right;

                await commentSchema.updateMany({
                    comment_productId: convertStringToObjectId(productId),
                    comment_left: { $gt: rightValue }
                }, {
                    $inc: { comment_left: 2 }
                })


                await commentSchema.updateMany({
                    comment_productId: convertStringToObjectId(productId),
                    comment_right: { $gte: rightValue }
                }, {
                    $inc: { comment_right: 2 }
                })

            } else {
                const commentMaxRight = await commentSchema.findOne({
                    comment_productId: convertStringToObjectId(productId)
                }, 'comment_right').sort({ comment_right: -1 });

                console.log({ commentMaxRight })
                if (commentMaxRight) {
                    rightValue = commentMaxRight.comment_right + 1;
                } else {
                    rightValue = 1;
                }
            }

            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;

            await comment.save()
            return comment
        } catch (error) {
            throw error
        }
    }
    static async getCommentByParentCommentId({
        productId,
        parentCommentId,
        limit = 10,
        offset = 0
    }) {
        try {
            const parentComment = await commentSchema.findOne({
                _id: convertStringToObjectId(parentCommentId),
                comment_productId: convertStringToObjectId(productId),
            }).limit(limit).skip(offset)

            if (!parentComment) {
                throw new NotFoundError('Parent comment not found')
            }

            const comments = await commentSchema.find({
                comment_productId: parentComment.comment_productId,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right }
            })

            if (!comments) {
                throw new NotFoundError('Comments not found with parent comment', parentCommentId)
            }
            return comments;
        } catch (error) {
            throw error
        }
    }

    static async updateComment(commentId, updateComment) {
        try {
            const comment = await commentSchema.findByIdAndUpdate(commentId, updateComment, { new: true })
            return comment
        } catch (error) {
            throw error
        }
    }

    /**
     * @description: delete comment by id  
     * @param {comment_productId, commentId}
     * @returns comment
     */

    /* 
     *  ==============Step by Step ==============
     *  find comment by id 
     *  get left and right value of comment => return width range of deleted comment
     *  delete comments in range of left and right value of deleted comment
     *  minus left and right value of comment by width range of deleted comment 
     *  ========================================
     */
    static async deleteComment({
        comment_productId,
        commentId
    }) {
        try {

            const comments = await commentSchema.find({
                comment_productId: convertStringToObjectId(comment_productId)
            })

            if (!comments) {
                throw new NotFoundError('Comments not found')
            }

            //  get all comments belong to productId
            const comment = await commentSchema.findOne({
                _id: convertStringToObjectId(commentId),
                comment_productId: convertStringToObjectId(comment_productId),
            })

            if (!comment) {
                throw new NotFoundError('Comment not found')
            }

            const leftComment = comment.comment_left;
            const rightComment = comment.comment_right;
            const width = rightComment - leftComment + 1;

            // delete comments self and children
            const deleteComment = await commentSchema.deleteMany({
                comment_productId: convertStringToObjectId(comment_productId),
                comment_left: { $gte: leftComment },
                comment_right: { $lte: rightComment }
            })

            if (!deleteComment) {
                throw new NotFoundError('Delete comment unsuccessfully')
            }

            await commentSchema.updateMany({
                comment_productId: convertStringToObjectId(comment_productId),
                comment_left: { $gt: leftComment }
            }, {
                $inc: { comment_left: -width }
            })

            await commentSchema.updateMany({
                comment_productId: convertStringToObjectId(comment_productId),
                comment_right: { $gt: rightComment }
            }, {
                $inc: { comment_right: -width }
            })

            return deleteComment;
        } catch (error) {
            throw error
        }
    }
}

module.exports = CommentService
const express = require("express")
const router = express.Router()

const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils");
const commentController = require("../../controllers/comment.controller");

router.use(authenticationV2);
router.post("/", asyncHandler(commentController.createComment))
router.post("/get-comments-by-parent", asyncHandler(commentController.getCommentsByParentId))
router.delete("/delete-comment-by-id", asyncHandler(commentController.deleteComment))
module.exports = router
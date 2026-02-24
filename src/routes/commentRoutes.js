// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  listComments,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

router.post("/tickets/:id/comments", protect, addComment);

router.get("/tickets/:id/comments", protect, listComments);

router.patch("/comments/:id", protect, editComment);

router.delete("/comments/:id", protect, deleteComment);

module.exports = router;
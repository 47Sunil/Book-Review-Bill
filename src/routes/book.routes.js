import { Router } from "express";
import {
    saveBooks,
    getAllBooks,
    getBookById,
    submitReview,
    updateReview,
    deleteReview,
    searchBooks

} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
// Book
router.route("/").post(verifyJWT, saveBooks)
router.route("/").get(verifyJWT, getAllBooks)
router.route("/search").get(verifyJWT, searchBooks)
router.route("/:id").get(verifyJWT, getBookById)

// Reviews
router.route("/:id/reviews").post(verifyJWT, submitReview)
router.route("/reviews/:id").put(verifyJWT, updateReview)
router.route("/reviews/:id").delete(verifyJWT, deleteReview)




export default router
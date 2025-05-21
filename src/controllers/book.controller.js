import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Book } from "../models/book.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { paginateResults } from "../utils/filter_pagination.js";
import { Review } from "../models/book.model.js";

// Save books
const saveBooks = asyncHandler(async (req, res) => {
    const { title, genre } = req.body
    // console.log("body: ", req.body);

    if (
        [title, genre].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const book = await Book.create({
        title, genre, author: req.user?._id
    })

    return res.status(201).json(
        new ApiResponse(201, "Book saved Successfully")
    )

})

// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    const { author: authorUsername, genre, page = 1, limit = 10 } = req.query;

    // Build the filter object
    const filter = {};

    // Only add genre to filter if provided (exact match)
    if (genre) {
        filter.genre = genre;
    }

    const { results: books, pagination } = await paginateResults(Book, {
        page,
        limit,
        filter, // Regular filter for exact genre match
        search: {
            authorUsername // Search for author username (partial match)
        },
        populate: [{
            path: 'author',
            select: 'userName email'
        }]
    });

    if (books.length === 0) {
        message = "No books found";

        if (genre || authorUsername) {
            message = "No books matching your filters";

            if (genre && authorUsername) {
                message = `No books found for genre "${genre}" and author "${authorUsername}"`;
            } else if (genre) {
                message = `No books found in genre "${genre}"`;
            } else if (authorUsername) {
                message = `No books found for author "${authorUsername}"`;
            }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, {
            books,
            pagination,
            filters: {
                ...(genre && { genre }),
                ...(authorUsername && { author: authorUsername })
            }
        }, "Books fetched successfully")
    );
});

// Get book by id
const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.status(200).json(
        new ApiResponse(200, book, "Book fetched successfully")
    )
})

// Submit a review 
const submitReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Please provide a valid rating between 1 and 5");
    }

    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // Check if user already reviewed this book
    const existingReviewIndex = book.reviews.findIndex(
        r => r.user.toString() === userId.toString()
    );

    if (existingReviewIndex >= 0) {
        throw new ApiError(400, "You have already reviewed this book");
    }

    const createdReview = await Review.create({
        book_id: id,
        user: userId,
        rating,
        review: review || ""
    })

    // Add new review
    book.reviews.push(createdReview);

    // Update rating stats
    await book.updateRatingStats();

    return res.status(201).json(
        new ApiResponse(201, book, "Review submitted successfully")
    );
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { review, rating } = req.body;
    const userId = req.user._id;

    const findReview = await Review.findById(id);
    if (!findReview) {
        throw new ApiError(404, "Review not found");
    }

    // Authorization check
    if (findReview.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this review");
    }

    // Update the review
    findReview.review = review || "";
    findReview.rating = rating;
    const updatedReview = await findReview.save();


    // Update the review in book
    const book = await Book.findById(findReview.book_id);
    const reviewToUpdate = book.reviews.id(id);
    reviewToUpdate.rating = rating;
    reviewToUpdate.review = review || "";

    // Update rating stats
    await book.updateRatingStats();

    return res.status(200).json(
        new ApiResponse(200, updatedReview, "Review updated successfully")
    );
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("id: ", id);

    const findReview = await Review.findById(id);
    if (!findReview) {
        throw new ApiError(404, "Review not found");
    }

    // Authorization check
    if (findReview.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    // Delete the review
    await findReview.deleteOne();


    // Update rating stats
    const book = await Book.findById(findReview.book_id);

    // Remove the review
    book.reviews.pull(id);

    // Update rating stats
    await book.updateRatingStats();


    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

// Search for books
const searchBooks = asyncHandler(async (req, res) => {
    const { author: authorUsername, title, page = 1, limit = 10 } = req.query;

    const { results: books, pagination } = await paginateResults(Book, {
        page,
        limit,
        search: {
            title,
            authorUsername
        },
        populate: [{
            path: 'author',
            select: 'userName email'
        }]
    });

    return res.status(200).json(
        new ApiResponse(200, {
            books,
            pagination
        }, books.length ? "Books fetched successfully" : "No books found")
    );
});

export {
    saveBooks,
    getAllBooks,
    getBookById,
    submitReview,
    updateReview,
    deleteReview,
    searchBooks
}
import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    book_id: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [reviewSchema],  // Embedded sub-document
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate average rating whenever reviews change
BookSchema.methods.updateRatingStats = async function () {
    const book = this;
    if (book.reviews.length > 0) {
        const sum = book.reviews.reduce((acc, { rating }) => acc + rating, 0);
        book.averageRating = parseFloat((sum / book.reviews.length).toFixed(1));
    } else {
        book.averageRating = 0;
    }
    book.reviewCount = book.reviews.length;
    await book.save();
    return book;
};

export const Book = mongoose.model("Book", BookSchema);
export const Review = mongoose.model("Review", reviewSchema);







import { User } from "../models/user.model.js";

const buildSearchQuery = async (searchParams = {}) => {
    const { title, authorUsername, genre } = searchParams;
    const query = {};

    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    if (genre) {
        query.genre = { $regex: genre, $options: 'i' };
    }

    if (authorUsername) {
        const users = await User.find({
            userName: { $regex: authorUsername, $options: 'i' }
        }).select('_id');

        if (users.length > 0) {
            query.author = { $in: users.map(user => user._id) };
        } else {
            // Return a query that will match no documents
            return { _id: { $in: [] } };
        }
    }

    return query;
};

const paginateResults = async (model, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate = [],
        filter = {},
        search = {}
    } = options;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Build search query if search parameters exist
    const searchQuery = await buildSearchQuery(search);

    // Combine all query conditions
    const finalQuery = { ...filter, ...searchQuery };


    const totalResults = await model.countDocuments(finalQuery);

    // If no results and we're beyond page 1, return empty
    if (totalResults === 0 && pageNum > 1) {
        return {
            results: [],
            pagination: {
                currentPage: pageNum,
                totalPages: 0,
                totalResults: 0,
                resultsPerPage: limitNum
            }
        };
    }

    // Query with pagination
    let queryBuilder = model.find(finalQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort(sort);

    // Apply population if specified
    if (populate.length > 0) {
        populate.forEach(populateOption => {
            queryBuilder = queryBuilder.populate(populateOption);
        });
    }

    const results = await queryBuilder.exec();

    return {
        results,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalResults / limitNum),
            totalResults,
            resultsPerPage: limitNum
        }
    };
};

export { paginateResults }
# Book-Review-Bill

# Bii

## Mini Assignment: Book Review API

### Objective:

- Build a RESTful API using Node.js (with Express) for a basic Book Review system. This assignment is designed to assess your understanding of backend fundamentals, authentication, and clean API design

## Tech Stack used:

- Node.js with Express.js
- database (MongoDB)
- JWT for authentication
- bcrypt

## variables in .env file

- PORT
- MONGODB_URI (use your URI)
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRY
- DB_NAME

## Project setup instructions

- pull the code
- run npm i for installing all the dependencies
- npm start to run the application

### Models

- User Model

```yaml
{
  userName: { string, mandatory, unique },
  fullName: { string, mandatory },
  email: { string, mandatory, unique },
  password: { string, mandatory },
  createdAt: { timestamp },
  updatedAt: { timestamp },
}
```

- Books Model

```yaml
{
  title: { string, mandatory },
  genre: { string, mandatory },
  author: { ObjectId, mandatory, refs to user model },
  reviews: [reviewSchema],
  averageRating: { Number, default:0, min:0, max:5 },
  reviewCount: { Number, default:0) },
  createdAt: { timestamp },
  updatedAt: { timestamp },
}
```

- Review Model (Books review)

```yaml
{
  book_id: { ObjectId, mandatory, refs to book model },
  user: { ObjectId, mandatory, refs to user model },
  reviewedAt: { Date, mandatory },
  rating: { number, min 1, max 5, mandatory },
  review: { string, mandatory },
}
```

## User APIs

### POST /signup

- url => localhost:8000/api/v1/users/signup

## Request body

```yaml
{
  "fullName": "Sunil Tiwari",
  "email": "S471@gmail.com",
  "userName": "User1234",
  "password": "User123456",
}
```

### POST /login

- url => localhost:8000/api/v1/users/login

## Request body

```yaml
{ "email": "S471@gmail.com", "userName": "User1234", "password": "User123456" }
```

### POST /logout

- url => localhost:8000/api/v1/users/logout

## Request body

```yaml
{ "email": "S471@gmail.com", "userName": "User1234", "password": "User123456" }
```

### POST /change-password

- url => localhost:8000/api/v1/users/change-password

## Request body

```yaml
{ "oldPassword": "S47", "newPassword": "S474551", "confirmPassword": "S474551" }
```

## Book APIs

### POST /books

- url => localhost:8000/api/v1/books

## Request body

```yaml
{ "title": "New Age", "genre": "Atom" }
```

### GET /books

- Get all books (with pagination and optional filters by author and genre)
- url => localhost:8000/api/v1/books?author=sunil471&genre=Atom

### GET /books/:id

- url => localhost:8000/api/v1/books/682db8df133482b540101276

### GET /books/search

- search – Search books by title or author (partial and case-insensitive)
- url => localhost:8000/api/v1/books/search?title=N

## Review APIs

### POST /books/:id/reviews

- url => localhost:8000/api/v1/books/682db8df133482b540101276/reviews
- Submit a review (Authenticated users only, one review per user per book)

## Request body

```yaml
{ "rating": 4, "review": "Great!" }
```

### PUT /reviews/:id

- url => localhost:8000/api/v1/books/reviews/682dc01f24d8cc4c6b977f7c
- Update your own review

## DELETE /reviews/:id

- url => localhost:8000/api/v1/books/reviews/682dc09424d8cc4c6b977f9f
- Delete your own review

### Authentication

- All the books and review routes are protected.

### Authorisation

- only the user created the review can edit or delete the review.

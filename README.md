# 📚 Bookstore API

A **RESTful API** built with **Node.js**, **Express**, and **TypeScript** for managing a bookstore's inventory. It supports full **CRUD** operations, **JWT-based authentication**, **pagination**, and **filtering**.

---

## 🚀 Features

* ✅ Full CRUD operations for books
* 🔐 JWT-based authentication
* 📁 File-based data persistence (`users.json`, `books.json`)
* 🧄 Clean middleware & modular structure
* 📝 Request logging
* 🛡️ Global error handling
* 📆 Type-safe with TypeScript
* 📊 Pagination & filtering support
* 📄 Swagger API documentation
* 🧪 Comprehensive test suite (Jest + Supertest)

---

## 📋 Prerequisites

* **Node.js** v14 or higher
* **npm** v6 or higher

---

## 🛠️ Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd bookstore-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create `.env` file**:

   ```env
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

4. **Start the server**:

   ```bash
   # For development
   npm run dev

   # For production
   npm run build && npm start
   ```

---

## 🔑 API Testing Guide (Postman)

### 🔗 Base URL

```
http://localhost:3000/api
```

---

## 🧑‍💻 Authentication Endpoints

### 1. Register

* **POST** `/register`

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login

* **POST** `/login`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

🔐 Successful login returns a `token` for authorization.

---

## 📚 Book Management Endpoints

> ⚠️ All routes below require the `Authorization: Bearer <your-jwt-token>` header.

### 1. Get All Books

* **GET** `/books`
* **Optional Query Parameters**:

  * `page`: Default `1`
  * `limit`: Default `10`
  * `genre`: Filter by genre

🔍 Example:

```
GET /books?genre=Fiction&page=1&limit=10
```

### 2. Get Book by ID

* **GET** `/books/:id`

### 3. Create Book

* **POST** `/books`

```json
{
  "title": "Test Book",
  "author": "Test Author",
  "genre": "Fiction",
  "publishedYear": 2024
}
```

### 4. Update Book

* **PUT** `/books/:id`

```json
{
  "title": "Updated Book",
  "author": "Author Name",
  "genre": "Non-Fiction",
  "publishedYear": 2024
}
```

### 5. Delete Book

* **DELETE** `/books/:id`

---

## ❌ Common Error Responses

* **401 Unauthorized**:

  * "No token provided"
  * "Invalid token"
  * "Token expired"

* **400 Bad Request**:

  * Missing fields or invalid input

* **403 Forbidden**:

  * Unauthorized action

* **404 Not Found**:

  * "Book not found"

* **500 Internal Server Error**

---

## 🎓 Testing with Postman

1. Create a Postman environment:

   * `baseUrl = http://localhost:3000/api`
   * `token = <paste from login response>`

2. Set the `Authorization` header:

   ```
   Authorization: Bearer {{token}}
   ```

3. Use `{{baseUrl}}` in your endpoints.

4. Test various queries:

   ```
   {{baseUrl}}/books?page=1&limit=5&genre=Fiction
   ```

---

## 📂 API Documentation

Access Swagger UI at:

```
http://localhost:3000/api-docs
```

Includes:

* Endpoint descriptions
* Input/output schemas
* Try-out functionality
* Token-auth headers

---

## 🔍 Pagination & Filtering

Use on `GET /books`:

### Pagination

* `page`, `limit`

```bash
GET /books?page=1&limit=5
```

### Filtering

* `genre`

```bash
GET /books?genre=Fiction
```

Combined:

```bash
GET /books?genre=Mystery&page=2&limit=5
```

Example Response:

```json
{
  "data": [...],
  "pagination": {
    "total": 25,
    "totalPages": 3,
    "currentPage": 2,
    "limit": 5,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

---

## 🧪 Testing

Run tests using Jest + Supertest:

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

Covers:

* Authentication
* Book CRUD
* Middleware
* Validation
* Pagination/Filtering

---

## 📅 Important Notes

* Only authenticated users can access book routes
* Users can only modify/delete their own books
* JWT tokens expire after 24 hours
* All responses are in JSON
* All endpoints are prefixed with `/api`

---

## 🔒 Error Format Example

```json
{
  "message": "Error message here"
}
```

---

## 🗄️ Data Storage

* `data/users.json` - user records
* `data/books.json` - book records

---

## 📃 Project Structure

```
bookstore-api/
├── src/
│   ├── controllers/        # Route handlers
│   ├── routes/             # Route definitions
│   ├── middleware/         # Custom middleware
│   ├── models/             # Interfaces & schemas
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   └── index.ts            # Entry point
├── data/                   # JSON-based storage
│   ├── users.json
│   └── books.json
├── tests/                  # Jest + Supertest
└── ...
```

---

## 🔍 Query Parameters Reference

### Pagination

```bash
GET /books?page=2&limit=5
```

### Filtering

```bash
GET /books?genre=Science%20Fiction
```

### Combined

```bash
GET /books?genre=Fiction&page=3&limit=5
```

---

## 🔌 cURL Examples

### Register

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Get Books

```bash
curl http://localhost:3000/api/books?page=1&limit=5&genre=Fiction \
  -H "Authorization: Bearer <your-token>"
```

### Create Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"New Book","author":"Author","genre":"Fiction","publishedYear":2024}'
```

### Update Book

```bash
curl -X PUT http://localhost:3000/api/books/<book-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Updated Book","author":"Author","genre":"Non-Fiction","publishedYear":2024}'
```

### Delete Book

```bash
curl -X DELETE http://localhost:3000/api/books/<book-id> \
  -H "Authorization: Bearer <your-token>"
```

---
# nodejsAssingment

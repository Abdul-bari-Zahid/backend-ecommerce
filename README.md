E-Commerce API Documentation
🌐 Base URL
http://localhost:3001/api

🔑 Headers
{
  "Content-Type": "application/json"
}

👤 User APIs
1️⃣ Create User

POST /users

{
  "firstName": "Abdul",
  "lastName": "Bari",
  "email": "abdul@example.com",
  "phone": "03001234567",
  "password": "123456"
}


Response:

{
  "message": "User created successfully",
  "data": { "acknowledged": true, "insertedId": "66cfabc123" }
}

2️⃣ Get All Users

GET /users

Response:

[
  { "_id": "66cfabc123", "firstName": "Abdul", "lastName": "Bari", "email": "abdul@example.com", "phone": "03001234567" }
]

3️⃣ Get Single User

GET /users/:id

Response:

{
  "_id": "66cfabc123",
  "firstName": "Abdul",
  "lastName": "Bari",
  "email": "abdul@example.com",
  "phone": "03001234567"
}

4️⃣ Update User

PUT /users/:id

{
  "firstName": "Updated",
  "phone": "03009998888"
}


Response:

{ "message": "User updated successfully" }

5️⃣ Delete User

DELETE /users/:id

Response:

{ "message": "User deleted successfully" }

📦 Product APIs
1️⃣ Create Product

POST /products

{
  "name": "iPhone 15",
  "price": 200000,
  "description": "Latest iPhone model",
  "categoryId": "66cfcat123",
  "stock": 10
}


Response:

{
  "message": "Product created successfully",
  "data": { "acknowledged": true, "insertedId": "66cfprd123" }
}

2️⃣ Get All Products

GET /products

Response:

[
  { "_id": "66cfprd123", "name": "iPhone 15", "price": 200000, "categoryId": "66cfcat123", "stock": 10 }
]

3️⃣ Get Product by ID

GET /products/:id

Response:

{ "_id": "66cfprd123", "name": "iPhone 15", "price": 200000, "description": "Latest iPhone", "stock": 10 }

4️⃣ Update Product

PUT /products/:id

{
  "price": 195000,
  "stock": 12
}


Response:

{ "message": "Product updated successfully" }

5️⃣ Delete Product

DELETE /products/:id

{ "message": "Product deleted successfully" }

🏷️ Category APIs
1️⃣ Create Category

POST /categories

{ "name": "Mobile Phones" }


Response:

{
  "message": "Category created successfully",
  "data": { "acknowledged": true, "insertedId": "66cfcat123" }
}

2️⃣ Get All Categories

GET /categories

Response:

[
  { "_id": "66cfcat123", "name": "Mobile Phones" },
  { "_id": "66cfcat456", "name": "Laptops" }
]

3️⃣ Update Category

PUT /categories/:id

{ "name": "Smartphones" }


Response:

{ "message": "Category updated successfully" }

4️⃣ Delete Category

DELETE /categories/:id

{ "message": "Category deleted successfully" }

📑 Order APIs
1️⃣ Create Order

POST /orders

{
  "userId": "66cfabc123",
  "products": [
    { "productId": "66cfprd123", "quantity": 2 },
    { "productId": "66cfprd456", "quantity": 1 }
  ],
  "totalAmount": 390000,
  "status": "pending"
}


Response:

{
  "message": "Order created successfully",
  "data": { "acknowledged": true, "insertedId": "66cford123" }
}

2️⃣ Get All Orders

GET /orders

Response:

[
  {
    "_id": "66cford123",
    "userId": "66cfabc123",
    "products": [
      { "productId": "66cfprd123", "quantity": 2 }
    ],
    "totalAmount": 390000,
    "status": "pending"
  }
]

3️⃣ Get Single Order

GET /orders/:id

Response:

{
  "_id": "66cford123",
  "userId": "66cfabc123",
  "products": [
    { "productId": "66cfprd123", "quantity": 2 }
  ],
  "totalAmount": 390000,
  "status": "pending"
}

4️⃣ Update Order Status

PUT /orders/:id

{ "status": "shipped" }


Response:

{ "message": "Order updated successfully" }

5️⃣ Delete Order

DELETE /orders/:id

Response:

{ "message": "Order deleted successfully" }



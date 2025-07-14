Full Node.js E-Commerce System
==============================

Overview
--------

The Full Node.js E-Commerce System is a robust web-based platform designed for online shopping, built using Node.js, Express.js, and MongoDB. It follows the MVC architecture to provide a seamless experience for users to browse products, manage shopping carts, place orders, and for admins to manage products and users. The system supports user authentication, product image uploads with resizing, and RESTful APIs for efficient client-server communication.

Features
--------

-   **User Management**: Register, login, and update profiles with secure JWT-based authentication.
-   **Product Management**: Admins can create, update, and delete products with image uploads (processed using Multer and Sharp).
-   **Cart & Order Management**: Users can add products to carts, view cart details, and place orders with order history tracking.
-   **Search & Filtering**: Search products by name/description and filter by category or price.
-   **Image Processing**: Upload and resize product images to 500x500 pixels with 90% JPEG quality.
-   **Role-Based Access**: Separate functionalities for regular users and admins.

Tech Stack
----------

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **File Uploads**: Multer
-   **Image Processing**: Sharp
-   **Authentication**: JSON Web Tokens (JWT)
-   **Environment**: Configured using `.env` for sensitive data (e.g., `MONGO_URI`, `JWT_SECRET_KEY`)

Installation
------------

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or cloud instance, e.g., MongoDB Atlas)
-   npm (Node Package Manager)

### Steps

1.  **Clone the Repository**:

    ```
    git clone https://github.com/Ahmed2222002/Full-NodeJs-E-Commerce-system-.git
    cd Full-NodeJs-E-Commerce-system-

    ```

2.  **Install Dependencies**:

    ```
    npm install

    ```

3.  **Set Up Environment Variables**:

    -   Create a `.env` file in the root directory.

    -   Add the following variables:

        ```
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET_KEY=your_jwt_secret
        JWT_EXPIRATION=1h
        PORT=3000

        ```

4.  **Run the Application**:

    ```
    npm start

    ```

    The server will run on `http://localhost:3000` (or the port specified in `.env`).

Usage
-----

-   **API Access**: Use tools like Postman to test the RESTful APIs (e.g., `POST /api/users/register`, `GET /api/products`).
-   **Admin Tasks**: Log in with an admin account to manage products and users via endpoints like `POST /api/products` or `GET /api/users`.
-   **User Actions**: Register, browse products, add to cart, and place orders using the appropriate endpoints.
-   **Frontend Integration**: The backend is ready to integrate with a frontend framework (e.g., React, Vue.js) for a complete user interface.

API Endpoints
-------------

For a detailed list of API endpoints, refer to the Software Requirements Specification (SRS). Key endpoints include:

-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/login`: Authenticate a user and return a JWT.
-   `GET /api/products`: Retrieve all products with pagination and filtering.
-   `POST /api/products`: Create a new product (admin only).
-   `POST /api/orders`: Place a new order.
-   `GET /api/orders`: View order history (user or admin).

Documentation
-------------

-   The complete SRS document provides detailed functional and non-functional requirements, system architecture, and constraints.
-   Codebase follows the MVC pattern with clear separation of concerns (models, controllers, routes).

Contributing
------------

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.

Contact
-------

For any inquiries or issues, please open an issue on GitHub or contact the repository owner.

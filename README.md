# Tour API

## Description

This project is an API built using the MVC architecture, with authentication using JWT and role-based authorization

## Features

- MVC architecture for organized code structure
- User authentication using JWT (JSON Web Tokens)
- Role-based authorization for controlling access to different resources
- Data Models: [user, Tour , reviews]
- Aggregation Pipelining
- Secret Tours

## Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Install dependencies: `npm install`

## Configuration

you need to add following in config.env:

- NODE_ENV=development
- PORT=3000
- DATABASE="mongodb+srv://hello:<PASSWORD>@cluster0.dsf.mongodb.net/sdf?retryWrites=true&w=majority&appName=cluster0"
- DATABASE_LOCAL=mongodb://localhost:27017/natours
- DATABASE_PASSWORD=oF4y39r8we98r
- DBUSER = adfslkdjf
-
- JWT_SECRET= apple-day-keep-doc-away
- JWT_EXPIRES_IN=90d
- JWT_COOKIE_EXPIRES_IN=90
-
- EMAIL_USERNAME=105a0esdfsdfsd
- EMAIL_PASSWORD=5ccf9fdfjknskdjf
- EMAIL_HOST=sandbox.smtp.mailtrap.io
- EMAIL_PORT=25

## Usage

1. Start the server: `npm start`

## API Endpoints

### Tour Endpoints

Note: there may different type of request on each route (get,post,patch,delete)

1. api/v1/tours/
2. api/v1/tours/:tourId
3. api/v1/tours/:tourId/reviews
4. api/v1/tours/top-5-cheap
5. api/v1/tours/tour-stats
6. api/v1/tours/monthly-plan/:year
7. api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit
8. api/v1/tours/distances/:latlng/unit/:unit

### User Endpoints

Note: there may different type of request on each route (get,post,patch,delete)

1. api/v1/users/signup
2. api/v1/users/login
3. api/v1/users/forgotPassword
4. api/v1/users/resetPassword
5. api/v1/users/updateMyPassword
6. api/v1/users/updateMe
7. api/v1/users/deleteMe
8. api/v1/users/me
9. api/v1/users/
10. api/v1/users/:id

### Reviews Endpoints

1. api/v1/reviews/
2. api/v1/reviews/:id

## Technologies Used

- Node.js
- Express.js
- Mongoose
- MongoDB
- Many Security node modules

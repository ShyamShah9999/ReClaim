# ReClaim — Smart Campus Lost & Found Platform

ReClaim is a full-stack web application designed to help students report, discover, and recover lost belongings within their campus community.

## Features

- User registration and login
- JWT-based authentication
- Report lost items
- Report found items
- Search and browse reported items
- View detailed item information
- Submit claims for found items
- Track submitted claims
- Review received claims
- Approve or reject claims
- Automatically reject other pending claims when one claim is approved
- Persistent data storage with MongoDB

## Tech Stack

### Frontend
- React.js
- React Router
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt.js

### Database
- MongoDB
- Mongoose

### Tools
- Git
- GitHub
- VS Code
- Postman

## Project Structure

```text
ReClaim/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── .gitignore
└── README.md

How It Works
A student reports an item as lost or found.
Other students can browse and search reported items.
A student can submit a claim for a found item.
The person who reported the found item reviews the claim.
The claim can be approved or rejected.
Once approved, the item is marked as claimed.
Installation
1. Clone the repository
git clone https://github.com/ShyamShah9999/ReClaim.git
cd ReClaim
2. Install backend dependencies
cd backend
npm install
3. Configure environment variables

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
4. Start the backend
node server.js

The backend will run on:

http://localhost:5000
5. Install frontend dependencies

Open another terminal:

cd frontend
npm install
6. Start the frontend
npm run dev

The frontend will run on:

http://localhost:5173
Authentication

ReClaim uses JWT-based authentication to protect user-specific operations such as:

Reporting items
Submitting claims
Viewing personal claims
Viewing received claims
Approving or rejecting claims

Passwords are securely hashed using bcrypt before being stored in the database.

Future Improvements
Image upload for lost and found items
Email notifications
Campus-specific accounts
Advanced item filtering
Admin dashboard
Location-based item discovery
Deployment with a production database
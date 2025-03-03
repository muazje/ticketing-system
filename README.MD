Support Hub - Modern Ticketing System
![Support Hub Dashboard](docs/images/HOMEADMIN.png)
A full-stack role-based ticketing system built with the MERN stack (MongoDB, Express.js, React, Node.js). Support Hub provides a modern and efficient way to manage support tickets with different user roles and real-time updates.

Support Hub Dashboad
User Features

    🔐 Secure authentication with JWT
    👥 Role-based access control (Admin/User)
    🎫 Create and manage support tickets
    📱 Responsive design for all devices
    🌓 Dark mode support
    🔍 Search and filter tickets
    📊 Real-time status updates

Admin Features

    📈 Dashboard with statistics
    👀 Overview of all tickets
    🔄 Update ticket status
    🔍 Advanced filtering and search
    📊 Generate reports
    👥 User management

Technical Features

    ⚡ Modern and fast
    🛡️ Secure by design
    📱 Mobile-first approach
    🎨 Modern UI with animations
    🌐 RESTful API
    🔒 Protected routes

🚀 Tech Stack
Frontend

    React.js
    React Router DOM
    Context API for state management
    Tailwind CSS for styling
    Lucide React for icons
    Axios for API requests

Backend

    Node.js
    Express.js
    MongoDB with Mongoose
    JWT for authentication
    bcrypt for password hashing
    CORS enabled

📦 Installation
Prerequisites

    Node.js (v14 or higher)
    MongoDB (v4 or higher)
    npm or yarn

Backend Setup

    Clone the repository:

git clone https://github.com/muazje/ticketing-system.git
cd ticketing-system/backend

    Install dependencies:

npm install

    Create a .env file in the backend directory:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketing-system
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

    Start the backend server:

npm run dev

Frontend Setup

    Navigate to the frontend directory:

cd ../frontend

    Install dependencies:

npm install

    Create a .env file in the frontend directory:

REACT_APP_API_URL=http://localhost:5000

    Start the frontend development server:

npm start

🔧 Configuration
Environment Variables
Backend

    PORT: Server port (default: 5000)
    MONGODB_URI: MongoDB connection string
    JWT_SECRET: Secret key for JWT
    JWT_EXPIRES_IN: JWT token expiration time

Frontend

    REACT_APP_API_URL: Backend API URL

📚 API Documentation
Authentication Endpoints

POST /api/auth/signup
POST /api/auth/login

Ticket Endpoints

GET    /api/tickets        - Get all tickets (admin) or user tickets
POST   /api/tickets        - Create a new ticket
GET    /api/tickets/:id    - Get ticket by ID
PUT    /api/tickets/:id    - Update ticket status (admin only)

💻 Usage
User Registration

    Navigate to the registration page
    Fill in your details
    Choose your role (User/Admin)
    Submit the form

Creating a Ticket

    Log in to your account
    Navigate to the dashboard
    Click "Create Ticket"
    Fill in the ticket details
    Submit the form

Managing Tickets (Admin)

    Log in as an admin
    Navigate to the admin dashboard
    View all tickets
    Update ticket status
    Filter and search tickets

🎨 Customization
Styling

The project uses Tailwind CSS for styling. You can customize the look and feel by modifying:

    frontend/tailwind.config.js for theme configuration
    frontend/src/index.css for global styles

Colors

Default color scheme can be modified in tailwind.config.js:

theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      secondary: {
        // Your secondary colors
      }
    }
  }
}

🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

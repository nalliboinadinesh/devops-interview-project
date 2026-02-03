# Polytechnic Student Information System

A comprehensive MERN stack web application for managing student information, academic resources, and administrative operations across multiple engineering branches.

## Project Structure

```
polytechnic-sis/
├── backend/                    # Express.js API server
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── controllers/           # Business logic
│   ├── middleware/            # Authentication, validation, error handling
│   ├── config/                # Database and environment configuration
│   └── server.js              # Entry point
├── user-app/                  # Public-facing React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── redux/             # Redux store, slices
│   │   └── App.js             # Main app component
│   └── package.json
├── admin-app/                 # Secure admin React application
│   ├── src/
│   │   ├── components/        # Admin-specific components
│   │   ├── pages/             # Admin pages
│   │   ├── services/          # API services
│   │   ├── redux/             # Redux store
│   │   └── App.js             # Main app component
│   └── package.json
└── package.json               # Root package with workspace scripts
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Joi
- **Cloud Storage**: Cloudinary/AWS S3
- **Logging**: Winston

### Frontend (Both Apps)
- **UI Framework**: React.js 18+
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: React Slick (Carousel)
- **PDF Viewer**: react-pdf

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

1. Install all dependencies:
   ```bash
   npm run install-all
   ```

2. Configure environment variables:
   - Backend: Create `.env` in `backend/` directory
   - User App: Create `.env` in `user-app/` directory
   - Admin App: Create `.env` in `admin-app/` directory

### Development

Start all applications in development mode:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- User Application on `http://localhost:3000`
- Admin Application on `http://localhost:3001`

### Build for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Features

### User Application
- ✅ Student information search by PIN
- ✅ Branch and year filtering
- ✅ Responsive student detail view
- ✅ Academic resources (notes, question papers)
- ✅ Announcements section
- ✅ College information and about page
- ✅ Mobile-optimized responsive design

### Admin Application
- ✅ Secure JWT-based authentication
- ✅ Dashboard with system statistics
- ✅ Student CRUD operations
- ✅ Branch management
- ✅ Material and question paper uploads
- ✅ Announcement management
- ✅ Carousel image management
- ✅ Bulk operations support
- ✅ Global search functionality

## API Documentation

See `backend/API_DOCS.md` for complete API endpoint documentation.

## Database Schema

See `backend/DATABASE_SCHEMA.md` for detailed MongoDB collections and indexing strategy.

## Deployment

Separate deployment configurations for user and admin applications are available in:
- `user-app/Dockerfile`
- `admin-app/Dockerfile`
- `backend/Dockerfile`

## Testing Strategy

- **Unit Tests**: Jest with React Testing Library
- **Property-Based Tests**: fast-check
- **Integration Tests**: Supertest for API endpoints

Run tests with:
```bash
npm test
```

## Contributing

Follow the established code style and write tests for all new features.

## License

This project is proprietary software for Polytechnic College.

## Support

For issues and inquiries, contact the development team.

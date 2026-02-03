# Polytechnic Student Information System (SIS) - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

#### 1. Install All Dependencies
```bash
npm run install-all
```

This command installs dependencies for:
- Backend API
- User Application
- Admin Application

#### 2. Configure Environment Variables

**Backend** - Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

**User App** - Create `user-app/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Admin App** - Create `admin-app/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Start Development Servers
```bash
npm run dev
```

This starts all three applications simultaneously:
- Backend: http://localhost:5000
- User App: http://localhost:3000
- Admin App: http://localhost:3001

### Default Admin Credentials
You'll need to create an admin user in the database. Connect to MongoDB and insert:

```javascript
db.adminusers.insertOne({
  username: "admin",
  email: "admin@polytechnic.edu",
  password: "$2a$10/...", // bcrypt hashed password
  firstName: "Admin",
  lastName: "User",
  role: "Admin",
  managedBranches: ["All"],
  isActive: true
})
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Login
```
POST /auth/login
Body: { username, password }
Response: { tokens: { accessToken, refreshToken }, user }
```

#### Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { tokens: { accessToken, refreshToken } }
```

### Student Endpoints

#### Search Student by PIN (Public)
```
GET /students/search?pin=PIN&branch=BRANCH&academicYear=YEAR
Response: Student Object
```

#### Get All Students (Admin)
```
GET /students?branch=CSE&academicYear=2023-2024&page=1&limit=20
Auth: Required
Response: { students, pagination }
```

#### Create Student (Admin)
```
POST /students
Auth: Required
Body: Student Object
Response: Created Student
```

#### Update Student (Admin)
```
PUT /students/:id
Auth: Required
Body: Updated Student Data
Response: Updated Student
```

#### Delete Student (Admin)
```
DELETE /students/:id
Auth: Required
Response: { message: "Student deleted successfully" }
```

### Material Endpoints

#### Get Materials
```
GET /materials?branch=CSE&semester=1&subject=Java&page=1&limit=20
Response: { materials, pagination }
```

#### Create Material (Admin)
```
POST /materials
Auth: Required
Body: {
  title, description, branch, semester, subject,
  fileUrl, fileType, uploadedBy
}
Response: Created Material
```

### Question Paper Endpoints

#### Get Question Papers
```
GET /question-papers?branch=CSE&semester=1&academicYear=2023-2024&regulation=R18
Response: { papers, pagination }
```

#### Create Question Paper (Admin)
```
POST /question-papers
Auth: Required
Body: {
  title, branch, semester, subject, examType,
  academicYear, regulation, fileUrl, uploadedBy
}
Response: Created Question Paper
```

### Announcement Endpoints

#### Get Announcements
```
GET /announcements?type=Academic&page=1&limit=10
Response: { announcements, pagination }
```

#### Create Announcement (Admin)
```
POST /announcements
Auth: Required
Body: {
  title, content, type, priority,
  targetAudience, publishedBy, attachments
}
Response: Created Announcement
```

### Branch Endpoints

#### Get All Branches
```
GET /branches
Response: [Branch, ...]
```

#### Create Branch (Admin)
```
POST /branches
Auth: Required
Body: {
  code, name, description, establishedYear,
  headOfDepartment, totalSeats
}
Response: Created Branch
```

## File Upload Implementation

### Using Cloudinary (Recommended)

1. **Sign up for Cloudinary**: https://cloudinary.com/

2. **Configure environment variables**:
   ```
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. **Upload Implementation** (Backend):
   ```javascript
   const cloudinary = require('cloudinary').v2;
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   });
   
   const uploadFile = (file) => {
     return cloudinary.uploader.upload(file.path);
   };
   ```

## Database Schema Overview

### Collections

#### students
- Pin (unique, indexed)
- Branch (indexed)
- Academic Year (indexed)
- Personal Info (name, email, phone, address, picture)
- Academic Info (CGPA, semester marks)
- Attendance (semesterwise)
- Fee Status

#### branches
- Code (unique)
- Name
- Established Year
- Head of Department
- Total Seats

#### materials
- Title
- Branch (indexed)
- Semester
- Subject (indexed)
- File URL
- File Type
- Download Count

#### question_papers
- Title
- Branch (indexed)
- Semester
- Academic Year (indexed)
- Regulation (indexed)
- Exam Type
- File URL
- Download Count

#### announcements
- Title
- Content
- Type (indexed)
- Priority
- Publish Date (indexed)
- Active Status (indexed)
- View Count

#### carousel_images
- Title
- Image URL
- Display Order (indexed)
- Active Status (indexed)

#### admin_users
- Username (unique, indexed)
- Email (unique, indexed)
- Password (hashed)
- Role
- Managed Branches
- Permissions

## Testing

### Run Unit Tests
```bash
npm test
```

### Run Property-Based Tests
```bash
npm test -- --testPathPattern="property"
```

## Build for Production

### Build All Applications
```bash
npm run build
```

### Output Directories
- Backend: Ready for Node.js deployment
- User App: `user-app/build`
- Admin App: `admin-app/build`

## Deployment

### Docker Deployment (Recommended)

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/polytechnic-sis
    depends_on:
      - mongodb

  user-app:
    build: ./user-app
    ports:
      - "3000:80"
    depends_on:
      - backend

  admin-app:
    build: ./admin-app
    ports:
      - "3001:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify database name and credentials

### API Connection Error
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check CORS configuration in backend

### Port Already in Use
```bash
# Kill process on port
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process
```

## Performance Optimization

### Frontend
- Enable code splitting
- Lazy load components
- Use React.memo for expensive components
- Optimize images with srcset

### Backend
- Add database indexes
- Implement caching (Redis)
- Use pagination
- Compress responses with gzip

### Database
- Create indexes on frequently queried fields
- Archive old data
- Use connection pooling

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure CORS properly
4. **Input Validation**: Validate all user inputs
5. **Password Hashing**: Use bcrypt for passwords
6. **JWT Tokens**: Keep secrets secure
7. **Database**: Use strong credentials
8. **Rate Limiting**: Implement rate limiting on API

## Support & Maintenance

- Keep dependencies updated
- Monitor error logs
- Regular database backups
- Test new features thoroughly
- Document custom modifications

## Contact Information

For issues and support, contact the development team.

---

**Last Updated**: 2024
**Version**: 1.0.0

# Complete Architecture Implementation Guide

## System Overview

```
User App (Port 3000)                Admin App (Port 3001)
     ↓                                    ↓
  Hooks: useStudents()              Hooks: useStudents()
  useFilter()                        useCreate()
  useCreateStudent()                 useUpdateStudent()
     ↓                                    ↓
  apiClient.js (axios)  ←→  Backend API (Port 5000)
     ↓                            ↓
  authClient.js              EntityService
  (JWT tokens)               (Unified CRUD)
                                  ↓
                           MongoDB Database
```

## Files Created

### Backend (`/backend`)
- `services/entityService.js` - Unified CRUD service for all entities
- `routes/entityRoutes.js` - Dynamic route generator for any entity

### User App (`/user-app/src`)
- `api/authClient.js` - JWT token management
- `api/apiClient.js` - Axios HTTP client with unified endpoints
- `hooks/useEntity.js` - React Query hooks for all CRUD operations

### Admin App (`/admin-app/src`)
- `api/authClient.js` - JWT token management
- `api/apiClient.js` - Axios HTTP client with unified endpoints
- `hooks/useEntity.js` - React Query hooks for all CRUD operations

## How to Use

### 1. Backend - Unified Entity Endpoints

The backend now exposes unified endpoints for all entities:

```javascript
// List all students
GET /api/entities/student/list?sort=-created_date&page=1&limit=100

// Filter students  
POST /api/entities/student/filter
Body: { filters: { branch: "CSE", semester: 3 } }

// Get single student
GET /api/entities/student/:id

// Create student
POST /api/entities/student/create
Body: { name: "John", branch: "CSE", ... }

// Update student
PUT /api/entities/student/:id
Body: { name: "John Doe" }

// Delete student
DELETE /api/entities/student/:id

// Count students
POST /api/entities/student/count
Body: { filters: { branch: "CSE" } }
```

Available entities: `student`, `branch`, `material`, `question-paper`, `announcement`, `carousel`

### 2. Frontend - Using React Query Hooks

#### List all records
```javascript
import { useStudents } from '@/hooks/useEntity';

function StudentPage() {
  const { data, isLoading, error } = useStudents();
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.data?.map(student => (
        <div key={student._id}>{student.name}</div>
      ))}
    </div>
  );
}
```

#### Filter records
```javascript
import { useFilterStudents } from '@/hooks/useEntity';

function FilteredStudents() {
  const filters = { branch: 'CSE', semester: 3 };
  const { data, isLoading } = useFilterStudents(filters);
  
  return (
    <div>
      {isLoading ? <p>Loading...</p> : (
        data?.data?.map(student => (
          <div key={student._id}>{student.name}</div>
        ))
      )}
    </div>
  );
}
```

#### Get single record
```javascript
import { useGetStudent } from '@/hooks/useEntity';

function StudentDetail({ studentId }) {
  const { data: student, isLoading } = useGetStudent(studentId);
  
  return isLoading ? <p>Loading...</p> : <p>{student?.name}</p>;
}
```

#### Create record
```javascript
import { useCreateStudent } from '@/hooks/useEntity';

function CreateStudentForm() {
  const createMutation = useCreateStudent({
    onSuccess: (data) => {
      console.log('Student created:', data);
      // Navigate, close dialog, etc
    }
  });

  const handleSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'John', branch: 'CSE', ... });
    }}>
      {/* form fields */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### Update record
```javascript
import { useUpdateStudent } from '@/hooks/useEntity';

function EditStudentForm({ studentId }) {
  const updateMutation = useUpdateStudent({
    onSuccess: (data) => {
      console.log('Student updated:', data);
    }
  });

  const handleSubmit = (formData) => {
    updateMutation.mutate({ id: studentId, data: formData });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'Jane Doe' });
    }}>
      {/* form fields */}
      <button disabled={updateMutation.isPending}>Update</button>
    </form>
  );
}
```

#### Delete record
```javascript
import { useDeleteStudent } from '@/hooks/useEntity';

function StudentRow({ student }) {
  const deleteMutation = useDeleteStudent({
    onSuccess: () => {
      console.log('Student deleted');
    }
  });

  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(student._id);
    }
  };

  return (
    <div>
      <span>{student.name}</span>
      <button onClick={handleDelete} disabled={deleteMutation.isPending}>
        Delete
      </button>
    </div>
  );
}
```

### 3. Authentication

```javascript
import authClient from '@/api/authClient';

// Login
const response = await authClient.login(email, password);
// Token automatically saved to localStorage

// Get current user
const user = authClient.getCurrentUser();

// Check if admin
if (authClient.isAdmin()) {
  // Show admin controls
}

// Check if authenticated
if (authClient.isAuthenticated()) {
  // Show authenticated content
}

// Logout
authClient.logout();
```

### 4. File Upload

```javascript
import { useUploadFile } from '@/hooks/useEntity';

function FileUploadInput() {
  const uploadMutation = useUploadFile({
    onSuccess: (data) => {
      console.log('File uploaded:', data.file_url);
      // Use data.file_url in your form
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    uploadMutation.mutate(file);
  };

  return (
    <input 
      type="file" 
      onChange={handleFileChange}
      disabled={uploadMutation.isPending}
    />
  );
}
```

## Entity Names for API Calls

Use these exact names when calling hooks or API:

- `student` - Students
- `branch` - Academic branches
- `material` - Study materials
- `question-paper` - Question papers
- `announcement` - Announcements
- `carousel` - Carousel images

## Data Flow Example: Create Material

1. **User** fills form in Admin App
2. **Admin App** calls `useCreateMaterial()`
3. **React Query** sends:
   ```
   POST /api/entities/material/create
   Headers: Authorization: Bearer <token>
   Body: { title, branch, file_url, ... }
   ```
4. **Backend** receives request:
   - Validates JWT token
   - Checks user role is admin
   - Validates required fields
   - Adds auto-fields: id, created_date, updated_date, created_by
   - Saves to MongoDB
5. **Backend** returns created record
6. **React Query** automatically:
   - Invalidates material list cache
   - Refetches updated list
   - Shows success toast
7. **User App** sees new material in notes page

## Automatic Fields

Every record automatically gets:
- `_id` - MongoDB unique ID
- `created_date` - ISO timestamp
- `updated_date` - ISO timestamp
- `created_by` - Email of who created it

## Error Handling

All hooks include automatic error handling:

```javascript
const mutation = useCreateStudent({
  onError: (error) => {
    // error.response.data.message for API errors
    // Toast automatically shown
  }
});
```

## Caching Strategy

React Query caches data for:
- **staleTime**: 5 minutes (data is fresh)
- **gcTime**: 30 minutes (garbage collection)

When you mutate (create/update/delete):
- List queries are invalidated
- Automatic refetch happens
- UI updates instantly

## Pagination

```javascript
const { data } = useStudents({ page: 2, limit: 50 });
// Returns: { data: [...], pagination: { page, limit, total, pages } }
```

## Sorting

```javascript
const { data } = useStudents({ sort: '-created_date' });
// '-' prefix = descending
// Without '-' = ascending
```

## Status Indicators

- `isPending` - Mutation is in progress
- `isLoading` - Query is fetching
- `error` - Error occurred
- `data` - Fetched data

## Next Steps

1. **Update Home.jsx** - Use `useFilterStudents()` for search
2. **Update Notes.jsx** - Use `useMaterials()` for displaying materials  
3. **Update Admin Pages** - Replace Redux with React Query hooks
4. **Test Everything** - Run all 3 servers and test workflows
5. **Add File Uploads** - Implement upload endpoints in backend

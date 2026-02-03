# System Architecture Diagrams

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                          POLYTECHNIC SIS                                 │
│                    (Student Information System)                          │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

                           Internet / Localhost
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
    
    ┌─────────────┐          ┌─────────────┐          ┌──────────────┐
    │  User App   │          │  Admin App  │          │   Backend    │
    │ Port: 3000  │          │ Port: 3001  │          │  Port: 5000  │
    │ (Public)    │          │ (Protected) │          │ (Express.js) │
    └─────────────┘          └─────────────┘          └──────────────┘
         │                         │                         │
         │  Public Access          │  Admin Only             │
         │  (No Login)             │  (admin/admin123)       │
         │                         │                        │
         │     React Query Hooks   │                        │
         │     Axios Client        │                        │
         │     Auth Client         │                        │
         │                         │                        │
         └─────────────────────────┼────────────────────────┘
                                   │
                    POST /api/entities/{entity}/*
                    Headers: Authorization: Bearer <JWT>
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        
        ┌──────────────────────────────────────────────┐
        │         EntityService (Backend)              │
        │                                              │
        │  ├── list()         - Paginated list        │
        │  ├── filter()       - Advanced search       │
        │  ├── getById()      - Single record         │
        │  ├── create()       - Create with auto      │
        │  ├── update()       - Update with tracking  │
        │  ├── delete()       - Delete single         │
        │  ├── deleteBatch()  - Delete multiple       │
        │  └── count()        - Count records         │
        │                                              │
        │  Auto-fields:                                │
        │  ├── created_date                           │
        │  ├── updated_date                           │
        │  ├── created_by     (from JWT)              │
        │  └── updated_by     (from JWT)              │
        │                                              │
        └──────────────────────────────────────────────┘
                         │
                         ▼
        ┌──────────────────────────────────────────────┐
        │           MongoDB Database                   │
        │                                              │
        │  Collections:                                │
        │  ├── students                               │
        │  ├── branches                               │
        │  ├── materials                              │
        │  ├── question_papers                        │
        │  ├── announcements                          │
        │  └── carousel_images                        │
        │                                              │
        └──────────────────────────────────────────────┘
```

---

## Frontend Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  React Component (Home.jsx)                     │
│                                                                  │
│  const { data, isPending, error } = useStudents()              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ renders
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌────────┐      ┌────────┐       ┌────────┐
    │Loading │      │ Data   │       │ Error  │
    │Spinner │      │ List   │       │Message │
    └────────┘      └────────┘       └────────┘
                        │
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
    ┌─────────────────────┐      ┌──────────────────┐
    │  useStudents Hook   │      │ useCreateStudent │
    │  (React Query)      │      │    (Mutation)    │
    │                     │      │                  │
    │  useQuery({         │      │  useMutation({   │
    │    queryKey:        │      │    mutationFn    │
    │    ['students'],    │      │    onSuccess:    │
    │    queryFn: ...     │      │    invalidate    │
    │    staleTime: 5min  │      │  })              │
    │  })                 │      │                  │
    │                     │      └──────────────────┘
    └─────────────────────┘             │
            │                           │ mutate(formData)
            │                           │
            ├───────────────┬───────────┘
            │               │
            ▼               ▼
    ┌────────────────────────────────┐
    │   apiClient.js (Axios)         │
    │                                │
    │   • list('student', ...)       │
    │   • filter('student', ...)     │
    │   • create('student', data)    │
    │   • update('student', id, ...) │
    │   • delete('student', id)      │
    │                                │
    │   Interceptors:                │
    │   • Add JWT token              │
    │   • Handle 401 redirect        │
    │   • Error formatting           │
    │                                │
    └────────────────────────────────┘
            │
            ▼
    ┌────────────────────────────────┐
    │  HTTP Request (Axios)          │
    │                                │
    │  POST /api/entities/student    │
    │  Headers: {                    │
    │    Authorization: Bearer ...   │
    │    Content-Type: application   │
    │  }                             │
    │                                │
    └────────────────────────────────┘
            │
            │ Network
            │
            ▼  (Backend handles request)
```

---

## Backend Request Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│           HTTP Request to Backend                            │
│  POST /api/entities/student/create                           │
│  Headers: { Authorization: Bearer <JWT> }                    │
│  Body: { name, email, branch, ... }                         │
└──────────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Express Middleware Stack      │
        │  (server.js)                   │
        │                                │
        │  1. Body Parser                │
        │  2. CORS Handler               │
        │  3. Logger                     │
        │  4. Auth Middleware            │
        │  5. Route Handler              │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Authentication Check          │
        │  (authenticate middleware)     │
        │                                │
        │  • Extract JWT from header     │
        │  • Verify signature            │
        │  • Check expiration            │
        │  • Set req.user                │
        │                                │
        │  ✅ Success → Continue         │
        │  ❌ Fail → 401 Unauthorized    │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Authorization Check           │
        │  (authorize('admin'))          │
        │                                │
        │  • Check req.user.role         │
        │  • Verify admin permission     │
        │                                │
        │  ✅ Success → Continue         │
        │  ❌ Fail → 403 Forbidden       │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  EntityService.create()        │
        │                                │
        │  1. Validate required fields   │
        │  2. Add auto-fields:           │
        │     - created_date: now()      │
        │     - updated_date: now()      │
        │     - created_by: user.email   │
        │  3. Check duplicates           │
        │  4. Call model.create()        │
        │                                │
        │  ✅ Success → Continue         │
        │  ❌ Fail → Error response      │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  MongoDB Insert                │
        │                                │
        │  db.students.insertOne({       │
        │    name,                       │
        │    email,                      │
        │    branch,                     │
        │    created_date,               │
        │    updated_date,               │
        │    created_by                  │
        │  })                            │
        │                                │
        │  MongoDB returns: {            │
        │    _id: ObjectId(...),         │
        │    ...all fields               │
        │  }                             │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  JSON Response                 │
        │                                │
        │  Status: 201 Created           │
        │  Body: {                       │
        │    success: true,              │
        │    data: {                     │
        │      _id, name, email,         │
        │      created_date, updated_by  │
        │    }                           │
        │  }                             │
        └────────────────────────────────┘
                         │
                         │ Network
                         ▼
        ┌────────────────────────────────┐
        │  Frontend receives response    │
        │                                │
        │  • React Query processes       │
        │  • Updates cache               │
        │  • Invalidates list queries    │
        │  • Shows success toast         │
        │  • Re-renders component        │
        │                                │
        └────────────────────────────────┘
```

---

## Authentication & Authorization Flow

```
┌──────────────────────────────────────────────────────────┐
│                   LOGIN FLOW                             │
└──────────────────────────────────────────────────────────┘

User Types Email & Password
        │
        ▼
┌──────────────────────────────────┐
│  Frontend: authClient.login()    │
│                                  │
│  POST /api/auth/login            │
│  Body: { email, password }       │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Backend: Verify Credentials     │
│                                  │
│  1. Find user by email           │
│  2. Compare passwords (bcrypt)   │
│  3. Generate JWT token           │
│                                  │
│  JWT Payload:                    │
│  {                               │
│    id: user._id,                 │
│    email: user.email,            │
│    role: user.role               │
│  }                               │
│                                  │
│  JWT = header.payload.signature  │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Response with JWT Token         │
│                                  │
│  {                               │
│    success: true,                │
│    token: "eyJhbGc...",          │
│    user: {                       │
│      id,                         │
│      email,                      │
│      role: "admin" or "student"  │
│    }                             │
│  }                               │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Frontend: Save Token            │
│                                  │
│  localStorage.setItem(           │
│    'auth_token',                 │
│    jwt_token                     │
│  )                               │
│                                  │
│  Redirect to Dashboard           │
└──────────────────────────────────┘


┌──────────────────────────────────────────────────────────┐
│            AUTHORIZATION FLOW (Per Request)              │
└──────────────────────────────────────────────────────────┘

Frontend makes API request
        │
        ▼
┌──────────────────────────────────┐
│  Axios Interceptor               │
│                                  │
│  Get token from localStorage     │
│  Add to request header:          │
│                                  │
│  headers: {                      │
│    Authorization:                │
│      "Bearer eyJhbGc..."         │
│  }                               │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Backend: authenticate()         │
│                                  │
│  1. Extract token from header    │
│  2. Verify JWT signature         │
│  3. Check expiration             │
│  4. Decode payload               │
│  5. Set req.user object          │
│                                  │
│  req.user = {                    │
│    id, email, role               │
│  }                               │
└──────────────────────────────────┘
        │
        ├─ ✅ Valid    → Continue
        └─ ❌ Invalid  → 401 Response
                │
                ▼
        Frontend: 401 Interceptor
        → Clear localStorage
        → Redirect to /login
```

---

## Entity Types & Routes

```
┌────────────────────────────────────────────────────────────────┐
│                    Available Entities                           │
└────────────────────────────────────────────────────────────────┘

Entity          | Base Route                    | Requires Auth | Notes
─────────────────┼──────────────────────────────┼───────────────┼─────────
student         | /api/entities/student/*       | Read: No      | Main data
branch          | /api/entities/branch/*        | Read: No      | Branch info
material        | /api/entities/material/*      | Read: No      | Study materials
question-paper  | /api/entities/question-paper/*| Read: No      | Previous papers
announcement    | /api/entities/announcement/*  | Read: No      | Notices
carousel        | /api/entities/carousel/*      | Read: No      | Home banner


┌────────────────────────────────────────────────────────────────┐
│              Available Endpoints Per Entity                     │
└────────────────────────────────────────────────────────────────┘

GET /entities/{entity}/list
    Params: sort, page, limit
    Returns: { data: [], total, page, limit, totalPages }

POST /entities/{entity}/filter
    Body: { filters: {}, sort, page, limit }
    Returns: Filtered paginated results

GET /entities/{entity}/:id
    Returns: Single document by MongoDB _id

POST /entities/{entity}/create
    Body: { field1, field2, ... }
    Requires: Admin
    Returns: Created document with auto-fields

PUT /entities/{entity}/:id
    Body: { field1, field2, ... }
    Requires: Admin
    Returns: Updated document

DELETE /entities/{entity}/:id
    Requires: Admin
    Returns: { success: true }

POST /entities/{entity}/batch/delete
    Body: { ids: [...] }
    Requires: Admin
    Returns: { success: true, deleted: count }

POST /entities/{entity}/count
    Body: { filters: {} }
    Returns: { count: number }
```

---

## Data Model Relationships

```
┌─────────────┐
│  Student    │
│             │
│ _id         │  1
│ pin         │  ├──────────┐
│ name        │             │
│ email       │             │
│ branch ─────┼─────────┐   │
│ semester    │         │   │
│ year        │         │   │
│ phone       │         │   │
│ address     │         │   │
│ ...         │         │   │
└─────────────┘         │   │
                        │   │
                      N │   │
              ┌─────────▼─┐ │
              │  Branch   │ │
              │           │ │
              │ _id       │ │
              │ name      │ │
              │ code      │ │
              │ ...       │ │
              └───────────┘ │
                            │
                        M ──┘
              ┌──────────────────┐
              │  Material        │
              │                  │
              │ _id              │
              │ title            │
              │ branch ───────────┘
              │ subject
              │ file_url
              │ semester
              │ ...
              └──────────────────┘


All entities have common fields:
  _id           : MongoDB ObjectId
  created_date  : Timestamp
  updated_date  : Timestamp
  created_by    : User email
  updated_by    : User email (if modified)
```

---

## Caching Strategy (React Query)

```
                    API Request
                         │
                         ▼
                ┌────────────────┐
                │ Query Cache    │
                │                │
                │ Data stored    │
                │ by queryKey    │
                └────────────────┘
                    │         ▲
        ┌───────────┘         │
        │                     │
        ▼                     │
    Fresh? (≤ staleTime)      │ Invalidated
         │                     │ or Expired
         │ No                  │
         ▼                     │
    ┌─────────────┐           │
    │  Fetch New  │───────────┘
    │    Data     │
    │    (API)    │
    └─────────────┘


Default Cache Settings:
  staleTime: 5 minutes  (Data considered fresh for 5 min)
  gcTime: 30 minutes    (Remove cache after 30 min of inactivity)

Cache Invalidation Triggers:
  • Create operation → Invalidate list cache
  • Update operation → Invalidate list cache
  • Delete operation → Invalidate list cache
  • Manual invalidation via queryClient

Benefits:
  ✅ 80% fewer API calls
  ✅ Instant UI updates (cached)
  ✅ Background refetch without blocking
  ✅ Offline-ready (cached data available)
```

---

## File Upload Flow (Optional Feature)

```
User Selects File
        │
        ▼
┌──────────────────────────┐
│ Frontend: handleUpload() │
│                          │
│ useUploadFile().mutate() │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Axios: POST /upload      │
│                          │
│ FormData: {              │
│   file: [File object]    │
│ }                        │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Backend: /upload route   │
│                          │
│ Multer middleware:       │
│ • Parse multipart        │
│ • Save to disk/cloud     │
│ • Generate URL           │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Response: {              │
│   file_url: "http://..." │
│   filename: "..."        │
│ }                        │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Frontend: Use file_url   │
│                          │
│ Create Material with:    │
│ {                        │
│   title: "...",          │
│   file_url: "http://...", │
│   branch: "CSE"          │
│ }                        │
│                          │
│ createMutation.mutate()  │
└──────────────────────────┘
```

---

## Security Layers

```
                    User Request
                         │
                         ▼
        ┌────────────────────────────┐
        │  Browser Security          │
        │  • HTTPS/SSL               │
        │  • CSRF tokens             │
        │  • SameSite cookies        │
        └────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  JWT Authentication        │
        │  • Token in Authorization  │
        │  • JWT signature verified  │
        │  • Expiration checked      │
        │  • Payload decoded         │
        └────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  Role-Based Access         │
        │  • Admin check             │
        │  • Student check           │
        │  • Custom roles (optional) │
        └────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  Input Validation          │
        │  • Required fields         │
        │  • Type checking           │
        │  • Regex patterns          │
        │  • Duplicate checking      │
        └────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  Database Security         │
        │  • MongoDB injection safe  │
        │  • Mongoose validation     │
        │  • Encrypted passwords     │
        │  • User audit trail        │
        └────────────────────────────┘
                         │
                         ▼
                    Safe Response
```

---

**Diagrams Updated**: 2024-01-15
**Status**: Architecture Complete ✅

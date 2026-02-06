# Sportsteria - API Documentation

## Overview
Complete API reference for the Sportsteria sports equipment rental system with all backend endpoints and frontend service methods.

---

## Backend Base URL
- **Development**: `http://localhost:8080`
- **Production**: `https://sportsteria-final.onrender.com`

---

## Authentication

### JWT Token Flow
1. User logs in via `POST /auth/login`
2. Receives JWT token in response
3. Token stored in localStorage
4. Token sent in `Authorization: Bearer <token>` header for all subsequent requests
5. Token validated by `JwtAuthenticationFilter` for role-based access control

### User Roles
- **STUDENT**: Can browse equipment and create requests
- **ADMIN**: Can manage equipment inventory and approve/reject requests

---

# 🔐 Authentication Endpoints

## POST `/auth/signup`
**Access**: Public  
**Description**: Register a new user account (defaults to STUDENT role)

**Request Header**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "username": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT"
}
```

**Error** (400 Bad Request):
```json
{
  "message": "Username already exists"
}
```

---

## POST `/auth/login`
**Access**: Public  
**Description**: Authenticate user and receive JWT token

**Request Header**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huX2RvZSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzA1Nzc2NDAwLCJleHAiOjE3MDU4NjI4MDB9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Invalid username or password"
}
```

---

# 🏆 Equipment Management Endpoints

## GET `/api/equipments`
**Access**: Public (No authentication required)  
**Description**: Retrieve all equipment with inventory details

**Request Header**:
```
Optional: Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Basketball",
    "totalQuantity": 10,
    "allottedQuantity": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Tennis Ball",
    "totalQuantity": 20,
    "allottedQuantity": 8,
    "createdAt": "2024-01-15T10:35:00Z"
  },
  {
    "id": 3,
    "name": "Volleyball",
    "totalQuantity": 15,
    "allottedQuantity": 12,
    "createdAt": "2024-01-15T10:40:00Z"
  }
]
```

**Query Parameters**: None

---

## POST `/api/admin/equipments`
**Access**: ADMIN role only  
**Description**: Add new equipment or merge with existing (case-insensitive duplicate detection)

**Request Header**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Basketball",
  "totalQuantity": 5
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Basketball",
  "totalQuantity": 15,
  "allottedQuantity": 5,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Features**:
- Equipment names standardized to Title Case (e.g., "basket ball" → "Basketball")
- Duplicate detection is case-insensitive
- If duplicate found, quantities are merged instead of creating new entry
- Example: Adding "basketball" when "Basketball" exists updates quantity, not creates new entry

**Error** (403 Forbidden):
```json
{
  "message": "Access Denied"
}
```

---

## PUT `/api/admin/equipments/{id}`
**Access**: ADMIN role only  
**Description**: Update equipment total quantity

**Request Header**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameter**:
```
id: Long (equipment ID)
```

**Request Body**:
```json
{
  "totalQuantity": 20
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Basketball",
  "totalQuantity": 20,
  "allottedQuantity": 5,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error** (404 Not Found):
```json
{
  "message": "Equipment not found"
}
```

**Error** (403 Forbidden):
```json
{
  "message": "Access Denied"
}
```

---

## DELETE `/api/admin/equipments/{id}`
**Access**: ADMIN role only  
**Description**: Delete equipment from inventory

**Request Header**:
```
Authorization: Bearer <admin_token>
```

**Path Parameter**:
```
id: Long (equipment ID)
```

**Response** (204 No Content)

**Error** (404 Not Found):
```json
{
  "message": "Equipment not found"
}
```

**Error** (403 Forbidden):
```json
{
  "message": "Access Denied"
}
```

---

# 📦 Student Request Endpoints

## GET `/api/requests/student`
**Access**: STUDENT role (authenticated)  
**Description**: Retrieve all requests made by the logged-in student

**Request Header**:
```
Authorization: Bearer <student_token>
Content-Type: application/json
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "studentId": 2,
    "studentUsername": "john_doe",
    "equipmentId": 1,
    "equipmentName": "Basketball",
    "quantityRequested": 2,
    "status": "PENDING",
    "createdAt": "2024-01-20T14:00:00Z",
    "updatedAt": null
  },
  {
    "id": 2,
    "studentId": 2,
    "studentUsername": "john_doe",
    "equipmentId": 2,
    "equipmentName": "Tennis Ball",
    "quantityRequested": 1,
    "status": "APPROVED",
    "createdAt": "2024-01-20T15:30:00Z",
    "updatedAt": "2024-01-20T16:00:00Z"
  }
]
```

**Request Status Values**:
- `PENDING` - Awaiting admin approval
- `APPROVED` - Admin approved, equipment allocated
- `REJECTED` - Admin rejected the request

---

## POST `/api/requests/student`
**Access**: STUDENT role (authenticated)  
**Description**: Create a new equipment request

**Request Header**:
```
Authorization: Bearer <student_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "equipmentId": 1,
  "quantityRequested": 2
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "studentId": 2,
  "studentUsername": "john_doe",
  "equipmentId": 1,
  "equipmentName": "Basketball",
  "quantityRequested": 2,
  "status": "PENDING",
  "createdAt": "2024-01-20T14:00:00Z",
  "updatedAt": null
}
```

**Validation**:
- `equipmentId` must exist
- `quantityRequested` must be > 0
- Default quantity is 1 if not specified

**Error** (404 Not Found):
```json
{
  "message": "Equipment not found"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Authentication required"
}
```

---

# ✅ Admin Request Management Endpoints

## GET `/api/admin/requests`
**Access**: ADMIN role only  
**Description**: Retrieve all student requests pending approval

**Request Header**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "studentId": 2,
    "studentUsername": "john_doe",
    "equipmentId": 1,
    "equipmentName": "Basketball",
    "quantityRequested": 2,
    "status": "PENDING",
    "createdAt": "2024-01-20T14:00:00Z",
    "updatedAt": null
  },
  {
    "id": 2,
    "studentId": 3,
    "studentUsername": "jane_smith",
    "equipmentId": 2,
    "equipmentName": "Tennis Ball",
    "quantityRequested": 1,
    "status": "PENDING",
    "createdAt": "2024-01-20T15:30:00Z",
    "updatedAt": null
  },
  {
    "id": 3,
    "studentId": 2,
    "studentUsername": "john_doe",
    "equipmentId": 3,
    "equipmentName": "Volleyball",
    "quantityRequested": 3,
    "status": "APPROVED",
    "createdAt": "2024-01-19T10:00:00Z",
    "updatedAt": "2024-01-19T11:30:00Z"
  }
]
```

---

## PUT `/api/admin/requests/{id}/approve`
**Access**: ADMIN role only  
**Description**: Approve a student's equipment request

**Request Header**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameter**:
```
id: Long (request ID)
```

**Request Body**: Empty

**Response** (200 OK):
```json
{
  "id": 1,
  "studentId": 2,
  "studentUsername": "john_doe",
  "equipmentId": 1,
  "equipmentName": "Basketball",
  "quantityRequested": 2,
  "status": "APPROVED",
  "createdAt": "2024-01-20T14:00:00Z",
  "updatedAt": "2024-01-20T16:45:00Z"
}
```

**Side Effects**:
- Updates `allottedQuantity` of equipment by adding `quantityRequested`
- Marks request as APPROVED with timestamp

**Error** (404 Not Found):
```json
{
  "message": "Request not found"
}
```

**Error** (403 Forbidden):
```json
{
  "message": "Access Denied"
}
```

---

## PUT `/api/admin/requests/{id}/reject`
**Access**: ADMIN role only  
**Description**: Reject a student's equipment request

**Request Header**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameter**:
```
id: Long (request ID)
```

**Request Body**: Empty

**Response** (200 OK):
```json
{
  "id": 1,
  "studentId": 2,
  "studentUsername": "john_doe",
  "equipmentId": 1,
  "equipmentName": "Basketball",
  "quantityRequested": 2,
  "status": "REJECTED",
  "createdAt": "2024-01-20T14:00:00Z",
  "updatedAt": "2024-01-20T16:45:00Z"
}
```

**Side Effects**:
- Marks request as REJECTED with timestamp
- Equipment quantities remain unchanged

**Error** (404 Not Found):
```json
{
  "message": "Request not found"
}
```

**Error** (403 Forbidden):
```json
{
  "message": "Access Denied"
}
```

---

# 🏠 Health Check Endpoint

## GET `/`
**Access**: Public  
**Description**: Server health check

**Response** (200 OK):
```
Server running at port 8095
```

---

# 🎨 Frontend Service Layer

All frontend API calls are abstracted through service modules. Token is automatically attached by the Axios interceptor in `api.js`.

## `src/services/authService.js`

```javascript
// Sign up a new user
signup(payload: { username, password, fullName, email })
// Calls: POST /auth/signup
// Returns: User object

// Log in user
login(payload: { username, password })
// Calls: POST /auth/login
// Returns: { token, user }

// Log out (client-side only)
logout()
// Removes token and user from localStorage
```

---

## `src/services/EquipmentService.js`

```javascript
// Get all equipment (public)
getAllEquipments()
// Calls: GET /api/equipments
// Returns: Equipment[]

// Get equipment (admin view)
getAdminEquipments()
// Calls: GET /api/equipments
// Returns: Equipment[]

// Get student equipment (same as getAllEquipments)
getStudentEquipments()
// Calls: GET /api/equipments
// Returns: Equipment[]

// Add or merge equipment (admin)
addEquipment(payload: { name, totalQuantity })
// Calls: POST /api/admin/equipments
// Returns: Equipment (merged if duplicate)

// Update equipment quantity (admin)
updateEquipmentQuantity(id: Long, newQuantity: number)
// Calls: PUT /api/admin/equipments/{id}
// Body: { totalQuantity: newQuantity }
// Returns: Equipment

// Delete equipment (admin)
deleteEquipment(id: Long)
// Calls: DELETE /api/admin/equipments/{id}
// Returns: void
```

---

## `src/services/requestService.js`

```javascript
// Create student request
createStudentRequest(payload: { equipmentId, quantityRequested })
// Calls: POST /api/requests/student
// Returns: RequestItem

// Get student's own requests
getStudentRequests()
// Calls: GET /api/requests/student
// Returns: RequestItem[]

// Get all requests (admin)
getAllRequestsAdmin()
// Calls: GET /api/admin/requests
// Returns: RequestItem[]

// Approve request (admin)
approveRequest(id: Long)
// Calls: PUT /api/admin/requests/{id}/approve
// Returns: RequestItem (with status: APPROVED)

// Reject request (admin)
rejectRequest(id: Long)
// Calls: PUT /api/admin/requests/{id}/reject
// Returns: RequestItem (with status: REJECTED)
```

---

# 📱 Frontend Components

## Page Routes
| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/login` | Login.jsx | Public | User login |
| `/signup` | Signup.jsx | Public | User registration |
| `/admin` | AdminDashboard.jsx | ADMIN | Equipment & request management |
| `/student` | StudentDashboard.jsx | STUDENT | Equipment browsing & requests |
| `*` | NotFound.jsx | Public | 404 page |

## Key Components
- **Navbar.jsx** - Top navigation with role-based menus and user info
- **Sidebar.jsx** - Desktop sidebar navigation
- **EquipmentTable.jsx** - Equipment display with +/- quantity controls
- **RequestsTable.jsx** - Request display with status badges and approve/reject buttons

---

# 🔒 Security Features

✅ **JWT Token Authentication**
- Issued on login, expires in 24 hours
- Sent automatically with each request
- Validated server-side by JwtAuthenticationFilter

✅ **Role-Based Access Control (RBAC)**
- Routes protected by role requirements
- Endpoints require specific roles
- Database checks enforce authorization

✅ **CORS Configuration**
- Configured for development and production URLs
- Allows credentials and custom headers

✅ **Password Security**
- Passwords hashed using Spring Security's BCryptPasswordEncoder
- Never transmitted in plain text

---

# 📊 HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (signup) |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Invalid input (validation error) |
| 401 | Unauthorized | Missing/invalid authentication token |
| 403 | Forbidden | Authenticated but insufficient permissions (role check failed) |
| 404 | Not Found | Resource doesn't exist (equipment/request not found) |
| 500 | Server Error | Unexpected server error |

---

# 🚀 Quick Integration Examples

## Frontend - Login and Get Token
```javascript
import { login } from '@/services/authService';

const response = await login({
  username: 'john_doe',
  password: 'secure_password'
});

// Token automatically stored in localStorage
// Automatically sent with all subsequent requests
```

## Frontend - Admin Add Equipment
```javascript
import { addEquipment } from '@/services/EquipmentService';

const equipment = await addEquipment({
  name: 'Basketball',
  totalQuantity: 10
});
// Backend handles duplicate merging automatically
```

## Frontend - Student Request Equipment
```javascript
import { createStudentRequest } from '@/services/requestService';

const request = await createStudentRequest({
  equipmentId: 1,
  quantityRequested: 2
});
// Creates PENDING request awaiting admin approval
```

## Frontend - Admin Approve Request
```javascript
import { approveRequest } from '@/services/requestService';

const approved = await approveRequest(1);
// Marks request as APPROVED, updates equipment allottedQuantity
```

---

# 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden on admin endpoints | Missing ADMIN role in JWT | Ensure user is logged in with ADMIN account |
| 401 Unauthorized | No token or expired token | User needs to login again |
| Equipment not found | Invalid equipment ID | Use correct ID from GET /api/equipments |
| Cannot create request | Equipment doesn't exist | Verify equipment exists first |
| Duplicate equipment | Case variations not handled | Backend automatically detects and merges |

---

# 📚 Environment Configuration

## Frontend `.env` Variables
```
# Base URL for all API requests
VITE_API_URL=http://localhost:8080           # Local dev
VITE_API_URL=https://sportsteria-final.onrender.com  # Production
```

## Backend `application.properties`
```
# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration-ms=86400000  # 24 hours

# Database
spring.datasource.url=jdbc:postgresql://...
spring.datasource.username=...
spring.datasource.password=...

# CORS
spring.web.cors.allowed-origins=http://localhost:5173,https://sportsteria.vercel.app
```

---

# 📞 Support

For issues or questions about API endpoints, check:
1. Request/response examples in this documentation
2. Frontend service implementations in `src/services/`
3. Backend controller files

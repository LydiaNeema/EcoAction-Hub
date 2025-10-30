# EcoAction Hub API Documentation

## Base URLs

- **Production**: `https://ecoaction-hub.onrender.com/api`
- **Development**: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT Bearer token authentication.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "string (required, 3-50 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "full_name": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2025-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400/409):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "created_at": "2025-01-15T10:30:00Z",
    "profile": {
      "bio": "Climate activist",
      "issues_reported": 5,
      "alerts_responded": 12,
      "community_impact": 150
    }
  }
}
```

---

## Community Action Endpoints

### List All Actions
**GET** `/community/actions`

Get list of all community actions with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (active, completed, cancelled)
- `category` (optional): Filter by category

**Response (200):**
```json
{
  "success": true,
  "actions": [
    {
      "id": 1,
      "title": "Beach Cleanup Drive",
      "description": "Join us for a community beach cleanup",
      "category": "Environment",
      "location": "Diani Beach",
      "date": "2025-02-15T09:00:00Z",
      "status": "active",
      "participants_count": 25,
      "participants_goal": 50,
      "impact_metric": "50 kg of waste collected",
      "image": "/uploads/beach-cleanup.jpg",
      "created_by": 1,
      "creator_name": "John Doe",
      "created_at": "2025-01-10T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Get Single Action
**GET** `/community/actions/{id}`

Get detailed information about a specific action.

**Path Parameters:**
- `id` (integer, required): Action ID

**Response (200):**
```json
{
  "success": true,
  "action": {
    "id": 1,
    "title": "Beach Cleanup Drive",
    "description": "Join us for a community beach cleanup event",
    "category": "Environment",
    "location": "Diani Beach",
    "date": "2025-02-15T09:00:00Z",
    "status": "active",
    "participants_count": 25,
    "participants_goal": 50,
    "impact_metric": "50 kg waste collected",
    "image": "/uploads/beach-cleanup.jpg",
    "created_by": 1,
    "creator_name": "John Doe",
    "participants": [
      {
        "id": 1,
        "user_id": 2,
        "username": "janedoe",
        "joined_at": "2025-01-12T14:30:00Z"
      }
    ]
  }
}
```

---

### Create Action
**POST** `/community/actions`

Create a new community action (requires authentication).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (required)",
  "category": "string (required: Environment, Health, Education, Infrastructure)",
  "location": "string (required)",
  "date": "string (required, ISO 8601 format)",
  "participants_goal": "integer (optional)",
  "impact_metric": "string (optional)",
  "image": "string (optional, URL or path)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Action created successfully",
  "action": {
    "id": 5,
    "title": "Tree Planting Initiative",
    "description": "Plant 100 trees in the local park",
    "category": "Environment",
    "location": "Karura Forest",
    "date": "2025-03-01T08:00:00Z",
    "status": "active",
    "participants_count": 0,
    "created_by": 1
  }
}
```

---

### Update Action
**PUT** `/community/actions/{id}`

Update an existing action (creator only).

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `id` (integer, required): Action ID

**Request Body:** (All fields optional)
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "location": "string",
  "date": "string (ISO 8601)",
  "participants_goal": "integer",
  "impact_metric": "string",
  "image": "string",
  "status": "string (active, completed, cancelled)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Action updated successfully",
  "action": { /* updated action object */ }
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Unauthorized to update this action"
}
```

---

### Delete Action
**DELETE** `/community/actions/{id}`

Delete an action (creator only).

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `id` (integer, required): Action ID

**Response (200):**
```json
{
  "success": true,
  "message": "Action deleted successfully"
}
```

---

### Join Action
**POST** `/community/actions/{id}/join`

Join a community action as a participant.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `id` (integer, required): Action ID

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully joined action",
  "action": {
    "id": 1,
    "title": "Beach Cleanup Drive",
    "participants_count": 26
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "You have already joined this action"
}
```

---

### Leave Action
**POST** `/community/actions/{id}/leave`

Leave a community action.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `id` (integer, required): Action ID

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully left action",
  "action": {
    "id": 1,
    "participants_count": 25
  }
}
```

---

### Get User's Joined Actions
**GET** `/community/my-actions`

Get all actions the authenticated user has joined.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "actions": [
    {
      "id": 1,
      "title": "Beach Cleanup Drive",
      "category": "Environment",
      "date": "2025-02-15T09:00:00Z",
      "status": "active",
      "joined_at": "2025-01-12T14:30:00Z"
    }
  ]
}
```

---

### Get Community Stats
**GET** `/community/stats`

Get overall community statistics.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_actions": 42,
    "active_actions": 15,
    "total_participants": 380,
    "total_impact": 2500
  }
}
```

---

## Emergency Endpoints

### List Emergency Alerts
**GET** `/emergency/alerts`

Get all emergency alerts.

**Query Parameters:**
- `status` (optional): Filter by status (active, resolved)
- `type` (optional): Filter by type (flood, heatwave, pollution, wildfire, drought)
- `severity` (optional): Filter by severity (low, medium, high, critical)

**Response (200):**
```json
{
  "success": true,
  "alerts": [
    {
      "id": 1,
      "type": "flood",
      "severity": "high",
      "title": "Flash Flood Warning",
      "description": "Heavy rainfall expected in the next 6 hours",
      "location": "Nairobi CBD",
      "county": "Nairobi County",
      "affected_area": "Central Business District",
      "status": "active",
      "created_at": "2025-01-15T08:00:00Z",
      "updated_at": "2025-01-15T08:00:00Z"
    }
  ]
}
```

---

### Submit Emergency Report
**POST** `/emergency/reports`

Submit a new emergency report.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "string (required: flood, heatwave, pollution, wildfire, drought)",
  "severity": "string (required: low, medium, high, critical)",
  "description": "string (required)",
  "location": "string (required)",
  "county": "string (optional)",
  "image": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Emergency report submitted successfully",
  "report": {
    "id": 10,
    "type": "pollution",
    "severity": "medium",
    "description": "Industrial smoke detected",
    "location": "Industrial Area",
    "status": "pending",
    "reported_by": 1,
    "created_at": "2025-01-15T14:30:00Z"
  }
}
```

---

### Get Emergency Contacts
**GET** `/emergency/contacts`

Get list of emergency service contacts.

**Query Parameters:**
- `service_type` (optional): Filter by service type

**Response (200):**
```json
{
  "success": true,
  "contacts": [
    {
      "id": 1,
      "name": "Kenya Red Cross",
      "service_type": "Emergency Response",
      "phone": "1199",
      "email": "info@redcross.or.ke",
      "address": "Red Cross Road, South C, Nairobi",
      "county": "Nairobi",
      "available_24_7": true
    }
  ]
}
```

---

### Get AI Insights
**GET** `/emergency/insights`

Get AI-powered emergency insights and recommendations.

**Response (200):**
```json
{
  "success": true,
  "insights": {
    "total_alerts": 15,
    "active_alerts": 8,
    "alert_trend": "Increasing",
    "risk_level": "Medium",
    "recommendations": [
      "Stay informed about flood warnings",
      "Prepare emergency supplies"
    ],
    "recent_patterns": "Increased rainfall in urban areas"
  }
}
```

---

## File Upload Endpoints

### Upload Image
**POST** `/upload/image`

Upload an image file.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
- `image`: File (required, max 5MB, formats: png, jpg, jpeg, gif, webp)

**Response (201):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "image_url": "/uploads/images/a1b2c3d4e5f6_1.jpg",
  "filename": "a1b2c3d4e5f6_1.jpg"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "File size too large. Maximum size is 5MB"
}
```

---

### Get Image
**GET** `/upload/images/{filename}`

Retrieve an uploaded image.

**Path Parameters:**
- `filename` (string, required): Image filename

**Response (200):**
Returns the image file.

---

### Delete Image
**DELETE** `/upload/images/{filename}`

Delete an uploaded image (owner only).

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `filename` (string, required): Image filename

**Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## User Profile Endpoints

### Get User Profile
**GET** `/profile`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": 1,
    "user_id": 1,
    "bio": "Environmental activist passionate about climate action",
    "location": "Nairobi, Kenya",
    "phone": "+254712345678",
    "issues_reported": 12,
    "alerts_responded": 25,
    "community_impact": 350,
    "trees_planted": 50,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

---

### Update User Profile
**PUT** `/profile`

Update authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (All fields optional)
```json
{
  "bio": "string",
  "location": "string",
  "phone": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": { /* updated profile object */ }
}
```

---

## Admin Endpoints

### Check Admin Status
**GET** `/admin/status`

Check if admin routes are working.

**Response (200):**
```json
{
  "success": true,
  "message": "Admin routes are working",
  "status": "ok"
}
```

---

### Delete All Actions (Admin)
**POST** `/admin/delete-all-actions`

Delete all community actions (requires admin token).

**Headers:** 
- `X-Admin-Token: <admin_token>`
- `Content-Type: application/json`

**Response (200):**
```json
{
  "success": true,
  "message": "All actions deleted successfully",
  "deleted_actions": 15,
  "deleted_participants": 45
}
```

---

### Reset Action IDs (Admin)
**POST** `/admin/reset-action-ids`

Reset action ID sequence to start from 1 (requires admin token).

**Headers:** 
- `X-Admin-Token: <admin_token>`
- `Content-Type: application/json`

**Response (200):**
```json
{
  "success": true,
  "message": "Action ID sequences reset to 1"
}
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "success": false,
  "error": "Validation error",
  "details": { /* validation errors */ }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Missing or invalid authentication token"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Unauthorized to perform this action"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Data Models

### User
```typescript
{
  id: number
  username: string
  email: string
  full_name?: string
  created_at: datetime
  profile?: Profile
}
```

### Profile
```typescript
{
  id: number
  user_id: number
  bio?: string
  location?: string
  phone?: string
  issues_reported: number
  alerts_responded: number
  community_impact: number
  trees_planted: number
}
```

### CommunityAction
```typescript
{
  id: number
  title: string
  description: string
  category: "Environment" | "Health" | "Education" | "Infrastructure"
  location: string
  date: datetime
  status: "active" | "completed" | "cancelled"
  participants_count: number
  participants_goal?: number
  impact_metric?: string
  image?: string
  created_by: number
  creator_name: string
  created_at: datetime
  updated_at: datetime
}
```

### EmergencyAlert
```typescript
{
  id: number
  type: "flood" | "heatwave" | "pollution" | "wildfire" | "drought"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  location: string
  county?: string
  affected_area?: string
  status: "active" | "resolved"
  created_at: datetime
  updated_at: datetime
}
```

### EmergencyContact
```typescript
{
  id: number
  name: string
  service_type: string
  phone: string
  email?: string
  address?: string
  county: string
  available_24_7: boolean
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

## Versioning

Current API version: **v1**
All endpoints are prefixed with `/api`

## Support

For API support and questions, please open an issue on GitHub.

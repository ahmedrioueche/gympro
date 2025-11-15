# Postman Collection - GymPro API

## Base URL
```
http://localhost:3000/api
```

**Note:**
- Default port: `3000` (configurable via `PORT` environment variable)
- API prefix: `/api` (set globally in main.ts)
- Adjust the port based on your environment configuration

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "errorCode": "AUTH_007",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Sign In
**POST** `/auth/signin`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Expected Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "profile": {
      "username": "johndoe",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isValidated": true,
      "isOnBoarded": false,
      "isActive": true
    },
    "role": "member"
  },
  "message": "Login successful"
}
```

**Note:** Access and refresh tokens are set as HttpOnly cookies automatically.

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "errorCode": "AUTH_001",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Note:** Refresh token is automatically sent via cookie. No body needed.

**Expected Response (200):**
```json
{
  "message": "Token refreshed successfully"
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "errorCode": "AUTH_004",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Get Current User (Me)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```
OR
```
Cookie: accessToken=<access_token>
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "fullName": "John Doe",
    "isValidated": true,
    "isOnBoarded": false,
    "isActive": true
  },
  "role": "member",
  "memberships": [],
  "subscriptionHistory": [],
  "notifications": []
}
```

---

### 5. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. Verify Email
**POST** `/auth/verify-email`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Expected Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "profile": {
      "username": "johndoe",
      "email": "user@example.com",
      "isValidated": true
    },
    "role": "member"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid or expired verification token",
  "errorCode": "AUTH_010",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 7. Resend Verification Email
**POST** `/auth/resend-verification`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Verification email resent successfully"
}
```

---

### 8. Forgot Password
**POST** `/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

---

### 9. Reset Password
**POST** `/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newPassword123"
}
```

**Expected Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid or expired reset token",
  "errorCode": "AUTH_012",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 10. Google Auth - Get Auth URL
**GET** `/auth/google`

**Expected Response (200):**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

---

### 11. Google Auth Callback
**GET** `/auth/google/callback?code=<code>&state=<state>`

**Note:** This endpoint redirects to the frontend. Use it in a browser or handle redirects in Postman.

---

## Users Endpoints

**Note:** All users endpoints require authentication. Include the access token in headers or cookies.

### 1. Get All Users (Paginated)
**GET** `/users?page=1&limit=10&role=member&search=john`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (owner, manager, staff, coach, member)
- `search` (optional): Search by email, username, or fullName

**Expected Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "profile": {
        "username": "johndoe",
        "email": "user@example.com",
        "fullName": "John Doe",
        "isValidated": true,
        "isActive": true
      },
      "role": "member"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "errorCode": "USER_008",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Required Permission:** `canManageMembers` (Owner/Manager only)

---

### 2. Get User by ID
**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id`: User ID

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "fullName": "John Doe",
    "isValidated": true,
    "isActive": true
  },
  "role": "member",
  "memberships": [],
  "subscriptionHistory": [],
  "notifications": []
}
```

**Note:** Users can view their own profile, or Owner/Manager can view any profile.

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "errorCode": "USER_001",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Get User by Email
**GET** `/users/email/:email`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `email`: User email address

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "role": "member"
}
```

**Required Permission:** `canManageMembers` (Owner/Manager only)

---

### 4. Update User
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "profile": {
    "fullName": "John Updated Doe",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  },
  "role": "member"
}
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "fullName": "John Updated Doe",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  },
  "role": "member"
}
```

**Required Permission:** `canManageMembers` (Owner/Manager only)

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Email is already in use",
  "errorCode": "USER_002",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Update User Profile
**PATCH** `/users/:id/profile`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "fullName": "John Updated Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "age": "30",
  "gender": "male"
}
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "fullName": "John Updated Doe",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "age": "30",
    "gender": "male"
  },
  "role": "member"
}
```

**Note:** Users can update their own profile, or Owner/Manager can update any profile.

---

### 6. Update User Role
**PATCH** `/users/:id/role`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "role": "coach"
}
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com"
  },
  "role": "coach"
}
```

**Required Role:** Owner only

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot change your own role",
  "errorCode": "USER_007",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 7. Activate User
**PATCH** `/users/:id/activate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id`: User ID

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "isActive": true
  },
  "role": "member"
}
```

**Required Permission:** `canManageMembers` (Owner/Manager only)

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "User is already active",
  "errorCode": "USER_009",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 8. Deactivate User
**PATCH** `/users/:id/deactivate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id`: User ID

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "profile": {
    "username": "johndoe",
    "email": "user@example.com",
    "isActive": false
  },
  "role": "member"
}
```

**Required Permission:** `canManageMembers` (Owner/Manager only)

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot deactivate yourself",
  "errorCode": "USER_011",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 9. Delete User
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id`: User ID

**Expected Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Required Role:** Owner only

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot delete yourself",
  "errorCode": "USER_011",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Testing Workflow

### 1. Create a Test User
1. **Sign Up** - `POST /auth/signup`
   - Use email: `test@example.com`
   - Password: `test123456`
   - Username: `testuser`

2. **Sign In** - `POST /auth/signin`
   - Use the credentials from step 1
   - Access token will be set as a cookie

### 2. Test Authenticated Endpoints
1. **Get Current User** - `GET /auth/me`
   - Should return your user data

2. **Update Your Profile** - `PATCH /users/:your_id/profile`
   - Use your own user ID

### 3. Test Admin Endpoints (Owner/Manager)
1. **Get All Users** - `GET /users`
   - Requires Owner or Manager role

2. **Update Another User** - `PUT /users/:other_user_id`
   - Requires Owner or Manager role

3. **Change User Role** - `PATCH /users/:user_id/role`
   - Requires Owner role only

4. **Delete User** - `DELETE /users/:user_id`
   - Requires Owner role only

---

## Postman Environment Variables

Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:3000/api",
  "access_token": "",
  "user_id": "",
  "test_email": "test@example.com",
  "test_password": "test123456"
}
```

### Setting Variables Automatically

Add this to your **Sign In** request's **Tests** tab:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("user_id", response.user._id);
    // Access token is in cookie, but you can also extract it if needed
}
```

---

## Common Error Codes

| Error Code | Description |
|------------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Account is deactivated |
| AUTH_003 | Email not verified |
| AUTH_004 | Invalid refresh token |
| AUTH_005 | No token provided |
| AUTH_006 | Invalid token |
| AUTH_007 | User already exists |
| AUTH_009 | User not found |
| AUTH_010 | Invalid verification token |
| AUTH_012 | Invalid reset token |
| USER_001 | User not found |
| USER_002 | Email already in use |
| USER_003 | Username already in use |
| USER_006 | Invalid role |
| USER_007 | Cannot change own role |
| USER_008 | Insufficient permissions |
| USER_009 | User already active |
| USER_010 | User already deactivated |
| USER_011 | Cannot deactivate/delete yourself |

---

## Postman Collection JSON

You can import this JSON into Postman:

```json
{
  "info": {
    "name": "GymPro API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test123456\",\n  \"username\": \"testuser\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test123456\",\n  \"rememberMe\": false\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signin",
              "host": ["{{base_url}}"],
              "path": ["auth", "signin"]
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/auth/me",
              "host": ["{{base_url}}"],
              "path": ["auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/users?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["users"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get User by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/users/:id",
              "host": ["{{base_url}}"],
              "path": ["users", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": ""
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Notes

1. **Cookies**: The API uses HttpOnly cookies for tokens. Make sure Postman is configured to handle cookies (Settings → General → Cookies).

2. **CORS**: If testing from a browser, ensure CORS is properly configured in your backend.

3. **Environment Variables**: Update the `base_url` variable based on your environment (development, staging, production).

4. **Token Management**: Access tokens are automatically sent via cookies. For manual testing, you can extract the token from cookies and use it in the Authorization header.

5. **Error Responses**: All errors include an `errorCode` that can be used for frontend translation.


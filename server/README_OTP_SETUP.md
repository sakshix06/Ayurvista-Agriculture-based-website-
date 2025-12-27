# OTP Verification System Setup

## Overview
This system implements OTP (One-Time Password) verification for user signup, along with welcome emails and login alert emails.

## Features
- ✅ 6-digit OTP generation
- ✅ OTP expiry (5 minutes)
- ✅ MongoDB storage with automatic cleanup
- ✅ Email sending via Nodemailer + Gmail
- ✅ Welcome email after signup
- ✅ Login alert email with IP address

## Setup Instructions

### 1. Install Dependencies
```bash
npm install nodemailer
```

### 2. Configure Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to "App passwords" (https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/ayurvista

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=5000
```

## API Endpoints

### 1. Send OTP
**POST** `/api/auth/send-otp`

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "OTP sent successfully",
  "expiresIn": "5 minutes"
}
```

### 2. Verify OTP and Signup
**POST** `/api/auth/verify-otp`

Request body:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "securepassword123"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "message": "Account created successfully"
}
```

### 3. Login (with Alert Email)
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## Email Templates

### OTP Email
- Subject: "Your OTP for AyurVista Signup"
- Contains: 6-digit OTP
- Expiry: 5 minutes

### Welcome Email
- Subject: "Welcome to AyurVista! 🌿"
- Sent: After successful signup
- Contains: Welcome message and features

### Login Alert Email
- Subject: "🔒 Login Alert - AyurVista"
- Sent: After successful login
- Contains: Login time and IP address

## Code Structure

```
server/
├── models/
│   ├── User.js          # User model
│   └── Otp.js           # OTP model with auto-expiry
├── services/
│   └── mailService.js   # Email service (sendOtpEmail, sendWelcomeEmail, sendLoginAlert)
├── controllers/
│   └── authController.js # Auth logic (sendOtp, verifyOtp, login, register)
├── routes/
│   └── authRoutes.js    # Route definitions
└── index.js              # Main server file
```

## Error Handling

- All endpoints include proper error handling
- Email failures don't block user registration/login
- OTPs are automatically cleaned up after expiry
- Invalid OTPs return appropriate error messages

## Security Features

- OTPs expire after 5 minutes
- OTPs can only be used once
- IP address tracking for login alerts
- Password hashing with bcrypt
- JWT token authentication

## Testing

1. Start MongoDB: `mongod`
2. Start server: `npm run server`
3. Test endpoints using Postman or curl

Example:
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","name":"Test User","password":"password123"}'
```


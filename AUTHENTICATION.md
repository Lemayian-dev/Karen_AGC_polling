# 🔐 Authentication System - KAGC Polling Software

## Overview

The KAGC Polling Software now includes an admin authentication system to control access to poll creation and management features. This ensures only authorized administrators can create and manage polls, while users can freely join and vote on polls.

## 🎯 Authentication Flow

### For Admins (Poll Creators)
1. Navigate to the home page
2. Click "Admin Login" button
3. Enter credentials
4. Upon successful login:
   - Access to **Create Poll** page
   - Access to **Admin Dashboard**
   - User info displayed in navigation
   - Logout button available

### For Users (Voters)
- No authentication required
- Can join polls via QR code or poll code
- Can vote and view results (if enabled)
- Full access without login

## 🔑 Demo Credentials

For testing purposes, the following credentials are available:

### Account 1
- **Username**: `admin`
- **Password**: `kagc2024`
- **Name**: Admin

### Account 2
- **Username**: `kagc`
- **Password**: `church123`
- **Name**: KAGC Admin

## 📁 Implementation Details

### Files Created/Modified

#### New Files
1. **`client/src/context/AuthContext.jsx`**
   - Authentication state management
   - Login/logout functionality
   - LocalStorage persistence
   - Admin session handling

2. **`client/src/components/ProtectedRoute.jsx`**
   - Route protection wrapper
   - Redirects to login if not authenticated
   - Loading state handling

3. **`client/src/pages/AdminLogin.jsx`**
   - Admin login interface
   - Credential validation
   - Error handling
   - Demo credentials display

#### Modified Files
1. **`client/src/App.jsx`**
   - Added AuthProvider wrapper
   - Protected routes for /create and /admin
   - Added /admin/login route

2. **`client/src/components/Navigation.jsx`**
   - Shows/hides menu items based on auth status
   - Displays admin name when logged in
   - Logout button functionality
   - Conditional navigation items

3. **`client/src/pages/Home.jsx`**
   - Shows "Admin Login" button when not authenticated
   - Shows "Create Poll" button when authenticated
   - Dynamic button rendering

## 🛡️ Security Features

### Current Implementation (Browser-Based)
- ✅ Credentials stored in localStorage
- ✅ Session persistence across page refreshes
- ✅ Auto-redirect to login for protected pages
- ✅ Logout clears all session data
- ✅ Protected routes for admin features

### Production Recommendations
For a production environment, implement:
- 🔒 Backend API authentication
- 🔒 JWT tokens instead of localStorage
- 🔒 Password hashing (bcrypt)
- 🔒 Rate limiting for login attempts
- 🔒 Session expiration
- 🔒 HTTPS only
- 🔒 CSRF protection
- 🔒 Two-factor authentication (optional)

## 🎭 User Roles

### Admin Role
**Can Access:**
- ✅ Create new polls
- ✅ View admin dashboard
- ✅ Access all polls
- ✅ View analytics
- ✅ Close polls
- ✅ Export results

**Cannot Access:**
- Regular user features remain accessible

### User Role (No Login Required)
**Can Access:**
- ✅ Join polls via code/QR
- ✅ Vote on active polls
- ✅ View results (if enabled by admin)
- ✅ Home page

**Cannot Access:**
- ❌ Create polls
- ❌ Admin dashboard
- ❌ Poll management

## 📝 Usage Guide

### As an Administrator

#### 1. First Time Login
```
1. Go to homepage
2. Click "Admin Login"
3. Enter credentials (username: admin, password: kagc2024)
4. Click "Sign In"
5. Redirected to admin dashboard
```

#### 2. Creating a Poll
```
1. Login as admin
2. Click "Create Poll" in navigation
3. Fill in poll details:
   - Poll title
   - Options (minimum 2)
   - Settings:
     * Multiple choice
     * Show results
     * Allow re-voting
4. Click "Create Poll"
5. Share QR code or poll code with congregation
```

#### 3. Managing Polls
```
1. Navigate to Admin Dashboard
2. View all active and closed polls
3. Click "Results" to view live analytics
4. Close polls when voting period ends
5. Export results as CSV
```

#### 4. Logging Out
```
1. Click "Logout" button in navigation
2. Session cleared
3. Redirected to home page
```

### As a User (Voter)

#### No Login Required!
```
1. Get poll code or QR code from admin
2. Go to "Join Poll"
3. Scan QR or enter code
4. Vote on poll
5. View results (if enabled)
```

## 🔄 Session Management

### Session Duration
- **Current**: Persists until manual logout
- **Stored In**: Browser localStorage
- **Key**: `kagc_admin`

### Session Data Structure
```javascript
{
  username: string,
  name: string,
  loginTime: ISO8601 timestamp
}
```

### Checking Auth Status
```javascript
// In any component
import { useAuth } from '../context/AuthContext'

const { isAuthenticated, admin, logout } = useAuth()

if (isAuthenticated) {
  console.log(`Logged in as: ${admin.name}`)
}
```

## 🚨 Troubleshooting

### Cannot Login
1. Check credentials match demo accounts
2. Clear browser cache and localStorage
3. Try incognito/private window
4. Check browser console for errors

### Logged Out Unexpectedly
1. Check if localStorage is enabled
2. Verify browser isn't clearing data
3. Check for manual logout actions

### Protected Pages Not Accessible
1. Verify you're logged in
2. Check navigation shows your name
3. Try logging out and back in
4. Clear cache and retry

## 🔧 Customization

### Adding New Admin Users
Edit `client/src/context/AuthContext.jsx`:

```javascript
const validCredentials = [
  { username: 'admin', password: 'kagc2024', name: 'Admin' },
  { username: 'kagc', password: 'church123', name: 'KAGC Admin' },
  // Add new accounts here:
  { username: 'pastor', password: 'secure123', name: 'Pastor John' }
]
```

### Changing Session Expiration
Add expiration logic in `AuthContext.jsx`:

```javascript
const login = (username, password) => {
  const adminData = {
    username: validAdmin.username,
    name: validAdmin.name,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }
  // ... rest of login logic
}
```

### Password Requirements
Currently no requirements. To add:

```javascript
const validatePassword = (password) => {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}
```

## 🌟 Features Summary

### ✅ Implemented
- Browser-based authentication
- Protected routes
- Session persistence
- Login/logout functionality
- Admin user display
- Conditional UI rendering
- Demo credentials

### 🔜 Future Enhancements
- Backend API authentication
- Password reset functionality
- Email verification
- Role-based permissions
- Activity logging
- Multi-factor authentication
- Password strength requirements
- Account management page

## 📊 Authentication Statistics

### User Experience
- **Login Time**: < 1 second
- **Session Check**: Instant
- **Logout**: Immediate
- **Auto-redirect**: Automatic

### Security Level
- **Current**: Basic (Development)
- **Recommended**: Enterprise (Production)
- **Storage**: Browser localStorage
- **Encryption**: None (browser-based)

## 🎓 Best Practices

### For Administrators
1. ✅ Always logout when using shared computers
2. ✅ Don't share admin credentials
3. ✅ Change default passwords in production
4. ✅ Monitor admin dashboard regularly
5. ✅ Close polls after voting completes

### For Development
1. ✅ Never commit real passwords to git
2. ✅ Use environment variables for production
3. ✅ Implement backend authentication before production
4. ✅ Add HTTPS in production
5. ✅ Regular security audits

## 📞 Support

### Common Questions

**Q: Can I have multiple admins logged in?**
A: Yes, each browser/device can have its own session.

**Q: What happens if I close the browser?**
A: Session persists. Use logout button to clear session.

**Q: Can users see admin features?**
A: No, admin features are hidden unless logged in.

**Q: How secure is this for production?**
A: Current implementation is for development. See "Production Recommendations" section.

---

**Authentication system successfully implemented!** 🎉

For production deployment, please implement backend API authentication and follow security best practices.

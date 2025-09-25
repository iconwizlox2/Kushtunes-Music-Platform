# Google OAuth Setup Instructions

## To enable Google Sign Up:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://kushtunes.com/api/auth/callback/google` (for production)
5. **Copy the credentials**:
   - Client ID
   - Client Secret
6. **Update .env.local**:
   ```
   GOOGLE_CLIENT_ID="your-actual-client-id"
   GOOGLE_CLIENT_SECRET="your-actual-client-secret"
   NEXTAUTH_URL="https://kushtunes.com"
   NEXTAUTH_SECRET="your-super-secret-nextauth-key"
   ```

## Test Accounts Available:

### Admin Accounts (Hardcoded for testing):
- **Email**: admin@kushtunes.com
- **Password**: Admin123!

- **Email**: demo@kushtunes.com  
- **Password**: Demo123!

### Regular User Registration:
- Use the register page to create new accounts
- All validation is working (email, password strength, username availability)
- Accounts are stored in the database

## Current Status:
✅ **User Registration** - Working
✅ **User Login** - Working  
✅ **Password Validation** - Working
✅ **Username Checking** - Working
⏳ **Google OAuth** - Needs real credentials
✅ **Session Management** - Working
✅ **Token Authentication** - Working

## Testing the Auth System:
1. Go to https://kushtunes.com/register
2. Create a new account with strong password
3. Login with the created account
4. Access dashboard and other protected pages
5. Test logout functionality

The authentication system is fully functional for email/password registration and login!

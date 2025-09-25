# App Directory Structure

This document explains the organized structure of the `app/` directory in the Kushtunes Music Platform.

## 📁 Directory Organization

The app directory is organized using Next.js 13+ App Router with route groups for better organization and maintainability.

### 🏠 Root Level
- `layout.tsx` - Root layout component
- `page.tsx` - Home page
- `globals.css` - Global styles
- `test-google/` - Testing page (can be removed in production)

### 🔐 Authentication Routes `(auth)/`
Contains all authentication-related pages:
- `login/` - User login page
- `register/` - User registration page
- `verify-email/` - Email verification page
- `auth/error/` - Authentication error page

### 📊 Dashboard Routes `(dashboard)/`
Contains user-facing dashboard pages:
- `dashboard/` - Main user dashboard
- `profile/` - User profile management
- `artist-dashboard/` - Artist-specific dashboard
- `releases/` - Music releases management
- `upload/` - Music upload interface

### ⚙️ Admin Routes `(admin)/`
Contains administrative pages:
- `admin/` - Main admin dashboard
- `backoffice/` - Backend office management

### ⚖️ Legal Routes `(legal)/`
Contains legal and policy pages:
- `privacy/` - Privacy policy
- `terms/` - Terms of service
- `dmca/` - DMCA policy

## 🔌 API Routes Organization

### 👤 User APIs `api/(user)/`
User-related API endpoints:
- `auth/` - Authentication endpoints
- `profile/` - User profile management
- `payouts/` - User payout information
- `earnings/` - User earnings data

### 🎵 Music APIs `api/(music)/`
Music-related API endpoints:
- `releases/` - Music release management
- `upload/` - File upload handling
- `uploads/` - Upload utilities
- `files/` - File management

### 🔧 Admin APIs `api/(admin)/`
Administrative API endpoints:
- `admin/create-accounts/` - Account creation
- `admin/payouts/` - Payout management
- `admin/releases/` - Release approval
- `admin/reports/` - System reports

### 🌐 External APIs `api/(external)/`
External service integrations:
- `analytics/` - Analytics data
- `apple-music/` - Apple Music integration
- `artist/` - Artist management
- `distribute/` - Distribution services
- `real-distribute/` - Real distribution
- `reports/` - External reporting

## 🎯 Benefits of This Structure

1. **Logical Grouping**: Related functionality is grouped together
2. **Easy Navigation**: Developers can quickly find relevant files
3. **Scalability**: Easy to add new features in appropriate groups
4. **Maintainability**: Clear separation of concerns
5. **Route Groups**: Next.js route groups don't affect URL structure

## 📝 Naming Conventions

- Route groups use parentheses: `(group-name)/`
- Dynamic routes use brackets: `[id]/`
- API routes end with `route.ts`
- Page components are named `page.tsx`
- Layout components are named `layout.tsx`

## 🚀 Adding New Features

When adding new features:

1. **Pages**: Add to appropriate route group
2. **APIs**: Add to appropriate API group
3. **Components**: Add to `components/` directory
4. **Utilities**: Add to `lib/` directory

This structure ensures the codebase remains organized and maintainable as it grows.

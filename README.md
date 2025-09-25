# 🎵 Kushtunes Music Platform

A professional music distribution platform built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Music Distribution**: Upload and distribute music to major platforms
- **Artist Dashboard**: Comprehensive artist management system
- **Admin Panel**: Full administrative control and analytics
- **Mobile Optimized**: PWA with offline support
- **Real-time Analytics**: Track performance and earnings
- **Secure Authentication**: NextAuth.js integration
- **File Management**: Advanced upload and processing system

## 📁 Project Structure

```
kushtunes-starter/
├── app/                    # Next.js App Router with organized route groups
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard pages
│   ├── (admin)/           # Admin pages
│   ├── (legal)/           # Legal pages
│   └── api/               # API routes organized by function
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── scripts/              # Deployment and setup scripts
├── docs/                 # Documentation files
└── config files         # Next.js, Tailwind, TypeScript configs
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database**:
   ```bash
   npm run setup-db
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📚 Documentation

All documentation is available in the `docs/` directory:

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Mobile Optimization](docs/MOBILE_OPTIMIZATION.md)
- [Production Setup](docs/PRODUCTION_DEPLOYMENT_GUIDE.md)
- [Admin Credentials](docs/ADMIN_CREDENTIALS.md)

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-db` - Setup database

## 🌐 Deployment

The project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. The build will automatically use the custom build script
3. All environment variables are configured

## 📱 Mobile Support

- Progressive Web App (PWA)
- Offline functionality
- Touch gestures
- Responsive design
- Mobile-optimized UI components

## 🎯 Key Features

- **Music Upload**: Drag-and-drop file upload with validation
- **Distribution**: Connect to major music platforms
- **Analytics**: Real-time performance tracking
- **Payouts**: Automated royalty calculations
- **Admin Tools**: Comprehensive management interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the music industry**

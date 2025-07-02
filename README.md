# Virality Analyzer 🚀

A comprehensive AI-powered platform that analyzes and predicts content virality across multiple social media platforms. Built with Next.js 15, React 19, and Supabase.

## ✨ Features

- **Multi-Platform Analysis**: Analyze content for Twitter, Instagram, TikTok, YouTube, and LinkedIn
- **AI-Powered Insights**: GPT-4 powered content analysis and recommendations
- **Real-Time Trends**: Track trending topics across all major platforms
- **Virality Prediction**: Advanced algorithms to predict content performance
- **User-Friendly Dashboard**: Beautiful Material UI interface with comprehensive analytics
- **Secure Authentication**: Google OAuth integration with Supabase Auth
- **Credit System**: Freemium model with usage tracking

## 🚀 Quick Start (Fastest Way)

Get up and running in minutes with our automated setup:

```bash
# Clone the repository
git clone <your-repo-url>
cd virality-analyzer

# Install dependencies
npm install --legacy-peer-deps

# Automated setup (creates local database, environment files, everything!)
npm run quick-start

# Start development server
npm run dev
```

That's it! 🎉 Your app will be running at `http://localhost:3000` with a fully configured local Supabase database.

## 🛠️ Custom Setup Options

If you need more control or want to use a production Supabase project:

### Option 1: Interactive Setup
```bash
npm run setup
```
This will guide you through:
- Local development setup
- Linking to existing Supabase project
- Creating new Supabase project
- Google OAuth configuration

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js 18+ and npm
   - Docker (for local Supabase)

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Supabase**
   ```bash
   # Start local Supabase
   npm run db:start
   
   # Set up database schema
   npm run db:reset
   
   # Generate TypeScript types
   npm run db:types
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Get credentials from `npx supabase status`
   - Add your OpenAI API key for AI features

## 📋 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration (Required for AI analysis)
OPENAI_API_KEY=your-openai-api-key

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Virality Analyzer"

# Google OAuth (Optional)
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_SECRET=your-google-secret
```

## 🗄️ Database Architecture

The application uses a comprehensive database schema with:

- **profiles**: User profiles and subscription tiers
- **analyses**: Content analysis records
- **platform_insights**: Platform-specific analysis results
- **trending_topics**: Real-time trending topics across platforms
- **user_preferences**: User settings and preferences
- **usage_analytics**: Usage tracking and analytics

All tables include Row Level Security (RLS) policies for data protection.

## 🔧 Development Commands

```bash
# Database Management
npm run db:start      # Start local Supabase
npm run db:stop       # Stop local Supabase
npm run db:reset      # Reset database with migrations
npm run db:studio     # Open Supabase Studio
npm run db:status     # Check database status
npm run db:types      # Regenerate TypeScript types

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript checks

# Setup
npm run quick-start   # Automated local setup
npm run setup         # Interactive setup wizard
```

## 📁 Project Structure

```
virality-analyzer/
├── src/app/                 # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages
│   ├── login/             # Authentication pages
│   └── auth/              # Auth callbacks
├── lib/supabase/           # Supabase configuration
├── hooks/                  # Custom React hooks
├── providers/              # Context providers
├── types/                  # TypeScript type definitions
├── supabase/              # Supabase configuration & migrations
│   ├── migrations/        # Database migrations
│   ├── config.toml       # Supabase config
│   └── seed.sql          # Sample data
└── scripts/               # Setup and utility scripts
```

## 🔐 Authentication Setup

The app supports Google OAuth through Supabase Auth:

1. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized origins and redirect URIs
   - Enable Google provider in Supabase Dashboard

2. **Supabase Auth Configuration**:
   - Navigate to Authentication → Settings in Supabase Dashboard
   - Enable Google provider
   - Add your OAuth credentials

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**:
   ```bash
   npm run build
   # Deploy to Vercel via their CLI or GitHub integration
   ```

2. **Environment Variables**:
   - Add all required environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_SITE_URL` to your production URL

3. **Supabase Production Setup**:
   - Create a production Supabase project
   - Run migrations: `npx supabase db push`
   - Update environment variables with production credentials

## 🧪 Testing

```bash
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
```

## 📖 API Documentation

The application provides comprehensive API endpoints:

- **Authentication**: Managed by Supabase Auth
- **Content Analysis**: AI-powered analysis endpoints
- **Trending Topics**: Real-time trend data
- **User Analytics**: Usage and performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

- **Documentation**: Check `SETUP_GUIDE.md` for detailed setup instructions
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Material UI](https://mui.com/) - React component library
- [OpenAI](https://openai.com/) - GPT-4 API for content analysis
- [TanStack Query](https://tanstack.com/query) - Data fetching and caching

---

**Ready to analyze your content's viral potential? Get started with `npm run quick-start`! 🚀**

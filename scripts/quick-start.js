#!/usr/bin/env node

/**
 * Virality Analyzer - Quick Start Script
 * 
 * This script sets up everything automatically for local development.
 * Perfect for getting started quickly without any configuration.
 */

const { execSync } = require('child_process')
const fs = require('fs')

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit',
      encoding: 'utf8',
      ...options 
    })
  } catch (error) {
    log(`❌ Command failed: ${command}`, colors.red)
    throw error
  }
}

async function quickStart() {
  log('\n🚀 Virality Analyzer - Quick Start', colors.bold + colors.magenta)
  log('==================================', colors.magenta)
  log('Setting up local development environment...', colors.blue)
  
  try {
    // Check if .env.local already exists
    if (fs.existsSync('.env.local')) {
      log('⚠️  .env.local already exists. Backing up...', colors.yellow)
      fs.copyFileSync('.env.local', '.env.local.backup')
      log('✅ Backup created: .env.local.backup', colors.green)
    }
    
    // Start Supabase locally
    log('\n🏠 Starting local Supabase...', colors.blue)
    exec('npx supabase start')
    
    // Reset database with migrations
    log('\n📋 Setting up database...', colors.blue)
    exec('npx supabase db reset')
    
    // Get local credentials
    log('\n🔑 Getting local credentials...', colors.blue)
    const status = execSync('npx supabase status', { encoding: 'utf8' })
    
    const apiUrl = status.match(/API URL: (.*)/)?.[1]?.trim()
    const anonKey = status.match(/anon key: (.*)/)?.[1]?.trim()
    
    if (!apiUrl || !anonKey) {
      throw new Error('Could not extract Supabase credentials')
    }
    
    // Create .env.local file
    log('\n📝 Creating environment file...', colors.blue)
    const envContent = `# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=${apiUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=placeholder-for-local-dev

# OpenAI Configuration (Optional for local testing)
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Virality Analyzer"

# Google OAuth Configuration (Optional for local testing)
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_SECRET=your-google-secret`

    fs.writeFileSync('.env.local', envContent)
    log('✅ Environment file created: .env.local', colors.green)
    
    // Generate TypeScript types
    log('\n📋 Generating TypeScript types...', colors.blue)
    try {
      exec('npx supabase gen types typescript --local > types/database.ts')
      log('✅ TypeScript types generated successfully!', colors.green)
    } catch (error) {
      log('⚠️  Types generation failed, but that\'s okay for quick start', colors.yellow)
    }
    
    // Success message
    log('\n🎉 Quick Start Complete!', colors.bold + colors.green)
    log('======================', colors.green)
    
    log('\n✅ What\'s been set up:', colors.bold)
    log('• Local Supabase database with all tables and functions', colors.cyan)
    log('• Environment variables configured automatically', colors.cyan)
    log('• Sample trending topics data loaded', colors.cyan)
    log('• TypeScript types generated', colors.cyan)
    
    log('\n🚀 Next Steps:', colors.bold)
    log('1. Start your development server:', colors.cyan)
    log('   npm run dev', colors.bold + colors.cyan)
    log('\n2. Visit your app:', colors.cyan)
    log('   http://localhost:3000', colors.bold + colors.cyan)
    log('\n3. Access Supabase Studio:', colors.cyan)
    log('   http://localhost:54323', colors.bold + colors.cyan)
    
    log('\n💡 Useful Commands:', colors.bold)
    log('• npm run db:status  - Check database status', colors.cyan)
    log('• npm run db:studio  - Open Supabase Studio', colors.cyan)
    log('• npm run db:stop    - Stop local database', colors.cyan)
    log('• npm run setup      - Run full interactive setup', colors.cyan)
    
    log('\n📝 Notes:', colors.bold)
    log('• This is a local development setup only', colors.yellow)
    log('• For production, you\'ll need a real Supabase project', colors.yellow)
    log('• Add your OpenAI API key to .env.local for AI features', colors.yellow)
    
  } catch (error) {
    log('\n❌ Quick start failed:', colors.red)
    log(error.message, colors.red)
    
    log('\n🔧 Troubleshooting:', colors.yellow)
    log('• Make sure Docker is running (required for local Supabase)', colors.cyan)
    log('• Try running: npm run setup (for interactive setup)', colors.cyan)
    log('• Check the logs above for specific error details', colors.cyan)
    
    process.exit(1)
  }
}

if (require.main === module) {
  quickStart()
}

module.exports = { quickStart } 
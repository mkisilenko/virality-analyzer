#!/usr/bin/env node

/**
 * Virality Analyzer - Supabase Setup Script
 * 
 * This script automates the complete setup of Supabase for the Virality Analyzer.
 * It handles local development setup, remote project linking, and migrations.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function checkPrerequisites() {
  log('\n🔍 Checking prerequisites...', colors.blue)
  
  try {
    exec('node --version', { stdio: 'ignore' })
    log('✅ Node.js is installed', colors.green)
  } catch {
    log('❌ Node.js is not installed. Please install Node.js first.', colors.red)
    process.exit(1)
  }

  try {
    exec('npm --version', { stdio: 'ignore' })
    log('✅ npm is installed', colors.green)
  } catch {
    log('❌ npm is not installed. Please install npm first.', colors.red)
    process.exit(1)
  }

  // Check if Supabase CLI is available
  try {
    exec('npx supabase --version', { stdio: 'ignore' })
    log('✅ Supabase CLI is available', colors.green)
  } catch {
    log('❌ Supabase CLI is not available. Installing...', colors.yellow)
    exec('npm install --save-dev supabase --legacy-peer-deps')
    log('✅ Supabase CLI installed', colors.green)
  }
}

async function setupMode() {
  log('\n🚀 Virality Analyzer - Supabase Setup', colors.bold + colors.magenta)
  log('=====================================', colors.magenta)
  
  const mode = await question(`
Choose setup mode:
1. Local development only (recommended for testing)
2. Link to existing Supabase project
3. Create new Supabase project and link

Enter your choice (1-3): `)

  return parseInt(mode)
}

async function setupLocal() {
  log('\n🏠 Setting up local Supabase development environment...', colors.blue)
  
  try {
    exec('npx supabase start')
    log('✅ Local Supabase started successfully!', colors.green)
    
    // Run migrations
    log('\n📋 Running database migrations...', colors.blue)
    exec('npx supabase db reset')
    log('✅ Database migrations completed!', colors.green)
    
    // Get local credentials
    const status = execSync('npx supabase status', { encoding: 'utf8' })
    
    const apiUrl = status.match(/API URL: (.*)/)?.[1]
    const anonKey = status.match(/anon key: (.*)/)?.[1]
    
    if (apiUrl && anonKey) {
      await createEnvFile(apiUrl, anonKey, true)
    }
    
    log('\n🎉 Local setup complete!', colors.green)
    log('Your local Supabase is running at: http://localhost:54323', colors.cyan)
    
  } catch (error) {
    log('❌ Local setup failed. Please check the logs above.', colors.red)
    throw error
  }
}

async function linkExistingProject() {
  log('\n🔗 Linking to existing Supabase project...', colors.blue)
  
  const projectRef = await question('Enter your Supabase project reference (from your project URL): ')
  
  try {
    exec(`npx supabase link --project-ref ${projectRef}`)
    log('✅ Successfully linked to Supabase project!', colors.green)
    
    // Pull remote schema
    const pullSchema = await question('Do you want to pull the remote database schema? (y/n): ')
    if (pullSchema.toLowerCase() === 'y') {
      exec('npx supabase db pull')
      log('✅ Remote schema pulled successfully!', colors.green)
    } else {
      // Push local migrations
      const pushMigrations = await question('Do you want to push local migrations to remote? (y/n): ')
      if (pushMigrations.toLowerCase() === 'y') {
        exec('npx supabase db push')
        log('✅ Migrations pushed to remote database!', colors.green)
      }
    }
    
    // Get project details
    const projectUrl = `https://${projectRef}.supabase.co`
    const anonKey = await question('Enter your project\'s anon key (from Supabase Dashboard → Settings → API): ')
    
    await createEnvFile(projectUrl, anonKey, false)
    
  } catch (error) {
    log('❌ Failed to link project. Please check your project reference.', colors.red)
    throw error
  }
}

async function createNewProject() {
  log('\n🆕 Creating new Supabase project...', colors.blue)
  
  log('Please visit https://supabase.com/dashboard to create a new project first.', colors.yellow)
  log('Then come back here with your project details.', colors.yellow)
  
  const continueSetup = await question('Have you created a new project? (y/n): ')
  if (continueSetup.toLowerCase() === 'y') {
    await linkExistingProject()
  } else {
    log('Setup cancelled. Please create a project and run this script again.', colors.yellow)
    process.exit(0)
  }
}

async function createEnvFile(apiUrl, anonKey, isLocal = false) {
  log('\n📝 Creating environment file...', colors.blue)
  
  const envContent = `# Supabase Configuration${isLocal ? ' (Local Development)' : ''}
NEXT_PUBLIC_SUPABASE_URL=${apiUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration (Required for AI analysis)
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Virality Analyzer"

# Google OAuth Configuration
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_SECRET=your-google-secret

# Social Media API Keys (Optional - for future integration)
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
YOUTUBE_API_KEY=your-youtube-api-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret`

  fs.writeFileSync('.env.local', envContent)
  log('✅ Environment file created: .env.local', colors.green)
  
  if (!isLocal) {
    log('\n⚠️  Important: Please update the following in your .env.local file:', colors.yellow)
    log('   - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard → Settings → API)', colors.yellow)
    log('   - OPENAI_API_KEY (from https://platform.openai.com)', colors.yellow)
    log('   - Google OAuth credentials (if you want authentication)', colors.yellow)
  }
}

async function setupGoogleOAuth() {
  const setupOAuth = await question('\nDo you want to set up Google OAuth now? (y/n): ')
  
  if (setupOAuth.toLowerCase() === 'y') {
    log('\n🔐 Setting up Google OAuth...', colors.blue)
    log('1. Go to https://console.cloud.google.com/', colors.cyan)
    log('2. Create a new project or select existing one', colors.cyan)
    log('3. Enable Google+ API', colors.cyan)
    log('4. Create OAuth 2.0 credentials', colors.cyan)
    log('5. Add http://localhost:3000 and https://your-project.supabase.co to authorized origins', colors.cyan)
    log('6. Add http://localhost:3000/auth/callback to authorized redirect URIs', colors.cyan)
    
    const clientId = await question('Enter your Google OAuth Client ID (or press Enter to skip): ')
    const clientSecret = await question('Enter your Google OAuth Client Secret (or press Enter to skip): ')
    
    if (clientId && clientSecret) {
      // Update env file
      let envContent = fs.readFileSync('.env.local', 'utf8')
      envContent = envContent.replace('SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id', `SUPABASE_AUTH_GOOGLE_CLIENT_ID=${clientId}`)
      envContent = envContent.replace('SUPABASE_AUTH_GOOGLE_SECRET=your-google-secret', `SUPABASE_AUTH_GOOGLE_SECRET=${clientSecret}`)
      fs.writeFileSync('.env.local', envContent)
      
      log('✅ Google OAuth credentials saved to .env.local', colors.green)
      log('⚠️  Don\'t forget to enable Google provider in Supabase Dashboard → Authentication → Settings', colors.yellow)
    }
  }
}

async function generateTypes() {
  log('\n📋 Generating TypeScript types...', colors.blue)
  
  try {
    exec('npx supabase gen types typescript --local > types/database.ts')
    log('✅ TypeScript types generated successfully!', colors.green)
  } catch (error) {
    log('⚠️  Failed to generate types. You can do this manually later with:', colors.yellow)
    log('   npx supabase gen types typescript --local > types/database.ts', colors.cyan)
  }
}

async function showNextSteps() {
  log('\n🎉 Setup Complete!', colors.bold + colors.green)
  log('==================', colors.green)
  
  log('\nNext steps:', colors.bold)
  log('1. Start your development server: npm run dev', colors.cyan)
  log('2. Visit http://localhost:3000 to see your app', colors.cyan)
  log('3. Visit http://localhost:54323 for Supabase Studio (local only)', colors.cyan)
  
  log('\nUseful commands:', colors.bold)
  log('• npx supabase status - Check Supabase status', colors.cyan)
  log('• npx supabase stop - Stop local Supabase', colors.cyan)
  log('• npx supabase db reset - Reset and apply migrations', colors.cyan)
  log('• npx supabase gen types typescript --local > types/database.ts - Regenerate types', colors.cyan)
  
  log('\nDocumentation:', colors.bold)
  log('• README.md - Full setup guide', colors.cyan)
  log('• SETUP_GUIDE.md - Quick setup instructions', colors.cyan)
  log('• https://supabase.com/docs - Supabase documentation', colors.cyan)
}

async function main() {
  try {
    await checkPrerequisites()
    
    const mode = await setupMode()
    
    switch (mode) {
      case 1:
        await setupLocal()
        await generateTypes()
        break
      case 2:
        await linkExistingProject()
        await generateTypes()
        break
      case 3:
        await createNewProject()
        await generateTypes()
        break
      default:
        log('Invalid option. Exiting.', colors.red)
        process.exit(1)
    }
    
    await setupGoogleOAuth()
    await showNextSteps()
    
  } catch (error) {
    log('\n❌ Setup failed:', colors.red)
    log(error.message, colors.red)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Setup cancelled by user', colors.yellow)
  rl.close()
  process.exit(0)
})

if (require.main === module) {
  main()
}

module.exports = { main } 
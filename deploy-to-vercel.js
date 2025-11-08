#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * This script helps you prepare and deploy your application to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Prime Bot Website - Vercel Deployment Setup');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Check if Vercel CLI is installed
    console.log('📋 Step 1: Checking Vercel CLI installation...');
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      console.log('✅ Vercel CLI is installed\n');
    } catch (error) {
      console.log('❌ Vercel CLI not found');
      const install = await question('Would you like to install it now? (y/n): ');
      if (install.toLowerCase() === 'y') {
        console.log('Installing Vercel CLI...');
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installed successfully\n');
      } else {
        console.log('Please install Vercel CLI manually: npm install -g vercel');
        process.exit(1);
      }
    }

    // Check if .env file exists
    console.log('📋 Step 2: Checking environment configuration...');
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  .env file not found');
      console.log('Please create a .env file with your configuration');
      console.log('You can use .env.example as a template\n');
    } else {
      console.log('✅ .env file found\n');
    }

    // Ask for deployment type
    console.log('📋 Step 3: Choose deployment option:');
    console.log('1. Deploy to Vercel (production)');
    console.log('2. Deploy to Vercel (preview)');
    console.log('3. Just login to Vercel');
    console.log('4. Configure environment variables only');
    console.log('5. Exit\n');

    const choice = await question('Enter your choice (1-5): ');

    switch (choice.trim()) {
      case '1':
        console.log('\n🚀 Deploying to production...');
        console.log('Please ensure you have set all environment variables in Vercel dashboard!\n');
        execSync('vercel --prod', { stdio: 'inherit' });
        break;

      case '2':
        console.log('\n🚀 Deploying preview...');
        execSync('vercel', { stdio: 'inherit' });
        break;

      case '3':
        console.log('\n🔐 Logging in to Vercel...');
        execSync('vercel login', { stdio: 'inherit' });
        break;

      case '4':
        console.log('\n⚙️  Environment Variables Configuration');
        console.log('\nYou need to set these variables in Vercel:');
        console.log('1. DISCORD_CLIENT_ID');
        console.log('2. DISCORD_CLIENT_SECRET');
        console.log('3. DISCORD_CALLBACK_URL (https://your-app.vercel.app/auth/discord/callback)');
        console.log('4. SESSION_SECRET');
        console.log('5. MONGODB_URI');
        console.log('6. MONGODB_DB_NAME');
        console.log('7. NODE_ENV (set to "production")');
        
        console.log('\n📝 You can set them via:');
        console.log('   - Vercel Dashboard: https://vercel.com/dashboard');
        console.log('   - Vercel CLI: vercel env add <VARIABLE_NAME>\n');
        
        const openDashboard = await question('Open Vercel dashboard? (y/n): ');
        if (openDashboard.toLowerCase() === 'y') {
          const { exec } = require('child_process');
          const command = process.platform === 'win32' ? 'start' : 
                         process.platform === 'darwin' ? 'open' : 'xdg-open';
          exec(`${command} https://vercel.com/dashboard`);
        }
        break;

      case '5':
        console.log('\n👋 Goodbye!');
        rl.close();
        return;

      default:
        console.log('\n❌ Invalid choice');
        rl.close();
        return;
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ Setup complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📚 Next steps:');
    console.log('1. Configure environment variables in Vercel dashboard');
    console.log('2. Update Discord OAuth callback URL');
    console.log('3. Ensure MongoDB Atlas allows Vercel connections');
    console.log('\n📖 Read VERCEL_DEPLOYMENT.md for detailed instructions\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }

  rl.close();
}

main();

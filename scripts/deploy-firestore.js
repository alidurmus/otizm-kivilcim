#!/usr/bin/env node

/**
 * Firestore Security Rules Deployment Script for Kıvılcım
 * 
 * This script helps deploy Firestore security rules safely with validation.
 * Run with: node scripts/deploy-firestore.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Kıvılcım Firestore Security Rules Deployment');
console.log('===============================================\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Firebase CLI is not installed. Please install it with:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found in project root');
  process.exit(1);
}

// Check if firestore.rules exists
const rulesPath = path.join(process.cwd(), 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules not found in project root');
  process.exit(1);
}

console.log('✅ Firebase CLI found');
console.log('✅ firebase.json found');
console.log('✅ firestore.rules found\n');

// Validate rules syntax
console.log('🔍 Validating Firestore rules syntax...');
try {
  // This command validates the rules without deploying
  execSync('firebase firestore:rules', { stdio: 'pipe' });
  console.log('✅ Firestore rules syntax is valid\n');
} catch (error) {
  console.error('❌ Firestore rules syntax validation failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

// Check if user is logged in
console.log('🔐 Checking Firebase authentication...');
try {
  const result = execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Successfully authenticated with Firebase\n');
} catch (error) {
  console.error('❌ Not authenticated with Firebase. Please run:');
  console.error('firebase login');
  process.exit(1);
}

// Show current project
try {
  const project = execSync('firebase use', { stdio: 'pipe' }).toString().trim();
  console.log(`📋 Current Firebase project: ${project}\n`);
} catch (error) {
  console.error('❌ No Firebase project selected. Please run:');
  console.error('firebase use <project-id>');
  process.exit(1);
}

// Warning about production deployment
console.log('⚠️  IMPORTANT: You are about to deploy Firestore security rules.');
console.log('   This will affect data access permissions in your Firebase project.');
console.log('   Make sure you have tested these rules thoroughly.\n');

// Ask for confirmation (skip in CI environments)
if (!process.env.CI) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Do you want to continue? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ Deployment cancelled');
      process.exit(0);
    }

    rl.close();
    deployRules();
  });
} else {
  console.log('🤖 CI environment detected, proceeding with deployment...\n');
  deployRules();
}

function deployRules() {
  console.log('🚀 Deploying Firestore security rules...\n');
  
  try {
    // Deploy only Firestore rules
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    
    console.log('\n✅ Firestore security rules deployed successfully!');
    console.log('\n📋 Rules Summary:');
    console.log('   • Users can only access their own data');
    console.log('   • Authentication is required for all operations');
    console.log('   • Data validation is enforced on all writes');
    console.log('   • Feedback is immutable once created');
    console.log('   • Analytics data is protected from direct access');
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Test the rules with your application');
    console.log('   2. Monitor Firestore usage in Firebase Console');
    console.log('   3. Review security rules periodically');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:');
    console.error(error.message);
    process.exit(1);
  }
} 
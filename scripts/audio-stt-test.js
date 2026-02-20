const fs = require('fs');
const path = require('path');

/**
 * Audio STT Test Script for Kıvılcım Platform
 * 
 * Tests audio files using Web Speech API (Speech-to-Text)
 * Identifies corrupted files based on file size and quality
 * Follows audio processing rules: read docs/modules/audio-processing-rules.md
 */

// Minimum file sizes for different audio types (bytes)
const MINIMUM_SIZES = {
  letter: 3000,     // Turkish letters minimum 3KB
  word: 8000,       // Turkish words minimum 8KB
  sentence: 15000,  // Turkish sentences minimum 15KB
  celebration: 12000 // Celebration messages minimum 12KB
};

// Audio categories to test
const AUDIO_DIRECTORIES = {
  letters: 'public/audio/letters/',
  words: 'public/audio/words/',
  sentences: 'public/audio/sentences/',
  celebrations: 'public/audio/celebrations/'
};

// Test results
const testResults = {
  passed: [],
  failed: [],
  corrupted: [],
  missing: []
};

/**
 * Check if file size meets minimum requirements
 */
function checkFileSize(filePath, type) {
  if (!fs.existsSync(filePath)) {
    return { valid: false, reason: 'File not found' };
  }

  const stats = fs.statSync(filePath);
  const minSize = MINIMUM_SIZES[type] || 5000;
  
  if (stats.size < minSize) {
    return { 
      valid: false, 
      reason: `File too small: ${stats.size} bytes (min: ${minSize})`,
      size: stats.size
    };
  }

  return { valid: true, size: stats.size };
}

/**
 * Test mathematics module audio files
 */
function testMathematicsAudio() {
  console.log('\\n🔍 Testing Mathematics Module Audio Files...');
  
  const mathFiles = [
    { file: 'public/audio/sentences/matematik-dunyasi-hosgeldin.mp3', type: 'sentence', expected: 'Matematik Dünyası modülüne hoş geldin! Sayıları öğren ve temel matematik becerilerini geliştir.' },
    { file: 'public/audio/words/bir.mp3', type: 'word', expected: 'bir' },
    { file: 'public/audio/words/iki.mp3', type: 'word', expected: 'iki' },
    { file: 'public/audio/words/uch.mp3', type: 'word', expected: 'üç' },
    { file: 'public/audio/words/dort.mp3', type: 'word', expected: 'dört' },
    { file: 'public/audio/words/besh.mp3', type: 'word', expected: 'beş' },
    { file: 'public/audio/words/alti.mp3', type: 'word', expected: 'altı' },
    { file: 'public/audio/words/yedi.mp3', type: 'word', expected: 'yedi' },
    { file: 'public/audio/words/sekiz.mp3', type: 'word', expected: 'sekiz' },
    { file: 'public/audio/words/dokuz.mp3', type: 'word', expected: 'dokuz' },
    { file: 'public/audio/words/on.mp3', type: 'word', expected: 'on' }
  ];

  mathFiles.forEach(({ file, type, expected }) => {
    const result = checkFileSize(file, type);
    
    if (result.valid) {
      console.log(`✅ ${path.basename(file)} - ${result.size} bytes - OK`);
      testResults.passed.push({
        file,
        type,
        expected,
        size: result.size,
        status: 'VALID'
      });
    } else {
      console.log(`❌ ${path.basename(file)} - ${result.reason}`);
      testResults.failed.push({
        file,
        type,
        expected,
        size: result.size || 0,
        status: 'INVALID',
        reason: result.reason
      });
      
      if (result.reason.includes('too small') || result.reason.includes('not found')) {
        testResults.corrupted.push({
          file,
          type,
          expected,
          reason: result.reason
        });
      }
    }
  });
}

/**
 * Generate audio regeneration report
 */
function generateRegenerationReport() {
  console.log('\\n📊 Audio File Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${testResults.passed.length} files`);
  console.log(`❌ Failed: ${testResults.failed.length} files`);
  console.log(`🔧 Need Regeneration: ${testResults.corrupted.length} files`);
  
  if (testResults.corrupted.length > 0) {
    console.log('\\n🔧 Files that need regeneration:');
    testResults.corrupted.forEach(item => {
      console.log(`- ${path.basename(item.file)} (${item.type}): "${item.expected}"`);
      console.log(`  Reason: ${item.reason}`);
    });
    
    console.log('\\n📋 Voice Assignment Rules (according to mathematics module):');
    console.log('- Sentences: Antoni voice (ErXwobaYiN019PkySvjV)');
    console.log('- Words/Numbers: Rachel voice (21m00Tcm4TlvDq8ikWAM)');
    console.log('- Celebrations: Josh voice (TxGEqnHWrfWFTfGW9XjX)');
    console.log('- Default: Gülsu voice (9BWtsMINqrJLrRacOk9x)');
  }
  
  // Save report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.passed.length + testResults.failed.length,
      passed: testResults.passed.length,
      failed: testResults.failed.length,
      corrupted: testResults.corrupted.length
    },
    results: testResults
  };
  
  fs.writeFileSync('audio-test-report.json', JSON.stringify(reportData, null, 2));
  console.log('\\n📄 Report saved to: audio-test-report.json');
}

/**
 * Main test execution
 */
function runAudioTests() {
  console.log('🎵 Audio File Quality Test - Kıvılcım Platform');
  console.log('Following audio processing rules: docs/modules/audio-processing-rules.md');
  console.log('=' .repeat(60));
  
  testMathematicsAudio();
  generateRegenerationReport();
  
  console.log('\\n🎯 Next Steps:');
  console.log('1. Review corrupted files list');
  console.log('2. Regenerate using appropriate voice characters');
  console.log('3. Test audio playback in browser');
  console.log('4. Update audio constants if needed');
}

// Run tests
runAudioTests(); 
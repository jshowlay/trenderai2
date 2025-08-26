#!/usr/bin/env node

const { generateSlug } = require('../lib/slug');

// Test slug generation
console.log('🧪 Testing slug generation...');
console.log('================================');

const testCases = [
  { title: "Hello World", id: 123 },
  { title: "AI & Machine Learning: What's Next?", id: 456 },
  { title: "React.js vs Vue.js: A Comparison", id: 789 },
  { title: "Why PostgreSQL is Better Than MySQL", id: 101 },
  { title: "The Future of Web Development", id: 202 },
  { title: "C++ vs Rust: Performance Comparison", id: 303 },
  { title: "A Very Long Title That Should Be Truncated To Fifty Characters Maximum", id: 404 },
  { title: "Special Characters: @#$%^&*()", id: 505 },
  { title: "Multiple---Hyphens---Here", id: 606 },
  { title: "---Leading and Trailing---", id: 707 },
];

testCases.forEach(({ title, id }) => {
  const slug = generateSlug(title, id);
  console.log(`"${title}" (ID: ${id}) -> "${slug}"`);
});

console.log('\n🚀 Testing HN ingestion endpoint...');
console.log('==================================');

// Test the ingestion endpoint
async function testIngestion() {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    console.log(`Testing endpoint: ${baseUrl}/api/ingest/hn`);
    
    // Test GET endpoint
    console.log('\n📋 Testing GET endpoint...');
    const getResponse = await fetch(`${baseUrl}/api/ingest/hn`);
    const getData = await getResponse.json();
    console.log('GET Response:', JSON.stringify(getData, null, 2));
    
    // Test POST endpoint
    console.log('\n📤 Testing POST endpoint...');
    const postResponse = await fetch(`${baseUrl}/api/ingest/hn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const postData = await postResponse.json();
    console.log('POST Response:', JSON.stringify(postData, null, 2));
    
    if (postData.ok) {
      console.log('\n✅ HN ingestion test completed successfully!');
      console.log(`📊 Results: ${postData.upsertedCards} cards upserted, ${postData.countsRows} count rows inserted`);
      console.log(`⏰ Window: ${postData.windowStart} to ${postData.windowEnd}`);
    } else {
      console.log('\n❌ HN ingestion test failed:', postData.error);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testIngestion();
}

module.exports = { testIngestion };

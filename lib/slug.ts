/**
 * Generate a deterministic, collision-free slug from a title and ID
 * Pattern: <slugified-title>-<id>
 */
export function generateSlug(title: string, id: string | number): string {
  // Convert title to lowercase
  let slug = title.toLowerCase();
  
  // Remove apostrophes
  slug = slug.replace(/'/g, '');
  
  // Replace non-alphanumeric characters with hyphens
  slug = slug.replace(/[^a-z0-9]/g, '-');
  
  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-');
  
  // Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '');
  
  // Ensure slug is not empty
  if (!slug) {
    slug = 'untitled';
  }
  
  // Truncate to reasonable length (max 50 chars for title part)
  if (slug.length > 50) {
    slug = slug.substring(0, 50);
    // Remove trailing hyphen if present
    slug = slug.replace(/-+$/, '');
  }
  
  // Append the ID to ensure uniqueness
  return `${slug}-${id}`;
}

/**
 * Test the slug generation function
 */
export function testSlugGeneration(): void {
  const testCases = [
    { title: "Hello World", id: 123, expected: "hello-world-123" },
    { title: "AI & Machine Learning: What's Next?", id: 456, expected: "ai-machine-learning-whats-next-456" },
    { title: "React.js vs Vue.js: A Comparison", id: 789, expected: "react-js-vs-vue-js-a-comparison-789" },
    { title: "Why PostgreSQL is Better Than MySQL", id: 101, expected: "why-postgresql-is-better-than-mysql-101" },
    { title: "The Future of Web Development", id: 202, expected: "the-future-of-web-development-202" },
    { title: "C++ vs Rust: Performance Comparison", id: 303, expected: "c-vs-rust-performance-comparison-303" },
    { title: "A Very Long Title That Should Be Truncated To Fifty Characters Maximum", id: 404, expected: "a-very-long-title-that-should-be-truncated-to-fifty-404" },
    { title: "Special Characters: @#$%^&*()", id: 505, expected: "special-characters-505" },
    { title: "Multiple---Hyphens---Here", id: 606, expected: "multiple-hyphens-here-606" },
    { title: "---Leading and Trailing---", id: 707, expected: "leading-and-trailing-707" },
  ];

  console.log('Testing slug generation:');
  testCases.forEach(({ title, id, expected }) => {
    const result = generateSlug(title, id);
    const passed = result === expected;
    console.log(`${passed ? '✅' : '❌'} "${title}" (ID: ${id}) -> "${result}" ${passed ? '' : `(expected: "${expected}")`}`);
  });
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSlugGeneration();
}

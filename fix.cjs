const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Remove import API_URL
  content = content.replace(/import\s*\{\s*API_URL\s*\}\s*from\s*['`\"].*?config['`\"];?\r?\n?/g, '');
  
  // Replace fetch(`${API_URL}/api/... with fetch('/api/...
  // We have 3 variations:
  // 1. fetch(`${API_URL}/api/tickets') -> fetch('/api/tickets')
  // 2. fetch(`${API_URL}/api/tickets`, -> fetch('/api/tickets',
  // 3. fetch(`${API_URL}/api/tickets/${id} -> fetch(`/api/tickets/${id}
  content = content.replace(/fetch\(\`\$\{API_URL\}(\/api\/.*?)\'\)/g, "fetch('$1')");
  content = content.replace(/fetch\(\`\$\{API_URL\}(\/api\/.*?)\',\s*\{/g, "fetch('$1', {");
  content = content.replace(/fetch\(\`\$\{API_URL\}(\/api\/.*?\`)/g, "fetch(\`$1");
  
  // Fallback for any trailing single quote mismatch:
  // fetch(`${API_URL}/api/auth/logout', { -> fetch('/api/auth/logout', {
  content = content.replace(/fetch\(\`\$\{API_URL\}(\/api\/.*?)\'/g, "fetch('$1'");
  
  // Catch any remaining `${API_URL}/api/` that starts with backtick and we want it back to string
  content = content.replace(/\`\$\{API_URL\}(\/api\/.*?)\`/g, "\`$1\`");
  
  if (original !== content) {
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});

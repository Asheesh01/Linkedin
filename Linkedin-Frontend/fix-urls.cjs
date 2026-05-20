const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full));
    } else if (['.jsx', '.js'].includes(path.extname(item))) {
      results.push(full);
    }
  }
  return results;
}

const apiFilePath = path.join(srcDir, 'api.js');
const files = getAllFiles(srcDir).filter(f => f !== apiFilePath);

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove ${import.meta.env.VITE_APP_BACKEND_URL} from API call URLs
  // e.g. `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/self` -> `/api/auth/self`
  const newContent = content
    .replace(/`\$\{import\.meta\.env\.VITE_APP_BACKEND_URL\}(\/[^`]*)`/g, (match, urlPath) => {
      changed = true;
      return `'${urlPath}'`;
    })
    // Also handle string concatenation style
    .replace(/import\.meta\.env\.VITE_APP_BACKEND_URL\s*\+\s*['"](\/[^'"]*)['"]/g, (match, urlPath) => {
      changed = true;
      return `'${urlPath}'`;
    });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Fixed URLs in: ${path.relative(srcDir, file)}`);
    count++;
  }
}
console.log(`\nDone! Fixed ${count} files.`);

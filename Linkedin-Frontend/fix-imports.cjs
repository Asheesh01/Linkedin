const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, exts = ['.jsx', '.js']) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full, exts));
    } else if (exts.includes(path.extname(item))) {
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
  if (!content.includes("import api from")) continue;

  const fileDir = path.dirname(file);
  let relPath = path.relative(fileDir, apiFilePath);
  // Normalize to forward slashes and ensure starts with ./
  relPath = relPath.replace(/\\/g, '/');
  if (!relPath.startsWith('.')) relPath = './' + relPath;
  // Remove .js extension
  relPath = relPath.replace(/\.js$/, '');

  // Replace any "import api from '...'" with correct path
  const newContent = content.replace(/import api from ['"][^'"]*['"];?/g, `import api from '${relPath}';`);

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Fixed: ${path.relative(srcDir, file)} -> '${relPath}'`);
    count++;
  }
}
console.log(`\nDone! Fixed ${count} files.`);

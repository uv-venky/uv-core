import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src');
const distDir = path.resolve('dist');

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied ${path.relative(srcDir, src)} to ${path.relative(distDir, dest)}`);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((child) => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else if (stats.isFile() && src.endsWith('.css')) {
    copyFile(src, dest);
  }
}

// Initial copy
copyRecursive(srcDir, distDir);

// Watch mode
if (process.argv.includes('--watch')) {
  console.log('Watching for CSS changes in src/...');
  fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.css')) {
      const srcPath = path.join(srcDir, filename);
      const destPath = path.join(distDir, filename);
      try {
        if (fs.existsSync(srcPath)) {
          copyFile(srcPath, destPath);
        }
      } catch (err) {
        console.error(`Error copying CSS file ${filename}:`, err);
      }
    }
  });
}

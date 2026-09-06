const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove Nav Links
html = html.replace(/<li><a href="#personalized".*?<\/li>\r?\n\s*/g, '');
html = html.replace(/<li><a href="#gallery".*?<\/li>\r?\n\s*/g, '');
html = html.replace(/<li><a href="#corporate".*?<\/li>\r?\n\s*/g, '');

// Remove Sections
html = html.replace(/<!-- ==================== PERSONALIZED \(STUDIO\) ==================== -->[\s\S]*?<!-- ==================== OCCASIONS ==================== -->/, '<!-- ==================== OCCASIONS ==================== -->');

html = html.replace(/<!-- ==================== GALLERY ==================== -->[\s\S]*?<!-- ==================== CONTACT ==================== -->/, '<!-- ==================== CONTACT ==================== -->');

fs.writeFileSync('index.html', html);
console.log('Removed successfully.');

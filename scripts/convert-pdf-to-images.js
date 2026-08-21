import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, '../public/products/product-catalogue-2026.pdf');
const OUTPUT_DIR = path.join(__dirname, '../public/products/catalogue-pages');

async function convertPdfToImages() {
  try {
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`📖 Loading PDF from: ${PDF_PATH}`);
    console.log(`🖼️  Converting PDF to images using ImageMagick...`);

    // Use ImageMagick convert command to convert PDF to PNG
    // This requires ImageMagick to be installed on the system
    try {
      const command = `magick "${PDF_PATH}" -density 150 -quality 90 "${OUTPUT_DIR}/page-%%02d.png"`;
      console.log(`Running: ${command}`);
      execSync(command, { stdio: 'inherit' });
      
      console.log(`\n✅ Successfully converted PDF to images!`);
      console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
    } catch (error) {
      // If ImageMagick is not available, try alternative methods
      console.log('\n⚠️  ImageMagick not found. Trying alternative method...');
      
      // Try with pdftoppm (from poppler-utils) if available
      try {
        const command = `pdftoppm -png -r 150 "${PDF_PATH}" "${OUTPUT_DIR}/page"`;
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        
        // Rename files to match expected format (page-01.png, page-02.png, etc)
        const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('page-') && f.endsWith('.png'));
        files.forEach((file, index) => {
          const oldPath = path.join(OUTPUT_DIR, file);
          const pageNum = String(index + 1).padStart(2, '0');
          const newPath = path.join(OUTPUT_DIR, `page-${pageNum}.png`);
          if (oldPath !== newPath && fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
          }
        });
        
        console.log(`\n✅ Successfully converted ${files.length} pages!`);
        console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
      } catch (pdferror) {
        console.error('\n❌ Neither ImageMagick nor pdftoppm found!');
        console.error('\nTo fix this, install one of the following:');
        console.error('  • ImageMagick: https://imagemagick.org/script/download.php');
        console.error('  • Poppler (pdftoppm): https://github.com/oschwartz10612/poppler-windows/releases/');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error converting PDF to images:', error.message);
    process.exit(1);
  }
}

convertPdfToImages();


const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// List of modules and workbooks to convert
const files = [
  { name: 'Module 1 - FOUNDATION.html', pdf: 'Module 1 - FOUNDATION.pdf' },
  { name: 'Module 1 - FOUNDATION WORKBOOK.html', pdf: 'Module 1 - FOUNDATION WORKBOOK.pdf' },
  { name: 'Module 2 - PLANNING YOUR EMPIRE.html', pdf: 'Module 2 - PLANNING YOUR EMPIRE.pdf' },
  { name: 'Module 2 - PLANNING YOUR EMPIRE WORKBOOK.html', pdf: 'Module 2 - PLANNING YOUR EMPIRE WORKBOOK.pdf' },
  { name: 'Module 3 - BUILDING YOUR SAAS TOOL.html', pdf: 'Module 3 - BUILDING YOUR SAAS TOOL.pdf' },
  { name: 'Module 3 - BUILDING YOUR SAAS TOOL WORKBOOK.html', pdf: 'Module 3 - BUILDING YOUR SAAS TOOL WORKBOOK.pdf' },
  { name: 'Module 4 - MONETIZATION MASTERY.html', pdf: 'Module 4 - MONETIZATION MASTERY.pdf' },
  { name: 'Module 4 - MONETIZATION MASTERY WORKBOOK.html', pdf: 'Module 4 - MONETIZATION MASTERY WORKBOOK.pdf' },
  { name: 'Module 5 - TRAFFIC & GROWTH.html', pdf: 'Module 5 - TRAFFIC & GROWTH.pdf' },
  { name: 'Module 5 - TRAFFIC & GROWTH WORKBOOK.html', pdf: 'Module 5 - TRAFFIC & GROWTH WORKBOOK.pdf' },
  { name: 'Module 6 - SCALING TO 6 FIGURES.html', pdf: 'Module 6 - SCALING TO 6 FIGURES.pdf' },
  { name: 'Module 6 - SCALING TO 6 FIGURES WORKBOOK.html', pdf: 'Module 6 - SCALING TO 6 FIGURES WORKBOOK.pdf' }
];

const modulesDir = path.join(__dirname, 'modules');
const baseUrl = 'file://' + path.resolve(modulesDir).replace(/\\/g, '/') + '/';

async function convertToPDF() {
  console.log('Starting PDF conversion...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const file of files) {
      const htmlPath = path.join(modulesDir, file.name);
      const pdfPath = path.join(modulesDir, file.pdf);
      
      // Check if HTML file exists
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Skipping ${file.name} - file not found`);
        continue;
      }

      console.log(`Converting: ${file.name}...`);
      
      try {
        const page = await browser.newPage();
        
        // Load the HTML file
        await page.goto(baseUrl + encodeURIComponent(file.name), {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Wait for fonts and styles to load
        await page.evaluateHandle('document.fonts.ready');
        await page.waitForTimeout(2000);

        // Generate PDF with good print settings
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
          },
          preferCSSPageSize: false
        });

        await page.close();
        console.log(`✅ Created: ${file.pdf}\n`);
      } catch (error) {
        console.error(`❌ Error converting ${file.name}:`, error.message);
      }
    }

    console.log('PDF conversion complete!');
  } finally {
    await browser.close();
  }
}

// Run the conversion
convertToPDF().catch(console.error);


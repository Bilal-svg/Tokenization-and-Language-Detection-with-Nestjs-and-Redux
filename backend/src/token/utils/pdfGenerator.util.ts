import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { tokenizeText } from './tokenizer.util.js'; // Assuming tokenizeText is in the same folder

// Helper function to read and replace placeholders in the HTML template
const getHtmlContent = (text: string, count: number): string => {
  const templatePath = path.join('./src/token/templates', 'pdfGenerator.html');

  // Read the HTML template file
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Replace the placeholders with dynamic content
  const populatedHtml = template
    .replace('{{text}}', text)
    .replace('{{count}}', count.toString());

  return populatedHtml;
};

export const generatePDF = async (
  text: string,
): Promise<{ filePath: string; fileName: string; count: number }> => {
  try {
    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Input text is invalid or empty');
    }

    const outputDir = path.join(process.cwd(), 'public', 'pdfs');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `text_${Date.now()}.pdf`;
    const filePath = path.resolve(outputDir, fileName);

    // Tokenize the text and get word count
    const { count } = tokenizeText(text);

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Get the populated HTML content
    const htmlContent = getHtmlContent(text, count);

    await page.setContent(htmlContent);

    if (typeof filePath !== 'string' || filePath.trim().length === 0) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    // Generate PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return { fileName, filePath, count };
  } catch (error) {
    console.error('Error during PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

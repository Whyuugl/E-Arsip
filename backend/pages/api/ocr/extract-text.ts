import { NextApiRequest, NextApiResponse } from 'next';
import { createWorker } from 'tesseract.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { convertPDFToImages, cleanupTempFiles } from '../../../utils/pdfConverter';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Parse the form data
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: function ({ mimetype }) {
        // Allow image files and PDF files
        return Boolean(mimetype && (mimetype.includes('image') || mimetype.includes('pdf')));
      }
    });

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    let imagePaths: string[] = [];
    let allExtractedText = '';

    try {
      // Check if file is PDF
      if (file.mimetype && file.mimetype.includes('pdf')) {
        // Convert PDF to images
        const tempDir = path.join(process.cwd(), 'temp', Date.now().toString());
        imagePaths = await convertPDFToImages(file.filepath, tempDir);
        
        // Process each page
        const worker = await createWorker('ind+eng');
        
        for (const imagePath of imagePaths) {
          const { data: { text } } = await worker.recognize(imagePath);
          allExtractedText += text + '\n';
        }
        
        await worker.terminate();
        
        // Clean up PDF file
        fs.unlinkSync(file.filepath);
      } else {
        // Process as image file
        const worker = await createWorker('ind+eng');
        const { data: { text } } = await worker.recognize(file.filepath);
        allExtractedText = text;
        await worker.terminate();
        
        // Clean up image file
        fs.unlinkSync(file.filepath);
      }

      // Return extracted text
      res.status(200).json({
        success: true,
        extractedText: allExtractedText.trim(),
        confidence: 'High',
        language: 'ind+eng',
        fileType: file.mimetype?.includes('pdf') ? 'PDF' : 'Image',
        timestamp: new Date().toISOString()
      });

    } finally {
      // Clean up temporary image files if any
      if (imagePaths.length > 0) {
        cleanupTempFiles(imagePaths);
        // Also clean up the temp directory
        const tempDir = path.dirname(imagePaths[0]);
        try {
          fs.rmdirSync(tempDir);
        } catch (error) {
          console.error('Error cleaning up temp directory:', error);
        }
      }
    }

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process image with OCR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

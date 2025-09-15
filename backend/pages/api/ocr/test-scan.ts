import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    console.log('🔍 Starting OCR test...');

    // Parse the form data
    const form = formidable({
      uploadDir: './uploads/temp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: function ({ mimetype }) {
        return Boolean(mimetype && (mimetype.includes('image') || mimetype.includes('pdf')));
      }
    });

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads', 'temp');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log('📁 Parsing form data...');
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      console.log('❌ No file provided');
      return res.status(400).json({ 
        success: false,
        error: 'No file provided' 
      });
    }

    console.log('📄 File received:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath
    });

    // Check if file exists
    if (!fs.existsSync(file.filepath)) {
      console.log('❌ File does not exist at path:', file.filepath);
      return res.status(400).json({
        success: false,
        error: 'File not found after upload'
      });
    }

    // For testing, just return file info without OCR
    const fileInfo = {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath,
      exists: fs.existsSync(file.filepath)
    };

    console.log('✅ File upload successful');

    // Clean up uploaded file
    try {
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
        console.log('🗑️ File cleaned up');
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }

    res.status(200).json({
      success: true,
      message: 'File upload test successful',
      fileInfo: fileInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ OCR test error:', error);
    res.status(500).json({
      success: false,
      error: 'OCR test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

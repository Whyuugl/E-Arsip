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
    // Parse the form data
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: function ({ mimetype }) {
        // Only allow image files
        return mimetype && mimetype.includes('image');
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
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalFilename || '');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
    const newFilePath = path.join(uploadsDir, fileName);

    // Move file to permanent location
    fs.renameSync(file.filepath, newFilePath);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: fileName,
        originalName: file.originalFilename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/uploads/${fileName}`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

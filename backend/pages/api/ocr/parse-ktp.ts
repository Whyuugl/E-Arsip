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

// Function to parse KTP/KK data from extracted text
const parseKTPData = (text: string) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  let parsedData = {
    namaLengkap: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    nomorAkta: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
    kewarganegaraan: ''
  };

  // Extract NIK (Nomor Induk Kependudukan) - 16 digits
  const nikMatch = text.match(/\b\d{16}\b/);
  if (nikMatch) {
    parsedData.nomorAkta = nikMatch[0];
  }

  // Extract name (usually after "Nama" or "NAMA")
  const nameMatch = text.match(/(?:Nama|NAMA)\s*:?\s*([A-Z\s]+?)(?:\n|$)/i);
  if (nameMatch) {
    parsedData.namaLengkap = nameMatch[1].trim();
  }

  // Extract gender
  const genderMatch = text.match(/(?:Jenis Kelamin|JENIS KELAMIN)\s*:?\s*(LAKI-LAKI|PEREMPUAN|Laki-laki|Perempuan)/i);
  if (genderMatch) {
    const gender = genderMatch[1].toLowerCase();
    parsedData.jenisKelamin = gender.includes('laki') ? 'laki-laki' : 'perempuan';
  }

  // Extract birth place and date
  const birthMatch = text.match(/(?:Tempat\/Tgl Lahir|TEMPAT\/TGL LAHIR)\s*:?\s*([A-Z\s]+),\s*(\d{2})-(\d{2})-(\d{4})/i);
  if (birthMatch) {
    parsedData.tempatLahir = birthMatch[1].trim();
    const [, , day, month, year] = birthMatch;
    parsedData.tanggalLahir = `${year}-${month}-${day}`;
  }

  // Extract address (usually after "Alamat" or "ALAMAT")
  const addressMatch = text.match(/(?:Alamat|ALAMAT)\s*:?\s*([A-Z0-9\s,.-]+?)(?:\n|RT\/RW|Kel\/Desa)/i);
  if (addressMatch) {
    parsedData.alamat = addressMatch[1].trim();
  }

  // Extract religion
  const religionMatch = text.match(/(?:Agama|AGAMA)\s*:?\s*([A-Z\s]+?)(?:\n|$)/i);
  if (religionMatch) {
    parsedData.agama = religionMatch[1].trim();
  }

  // Extract marital status
  const maritalMatch = text.match(/(?:Status Perkawinan|STATUS PERKAWINAN)\s*:?\s*([A-Z\s]+?)(?:\n|$)/i);
  if (maritalMatch) {
    parsedData.statusPerkawinan = maritalMatch[1].trim();
  }

  // Extract occupation
  const occupationMatch = text.match(/(?:Pekerjaan|PEKERJAAN)\s*:?\s*([A-Z\s]+?)(?:\n|$)/i);
  if (occupationMatch) {
    parsedData.pekerjaan = occupationMatch[1].trim();
  }

  // Extract nationality
  const nationalityMatch = text.match(/(?:Kewarganegaraan|KEWARGANEGARAAN)\s*:?\s*([A-Z\s]+?)(?:\n|$)/i);
  if (nationalityMatch) {
    parsedData.kewarganegaraan = nationalityMatch[1].trim();
  }

  return parsedData;
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

      // Parse the extracted text to get structured KTP data
      const parsedData = parseKTPData(allExtractedText);

      // Return parsed data
      res.status(200).json({
        success: true,
        extractedText: allExtractedText.trim(),
        parsedData: parsedData,
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
    console.error('KTP OCR Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process KTP/KK file with OCR',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

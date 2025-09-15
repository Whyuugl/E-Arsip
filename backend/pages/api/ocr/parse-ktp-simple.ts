import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to parse KTP data from extracted text
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
  const nameMatch = text.match(/(?:Nama|NAMA)\s*:?\s*([A-Z\s]+)/i);
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
  const birthPlaceMatch = text.match(/(?:Tempat\/Tgl Lahir|TEMPAT\/TGL LAHIR)\s*:?\s*([A-Z\s]+),\s*\d{2}-\d{2}-\d{4}/i);
  if (birthPlaceMatch) {
    parsedData.tempatLahir = birthPlaceMatch[1].trim();
  }

  // Extract birth date
  const birthDateMatch = text.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (birthDateMatch) {
    const [, day, month, year] = birthDateMatch;
    parsedData.tanggalLahir = `${year}-${month}-${day}`;
  }

  // Extract address (usually after "Alamat" or "ALAMAT")
  const addressMatch = text.match(/(?:Alamat|ALAMAT)\s*:?\s*([A-Z0-9\s,.-]+?)(?:\n|RT\/RW|Kel\/Desa)/i);
  if (addressMatch) {
    parsedData.alamat = addressMatch[1].trim();
  }

  // Extract religion
  const religionMatch = text.match(/(?:Agama|AGAMA)\s*:?\s*([A-Z\s]+)/i);
  if (religionMatch) {
    parsedData.agama = religionMatch[1].trim();
  }

  // Extract marital status
  const maritalMatch = text.match(/(?:Status Perkawinan|STATUS PERKAWINAN)\s*:?\s*([A-Z\s]+)/i);
  if (maritalMatch) {
    parsedData.statusPerkawinan = maritalMatch[1].trim();
  }

  // Extract occupation
  const occupationMatch = text.match(/(?:Pekerjaan|PEKERJAAN)\s*:?\s*([A-Z\s]+)/i);
  if (occupationMatch) {
    parsedData.pekerjaan = occupationMatch[1].trim();
  }

  // Extract nationality
  const nationalityMatch = text.match(/(?:Kewarganegaraan|KEWARGANEGARAAN)\s*:?\s*([A-Z\s]+)/i);
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

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file provided' 
      });
    }

    // Perform OCR on the uploaded file
    const worker = await createWorker('ind+eng'); // Indonesian + English
    
    try {
      // Extract text from image
      const { data: { text } } = await worker.recognize(file.filepath);
      
      console.log('Extracted text:', text);
      
      // Parse the extracted text to get structured data
      const parsedData = parseKTPData(text);
      
      // Clean up uploaded file
      try {
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      } catch (error) {
        console.error('Error cleaning up file:', error);
      }

      res.status(200).json({
        success: true,
        message: 'KTP/KK data extracted successfully',
        data: parsedData,
        rawText: text, // Include raw text for debugging
        timestamp: new Date().toISOString()
      });
      
    } catch (ocrError) {
      console.error('OCR Error:', ocrError);
      
      // Clean up uploaded file
      try {
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
      } catch (error) {
        console.error('Error cleaning up file:', error);
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to process image with OCR',
        details: ocrError instanceof Error ? ocrError.message : 'Unknown OCR error'
      });
    } finally {
      await worker.terminate();
    }

  } catch (error) {
    console.error('Parse KTP Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process KTP/KK file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

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

// Simple text parsing function (without OCR for now)
const parseKTPData = (text: string) => {
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

  return parsedData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    console.log('🔍 Starting simple OCR...');

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
      size: file.size
    });

    // For now, return sample data based on filename
    const filename = file.originalFilename || 'unknown';
    const isKTP = filename.toLowerCase().includes('ktp') || filename.toLowerCase().includes('id');
    
    let sampleData;
    if (isKTP) {
      sampleData = {
        namaLengkap: 'BUDI SANTOSO',
        jenisKelamin: 'laki-laki',
        tempatLahir: 'JAKARTA',
        tanggalLahir: '1990-05-15',
        alamat: 'JL. MERDEKA NO. 123 RT 01 RW 02',
        nomorAkta: '3171031505900001',
        agama: 'ISLAM',
        statusPerkawinan: 'BELUM KAWIN',
        pekerjaan: 'KARYAWAN SWASTA',
        kewarganegaraan: 'WNI'
      };
    } else {
      sampleData = {
        namaLengkap: 'SITI AMINAH',
        jenisKelamin: 'perempuan',
        tempatLahir: 'BANDUNG',
        tanggalLahir: '1985-12-20',
        alamat: 'JL. SUDIRMAN NO. 456 RT 03 RW 04',
        nomorAkta: '3171032012850002',
        agama: 'ISLAM',
        statusPerkawinan: 'KAWIN',
        pekerjaan: 'IBU RUMAH TANGGA',
        kewarganegaraan: 'WNI'
      };
    }

    // Clean up uploaded file
    try {
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
        console.log('🗑️ File cleaned up');
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }

    console.log('✅ Simple OCR completed');

    res.status(200).json({
      success: true,
      message: 'File processed successfully (sample data)',
      data: sampleData,
      fileInfo: {
        originalFilename: file.originalFilename,
        mimetype: file.mimetype,
        size: file.size
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Simple OCR error:', error);
    res.status(500).json({
      success: false,
      error: 'Simple OCR failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import pool from '../../../lib/database';
import { requireAuth, AuthenticatedRequest } from '../../../lib/middleware';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Parse the form data
      const form = formidable({
        uploadDir: './uploads/arsip',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: function ({ mimetype }) {
          // Allow common document and image files
          return mimetype && (
            mimetype.includes('image') || 
            mimetype.includes('pdf') || 
            mimetype.includes('document')
          );
        }
      });

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'uploads', 'arsip');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const [fields, files] = await form.parse(req);
      
      // Extract form fields
      const jenisArsip = Array.isArray(fields.jenis_arsip) ? fields.jenis_arsip[0] : fields.jenis_arsip;
      const nomorAkta = Array.isArray(fields.nomor_akta) ? fields.nomor_akta[0] : fields.nomor_akta;
      const namaLengkap = Array.isArray(fields.nama_lengkap) ? fields.nama_lengkap[0] : fields.nama_lengkap;
      const tempatLahir = Array.isArray(fields.tempat_lahir) ? fields.tempat_lahir[0] : fields.tempat_lahir;
      const tanggalLahir = Array.isArray(fields.tanggal_lahir) ? fields.tanggal_lahir[0] : fields.tanggal_lahir;
      const jenisKelamin = Array.isArray(fields.jenis_kelamin) ? fields.jenis_kelamin[0] : fields.jenis_kelamin;
      const alamat = Array.isArray(fields.alamat) ? fields.alamat[0] : fields.alamat;
      const status = Array.isArray(fields.status) ? fields.status[0] : fields.status || 'pending';

      // Validate required fields
      if (!jenisArsip || !nomorAkta || !namaLengkap || !tempatLahir || !tanggalLahir || !jenisKelamin || !alamat) {
        return res.status(400).json({
          success: false,
          error: 'All required fields must be provided'
        });
      }

      // Handle file upload
      let filePath = null;
      if (files.file) {
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        
        // Generate unique filename
        const fileExtension = path.extname(file.originalFilename || '');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        const newFilePath = path.join(uploadsDir, fileName);

        // Move file to permanent location
        fs.renameSync(file.filepath, newFilePath);
        filePath = `/uploads/arsip/${fileName}`;
      }

      // Insert into database
      const result = await pool.query(
        `INSERT INTO arsip (
          jenis_arsip, nomor_akta, nama_lengkap, tempat_lahir, 
          tanggal_lahir, jenis_kelamin, alamat, status, file_path, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id, jenis_arsip, nomor_akta, nama_lengkap, created_at`,
        [
          jenisArsip, nomorAkta, namaLengkap, tempatLahir,
          tanggalLahir, jenisKelamin, alamat, status, filePath, req.user.id
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Arsip berhasil ditambahkan',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error creating arsip:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'Nomor akta sudah ada dalam database'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get query parameters
      const { page = 1, limit = 10, status, jenis_arsip } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // Build query
      let query = `
        SELECT a.*, u.username as created_by_username 
        FROM arsip a 
        LEFT JOIN users u ON a.created_by = u.id
      `;
      const queryParams = [];
      const conditions = [];

      if (status) {
        conditions.push(`a.status = $${queryParams.length + 1}`);
        queryParams.push(status);
      }

      if (jenis_arsip) {
        conditions.push(`a.jenis_arsip = $${queryParams.length + 1}`);
        queryParams.push(jenis_arsip);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY a.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(Number(limit), offset);

      const result = await pool.query(query, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM arsip a';
      if (conditions.length > 0) {
        countQuery += ` WHERE ${conditions.join(' AND ')}`;
      }
      const countResult = await pool.query(countQuery, queryParams.slice(0, -2));

      res.status(200).json({
        success: true,
        data: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(countResult.rows[0].count),
          totalPages: Math.ceil(Number(countResult.rows[0].count) / Number(limit))
        }
      });

    } catch (error) {
      console.error('Error fetching arsip:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAuth(handler);

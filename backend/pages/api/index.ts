import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'Arsip Kependudukan API Server with OCR',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        ocr: {
          extractText: '/api/ocr/extract-text',
          upload: '/api/ocr/upload'
        }
      },
      features: [
        'OCR Text Extraction',
        'Image Upload',
        'Multi-language Support (Indonesian + English)',
        'File Processing'
      ]
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

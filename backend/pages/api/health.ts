import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'OK',
      message: 'Arsip Kependudukan API Server with OCR',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      features: ['OCR', 'File Upload', 'Text Extraction']
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

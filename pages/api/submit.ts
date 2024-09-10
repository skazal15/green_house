import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!GREENHOUSE_API_KEY) {
        console.error('GREENHOUSE_API_KEY tidak ditemukan dalam variabel lingkungan.');
        return res.status(500).json({ error: 'Konfigurasi server tidak valid' });
    }
    
    if (req.method === 'POST') {
        const form = new IncomingForm();

    try {
      const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      const resume = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      const candidateIdField = fields.candidateId;
      const candidateId = Array.isArray(candidateIdField) ? candidateIdField[0] : candidateIdField;

      if (!resume || !candidateId) {
        return res.status(400).json({ error: 'No resume file uploaded or missing candidate ID' });
      }

      const fileContent = await fs.readFile(resume.filepath);
      const base64Content = fileContent.toString('base64');

      const response = await fetch(`https://harvest.greenhouse.io/v1/candidates/${candidateId}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('f06b2b153e016f8e7c3632627af56b1d-7:').toString('base64')}`,
          'On-Behalf-Of': '1234', // Ganti dengan ID pengguna Greenhouse Anda
        },
        body: JSON.stringify({
          filename: resume.originalFilename || 'resume.pdf',
          type: 'resume',
          content: base64Content,
          content_type: resume.mimetype || 'application/pdf',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ message: 'Resume submitted successfully' });
      } else {
        res.status(response.status).json({ error: 'Failed to submit resume', details: data });
      }
    } catch (error) {
      console.error('Error submitting resume:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
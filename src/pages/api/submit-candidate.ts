import type { NextApiRequest, NextApiResponse } from 'next';

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!GREENHOUSE_API_KEY) {
        console.error('GREENHOUSE_API_KEY tidak ditemukan dalam variabel lingkungan.');
        return res.status(500).json({ error: 'Konfigurasi server tidak valid' });
    }
    
    if (req.method === 'POST') {
        const candidateData = req.body;

    try {
      const response = await fetch('https://harvest.greenhouse.io/v1/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(GREENHOUSE_API_KEY + ':').toString('base64')}`,
          'On-Behalf-Of': 'YOUR_USER_ID', // Change with your greenhouse id
        },
        body: JSON.stringify(candidateData),
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ message: 'Candidate submitted successfully', candidateId: data.id });
      } else {
        res.status(response.status).json({ error: 'Failed to submit candidate', details: data });
      }
    } catch (error) {
      console.error('Error submitting candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

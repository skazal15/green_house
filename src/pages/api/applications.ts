import type { NextApiRequest, NextApiResponse } from 'next';

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!GREENHOUSE_API_KEY) {
    console.error('GREENHOUSE_API_KEY tidak ditemukan dalam variabel lingkungan.');
    return res.status(500).json({ error: 'Konfigurasi server tidak valid' });
  }

  const { page = 1, per_page = 10 } = req.query;
  
  try {
    const response = await fetch(`https://harvest.greenhouse.io/v1/candidates?page=${page}&per_page=${per_page}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(GREENHOUSE_API_KEY + ':').toString('base64')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  
    return res.status(200).json({
      candidates: data,
      total: totalCount,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data kandidat' });
  }
};

export default handler;

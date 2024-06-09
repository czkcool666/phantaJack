import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { didToken } = req.body;

    try {
      const metadata = await magic.users.getMetadataByToken(didToken);
      const token = await magic.users.loginByToken(didToken); // This part may vary

      res.status(200).json({ user: metadata, token });
    } catch (error) {
      console.error('Failed to verify Magic token:', error);
      res.status(500).json({ error: 'Failed to verify Magic token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

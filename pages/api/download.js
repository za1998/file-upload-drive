import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const fileId = req.query.id;
  if (!fileId) return res.status(400).json({ error: 'File ID is required' });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: 'v3', auth });

    const fileMeta = await drive.files.get({
      fileId,
      fields: 'name, mimeType',
    });

    const fileStream = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', fileMeta.data.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileMeta.data.name}"`);

    fileStream.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
}

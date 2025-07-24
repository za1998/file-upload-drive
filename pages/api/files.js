import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const access_token = session.accessToken;
  const email = session.user.email;

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token });

    const drive = google.drive({ version: 'v3', auth });

    // Cari folder berdasarkan email user
    const folderList = await drive.files.list({
      q: `name='${email}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
    });

    if (folderList.data.files.length === 0) {
      return res.status(200).json({ files: [] });
    }

    const folderId = folderList.data.files[0].id;

    const files = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, webViewLink)',
    });

    res.status(200).json({ files: files.data.files });
  } catch (error) {
    console.error('Fetch files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
}

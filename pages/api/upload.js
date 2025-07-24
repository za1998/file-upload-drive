import formidable from 'formidable';
import fs from 'fs';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized: No session or token' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'File parsing failed' });
    }

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: 'File not found' });

    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: session.accessToken });

      const drive = google.drive({ version: 'v3', auth });

      // Cek atau buat folder user
      const folderName = session.user.email;
      const folderQuery = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      let folderId;
      if (folderQuery.data.files.length > 0) {
        folderId = folderQuery.data.files[0].id;
      } else {
        const folder = await drive.files.create({
          resource: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
          },
          fields: 'id',
        });
        folderId = folder.data.id;
      }

      const fileMeta = {
        name: file.originalFilename,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      };

      const response = await drive.files.create({
        resource: fileMeta,
        media,
        fields: 'id',
      });

      res.status(200).json({ fileId: response.data.id });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload gagal' });
    }
  });
}

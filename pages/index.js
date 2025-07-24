import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaSun, FaMoon } from 'react-icons/fa';

export default function Home() {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    const fileInput = e.target.elements.file;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('access_token', session.accessToken);
    formData.append('user_name', session.user.name);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.fileId) {
        setMessage('✅ Upload berhasil!\nFile ID: ' + data.fileId);
      } else {
        setMessage('❌ Upload gagal');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Terjadi kesalahan saat upload');
    }

    setUploading(false);
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  if (!session) {
    return (
      <>
        <GlobalStyle />
        <main className="container">
          <div className="animated-bg" />
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="title">
            Silakan Login Dulu
          </motion.h1>
          <button onClick={() => signIn('google')} className="btn">
            Login dengan Google
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <main className="container">
        <div className="animated-bg" />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex-between">
            <h1 className="heading">Upload ke Google Drive</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          <p className="welcome">Halo, {session.user.name}</p>

          <form onSubmit={handleUpload}>
            <input type="file" name="file" required className="input" />
            <button type="submit" disabled={uploading} className="btn">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <button onClick={fetchFiles} className="btn-text">
            📂 Tampilkan Daftar File
          </button>

          {files.length > 0 && (
            <ul className="file-list">
              {files.map((file) => (
                <li key={file.id}>
                  <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                    📄 {file.name}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="footer">
            by <strong>Muhammad Reza</strong>
          </div>
          <div className="socials">
            <a href="https://www.facebook.com/share/1C61Tf65Xq/" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/kiareza23" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </div>

          <button onClick={() => signOut()} className="logout">
            Logout
          </button>
        </motion.div>
      </main>
    </>
  );
}

function GlobalStyle() {
  return (
    <style jsx global>{`
      body {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        transition: all 0.3s ease;
        overflow-x: hidden;
        position: relative;
      }

      body.light {
        background: #f0f4ff;
        color: #1f2937;
      }

      body.dark {
        background: #0f172a;
        color: #f1f5f9;
      }

      .container {
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }

      .animated-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .animated-bg::before,
      .animated-bg::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle at center, #60a5fa, #2563eb);
        opacity: 0.35;
        animation: blob 25s infinite ease-in-out;
        filter: blur(100px);
      }

      .animated-bg::after {
        background: radial-gradient(circle at center, #a78bfa, #7c3aed);
        width: 500px;
        height: 500px;
        top: 60%;
        left: 60%;
        animation-delay: 8s;
      }

      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-20%, 10%) scale(1.1); }
        50% { transform: translate(10%, -10%) scale(0.9); }
        75% { transform: translate(5%, 15%) scale(1.05); }
      }

      .card {
        position: relative;
        z-index: 2;
        max-width: 480px;
        width: 100%;
        background: rgba(255, 255, 255, 0.9);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      body.dark .card {
        background: rgba(30, 41, 59, 0.95);
        border-color: rgba(255, 255, 255, 0.05);
      }

      .heading {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .welcome {
        margin: 0.5rem 0 1rem;
        font-size: 0.95rem;
      }

      .input {
        width: 100%;
        margin-bottom: 1rem;
        padding: 0.6rem;
        border-radius: 0.5rem;
        border: 1px solid #cbd5e1;
      }

      .btn {
        width: 100%;
        padding: 0.7rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .btn:hover {
        background: #1d4ed8;
      }

      .btn-text {
        margin-top: 1rem;
        background: none;
        color: #2563eb;
        border: none;
        cursor: pointer;
        text-align: center;
        font-size: 0.95rem;
      }

      .file-list {
        margin-top: 1rem;
        font-size: 0.9rem;
      }

      .file-list li {
        margin-bottom: 0.5rem;
      }

      .file-list a {
        color: #2563eb;
        text-decoration: none;
      }

      .message {
        margin-top: 1rem;
        font-size: 0.9rem;
        white-space: pre-line;
        text-align: center;
      }

      .footer {
        margin-top: 2rem;
        font-size: 0.85rem;
        text-align: center;
      }

      .socials {
        margin-top: 0.5rem;
        display: flex;
        justify-content: center;
        gap: 1rem;
        font-size: 1.25rem;
      }

      .logout {
        margin-top: 1.5rem;
        background: none;
        color: #ef4444;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        text-align: center;
      }

      .mode-toggle {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.25rem;
      }
    `}</style>
  );
}

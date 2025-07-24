import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 🌐 Meta PWA */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="application-name" content="Upload File ke Google Drive" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UploadDrive" />
        <meta name="description" content="Aplikasi Upload File ke Google Drive by Muhammad Reza" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 📄 Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* 🖼 Ikon PWA */}
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* 💙 Font (Opsional Modern Look) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased font-inter text-gray-800 bg-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

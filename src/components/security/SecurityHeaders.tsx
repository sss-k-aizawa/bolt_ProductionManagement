import { useEffect } from 'react';

const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // クリックジャッキング対策
    if (window.self !== window.top) {
      // iframeで読み込まれている場合は親ページにリダイレクト
      window.top!.location = window.self.location;
    }

    // セキュリティヘッダーの設定（可能な範囲で）
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'", // クリックジャッキング対策
    ].join('; ');
    
    document.head.appendChild(meta);

    // X-Frame-Options の代替実装
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(frameOptions);
    };
  }, []);

  return null;
};

export default SecurityHeaders;
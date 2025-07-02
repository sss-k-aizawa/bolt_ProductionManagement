import { useState, useEffect } from 'react';
import { generateCSRFToken } from '../utils/security';

export const useCSRF = () => {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // CSRFトークンを生成してセッションストレージに保存
    const generateToken = () => {
      const newToken = generateCSRFToken();
      setToken(newToken);
      sessionStorage.setItem('csrf_token', newToken);
    };

    // 既存のトークンをチェック
    const existingToken = sessionStorage.getItem('csrf_token');
    if (existingToken) {
      setToken(existingToken);
    } else {
      generateToken();
    }

    // 定期的にトークンを更新（30分ごと）
    const interval = setInterval(generateToken, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const validateToken = (submittedToken: string): boolean => {
    return submittedToken === token && token !== '';
  };

  return { token, validateToken };
};
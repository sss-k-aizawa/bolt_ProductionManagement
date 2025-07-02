/**
 * セキュリティユーティリティ関数
 */

// SQLインジェクション対策
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // 危険な文字をエスケープ
  return input
    .replace(/'/g, "''")
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, ''); // NULL文字を除去
};

// XSS対策
export const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
};

// ディレクトリトラバーサル対策
export const sanitizePath = (path: string): string => {
  if (typeof path !== 'string') return '';
  
  // 危険なパス文字を除去
  return path
    .replace(/\.\./g, '') // ../ を除去
    .replace(/\\/g, '/') // バックスラッシュを正規化
    .replace(/\/+/g, '/') // 連続するスラッシュを正規化
    .replace(/^\//, '') // 先頭のスラッシュを除去
    .replace(/\/$/, ''); // 末尾のスラッシュを除去
};

// メールヘッダインジェクション対策
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') return '';
  
  // メールヘッダインジェクションを防ぐ
  return email
    .replace(/[\r\n]/g, '') // 改行文字を除去
    .replace(/[%\x00-\x1f\x7f]/g, '') // 制御文字を除去
    .trim();
};

// HTTPヘッダインジェクション対策
export const sanitizeHeader = (header: string): string => {
  if (typeof header !== 'string') return '';
  
  return header
    .replace(/[\r\n]/g, '') // CRLF インジェクションを防ぐ
    .replace(/[%\x00-\x1f\x7f]/g, '') // 制御文字を除去
    .trim();
};

// バッファオーバーフロー対策（文字列長制限）
export const limitLength = (input: string, maxLength: number): string => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength);
};

// 入力値の総合的なサニタイズ
export const sanitizeUserInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') return '';
  
  return limitLength(
    escapeHtml(
      sanitizeInput(input)
    ),
    maxLength
  );
};

// CSRFトークン生成
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// セキュアなランダム文字列生成
export const generateSecureRandom = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

// パスワード強度チェック
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を含む必要があります');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('小文字を含む必要があります');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('数字を含む必要があります');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('特殊文字を含む必要があります');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// URLの検証
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// ファイル名のサニタイズ
export const sanitizeFileName = (fileName: string): string => {
  if (typeof fileName !== 'string') return '';
  
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 安全な文字のみ許可
    .replace(/\.+/g, '.') // 連続するドットを正規化
    .replace(/^\./, '') // 先頭のドットを除去
    .slice(0, 255); // ファイル名長制限
};
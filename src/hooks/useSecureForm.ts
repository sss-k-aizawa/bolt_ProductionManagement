import { useState } from 'react';
import { sanitizeUserInput, limitLength } from '../utils/security';
import { useCSRF } from './useCSRF';

interface SecureFormConfig {
  maxLength?: number;
  required?: boolean;
}

export const useSecureForm = <T extends Record<string, any>>(
  initialValues: T,
  fieldConfigs: Record<keyof T, SecureFormConfig> = {}
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const { token: csrfToken } = useCSRF();

  const setValue = (field: keyof T, value: any) => {
    const config = fieldConfigs[field] || {};
    const maxLength = config.maxLength || 1000;
    
    // 文字列の場合はサニタイズ
    const sanitizedValue = typeof value === 'string' 
      ? sanitizeUserInput(value, maxLength)
      : value;

    setValues(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.entries(fieldConfigs).forEach(([field, config]) => {
      const value = values[field as keyof T];
      
      if (config.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[field as keyof T] = 'この項目は必須です';
      }
      
      if (typeof value === 'string' && config.maxLength && value.length > config.maxLength) {
        newErrors[field as keyof T] = `${config.maxLength}文字以内で入力してください`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSecureFormData = () => ({
    ...values,
    csrf_token: csrfToken
  });

  return {
    values,
    errors,
    setValue,
    validate,
    getSecureFormData,
    csrfToken
  };
};
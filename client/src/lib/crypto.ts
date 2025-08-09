// Simple client-side encryption utilities
// Note: In production, consider using more robust encryption libraries

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const generatePassword = (length: number = 16): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

export const getStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'text-error';
    case 'medium': return 'text-warning';
    case 'strong': return 'text-success';
    default: return 'text-muted-foreground';
  }
};

export const getStrengthBgColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'bg-error';
    case 'medium': return 'bg-warning';
    case 'strong': return 'bg-success';
    default: return 'bg-muted';
  }
};

// Simple encryption (for demo purposes - use proper encryption in production)
export const encryptPassword = async (password: string, userKey?: string): Promise<string> => {
  // In production, implement proper encryption using Web Crypto API
  // For now, we'll use a simple base64 encoding
  return btoa(password);
};

export const decryptPassword = async (encryptedPassword: string, userKey?: string): Promise<string> => {
  // In production, implement proper decryption using Web Crypto API
  // For now, we'll use simple base64 decoding
  try {
    return atob(encryptedPassword);
  } catch (error) {
    return encryptedPassword; // Return as-is if decoding fails
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

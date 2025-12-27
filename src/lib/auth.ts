export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function clearStoredToken(): void {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('herbalgarden_username');
  localStorage.removeItem('herbalgarden_email');
  localStorage.removeItem('herbalgarden_user_id');
}

export function setUserData(userData: { name: string; email: string; id?: string }) {
  localStorage.setItem('herbalgarden_username', userData.name);
  localStorage.setItem('herbalgarden_email', userData.email);
  if (userData.id) {
    localStorage.setItem('herbalgarden_user_id', userData.id);
  }
}

export function getUserData(): { name: string; email: string; id?: string } | null {
  const name = localStorage.getItem('herbalgarden_username');
  const email = localStorage.getItem('herbalgarden_email');
  const id = localStorage.getItem('herbalgarden_user_id');
  
  if (!name || !email) return null;
  
  return { name, email, id: id || undefined };
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const [, payloadB64] = token.split('.');
    if (!payloadB64) return true; // if token not JWT-shaped, treat as present
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp > nowSec;
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  // Allow dev bypass via Vite env: VITE_DEV_BYPASS_AUTH=true
  // Using optional chaining to avoid type friction across envs
  const bypass = (import.meta as { env?: { VITE_DEV_BYPASS_AUTH?: string | boolean } })?.env?.VITE_DEV_BYPASS_AUTH;
  if (bypass === true || bypass === 'true') return true;
  return isTokenValid(getStoredToken());
}


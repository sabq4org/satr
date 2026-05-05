import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE = 'satr_session';
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'satr-default-secret-change-me'
  );
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'satr-admin'; // غيره عبر .env.local
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function createSessionToken(): string {
  const issued = Date.now().toString();
  const sig = sign(issued);
  return `${issued}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split('.');
  if (!issued || !sig) return false;
  const expected = sign(issued);
  if (sig !== expected) return false;
  const age = Date.now() - Number(issued);
  if (Number.isNaN(age) || age < 0 || age > SESSION_DURATION * 1000) return false;
  return true;
}

export function checkPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!password || password.length !== expected.length) {
    // محاولة وقت ثابت قدر الإمكان
    crypto.timingSafeEqual(
      Buffer.from(password.padEnd(expected.length, ' ')),
      Buffer.from(expected),
    );
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export const SESSION_MAX_AGE = SESSION_DURATION;

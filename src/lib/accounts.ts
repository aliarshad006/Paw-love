import { initAnonymousAuth, saveUserDoc, getUserDoc, deleteUserDoc, deleteProfileFromFirestore } from './firebase';

const ACC = 'ruffluck_accounts';
const SES = 'ruffluck_session';
type Accounts = Record<string, { hash: string; createdAt: number }>;
type Result = { ok: boolean; error?: string };

const readAcc = (): Accounts => { try { return JSON.parse(localStorage.getItem(ACC) || '{}'); } catch { return {}; } };
const writeAcc = (a: Accounts) => localStorage.setItem(ACC, JSON.stringify(a));
const clean = (u: string) => u.trim().toLowerCase();

export const getSession = (): string | null => localStorage.getItem(SES);
export const profileIdFor = (u: string) => `u_${u}`;

function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T | null> {
  return Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]).catch(() => null);
}

async function hashPw(u: string, p: string): Promise<string> {
  const text = `ruffluck:${u}:${p}`;
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return 'x' + (h >>> 0).toString(16);
  }
}

export async function register(username: string, password: string): Promise<Result> {
  const u = clean(username);
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return { ok: false, error: 'Username: 3-20 letters, numbers or _' };
  if (password.length < 4) return { ok: false, error: 'Password needs at least 4 characters' };
  const acc = readAcc();
  if (acc[u]) return { ok: false, error: 'That username is taken' };
  const authResult = await withTimeout(initAnonymousAuth());
  if (!authResult?.user) return { ok: false, error: authResult?.error || 'Could not connect to the account service. Please try again.' };
  const existing = await withTimeout(getUserDoc(u));
  if (existing) return { ok: false, error: 'That username is taken' };
  const hash = await hashPw(u, password);
  if (!await withTimeout(saveUserDoc(u, hash))) {
    return { ok: false, error: 'Could not save your account. Check your connection and try again.' };
  }
  acc[u] = { hash, createdAt: Date.now() };
  writeAcc(acc);
  localStorage.setItem(SES, u);
  return { ok: true };
}

export async function login(username: string, password: string): Promise<Result> {
  const u = clean(username);
  const hash = await hashPw(u, password);
  const acc = readAcc();
  const bad: Result = { ok: false, error: 'Wrong username or password' };
  if (acc[u]) {
    if (acc[u].hash !== hash) return bad;
  } else {
    const authResult = await withTimeout(initAnonymousAuth());
    if (!authResult?.user) return { ok: false, error: authResult?.error || 'Could not connect to the account service. Please try again.' };
    const cloud = await withTimeout(getUserDoc(u));
    if (cloud === null) return { ok: false, error: 'Could not reach your account. Check your connection and try again.' };
    if (!cloud || cloud.hash !== hash) return bad;
    acc[u] = { hash, createdAt: Date.now() };
    writeAcc(acc);
  }
  localStorage.setItem(SES, u);
  return { ok: true };
}

export async function changePassword(oldPw: string, newPw: string): Promise<Result> {
  const u = getSession();
  if (!u) return { ok: false, error: 'Not logged in' };
  if (newPw.length < 4) return { ok: false, error: 'Password needs at least 4 characters' };
  const acc = readAcc();
  if (!acc[u] || acc[u].hash !== (await hashPw(u, oldPw))) return { ok: false, error: 'Old password is wrong' };
  const hash = await hashPw(u, newPw);
  if (!await withTimeout(saveUserDoc(u, hash))) {
    return { ok: false, error: 'Could not update your password. Check your connection and try again.' };
  }
  acc[u].hash = hash;
  writeAcc(acc);
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(SES);
  location.reload();
}

export async function deleteAccountEverywhere(): Promise<void> {
  const u = getSession();
  if (!u) return;
  await withTimeout(initAnonymousAuth());
  await withTimeout(deleteProfileFromFirestore(profileIdFor(u)));
  await withTimeout(deleteUserDoc(u));
  const acc = readAcc();
  delete acc[u];
  writeAcc(acc);
  Object.keys(localStorage).filter((k) => k.startsWith(`ruffluck_${u}_`)).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(SES);
  location.reload();
}

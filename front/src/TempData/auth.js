// src/TempData/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/users',
  headers: { 'Content-Type': 'application/json' },
});

// === Cookie utilities ===
export function setCookie(name, value, days = 30) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
}

export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

// === Auth header builder ===
export function authHeader(tokenName = 'access_token') {
  const token = getCookie(tokenName);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// === Register ===
// POST /users/registration
// { email, password, role } → { id, email, role }
export async function register(email, password, role = 'user') {
  const { data } = await api.post('/registration', { email, password, role });
  return data;
}

// === Login ===
// POST /users/login
// { email, password } → { access_token, token_type, refresh_token }
export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  // save tokens
  setCookie('access_token', data.access_token, 1);
  setCookie('refresh_token', data.refresh_token, 30);
  // preload profile into cookies
  const profile = await getProfile();
  setCookie('user_id', profile.id, 30);
  setCookie('user_email', profile.email, 30);
  setCookie('user_role', profile.role, 30);
  return data;
}

// === Get current profile ===
// GET /users/profile → { id, email, role }
export async function getProfile() {
  const { data } = await api.get('/profile', { headers: authHeader() });
  return data;
}

// === Refresh access token ===
// POST /users/refresh → new access token (string)
export async function refreshToken() {
  const { data } = await api.post('/refresh', {}, {
    headers: authHeader('refresh_token'),
  });
  setCookie('access_token', data, 1);
  return data;
}

// === Logout ===
export function logout() {
  ['access_token', 'refresh_token', 'user_id', 'user_email', 'user_role']
    .forEach(clearCookie);
}

// === Helpers ===
export function getAccessToken() { return getCookie('access_token'); }
export function getRefreshToken() { return getCookie('refresh_token'); }
export function getUserId() { return getCookie('user_id'); }
export function getUserEmail() { return getCookie('user_email'); }
export function getUserRole() { return getCookie('user_role'); }

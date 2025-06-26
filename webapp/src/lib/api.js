import Router from 'next/router'; 
const API_URL = 'http://localhost:8000/game'; 

export async function getBoard() {
  const res = await fetch(`${API_URL}/board`);
  return res.json();
}

export async function initializeBoard(size) {
  const res = await fetch(`${API_URL}/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ size }),
  });
  return res.json();
}

export async function makeMove(position, difficulty) {
  const res = await fetch(`${API_URL}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ position, difficulty }), 
  });
  return res.json();
}

export async function resetGame() {
  const res = await fetch(`${API_URL}/reset`, { method: 'POST' });
  return res.json();
}
export async function registerUser(username, password) {
  const res = await fetch('http://localhost:8000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }), 
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Register error');
  }

  return res.json();
}
export async function login(username, password) {
  const res = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Auth error');
  }

  const data = await res.json();
  
  document.cookie = `token=${data.access_token}; path=/; secure`;

  return data;
}


export async function logout() {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (token) {
    await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  document.cookie = 'token=; Max-Age=0; path=/';
  Router.push('/login');
}
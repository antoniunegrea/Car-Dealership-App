import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/auth/login';
const USERNAME = 'Toni';
const PASSWORD = 'user';
const ACTIONS_TO_LOG = 10;
const INTERVAL_MS = 2000; // 2 seconds

let actionCount = 0;
let intervalId: NodeJS.Timeout;

async function login() {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    });
    if (!res.ok) {
        console.error('Login failed');
        return;
    }
    const data = await res.json();
    console.log(`Login #${actionCount}: token=${data.token}`);
}

async function periodicLogin() {
    console.log('periodicLogin');
    actionCount++;
    await login();
    if (actionCount >= ACTIONS_TO_LOG) {
        clearInterval(intervalId);
        console.log('Done logging in!');
    }
}

export function startLoginGenerator() {
    intervalId = setInterval(periodicLogin, INTERVAL_MS);
}
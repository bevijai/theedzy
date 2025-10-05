import fetch from 'node-fetch';

async function run() {
  const url = 'http://localhost:4000/api/llm';
  const body = { elements: ['N','O'], depth: 'short' };
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    console.log('Response:', JSON.stringify(j, null, 2));
  } catch (err) {
    console.error('Test failed', err);
  }
}

run();

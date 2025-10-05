import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { findPossibleCompounds } from './compounds.js';

dotenv.config();

// Load the system prompt template (if present)
let systemPrompt = '';
try {
  systemPrompt = await fs.readFile(new URL('./prompt_templates/professor_prompt.txt', import.meta.url), 'utf8');
} catch (err) {
  console.warn('[mock-llm] prompt template not found, continuing with defaults');
}

const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'mock').toLowerCase();

async function callProvider(elements, depth, localMatches = []) {
  if (LLM_PROVIDER === 'mock') return null;
  const key = process.env.LLM_API_KEY;
  if (!key) {
    console.warn('[mock-llm] LLM_PROVIDER set but no LLM_API_KEY found in env');
    return null;
  }

  // Build a compact user payload the model can parse
  const userPayload = JSON.stringify({ elements, depth, localMatches });

  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: userPayload });

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: process.env.LLM_MODEL || 'gpt-4o-mini', messages, temperature: 0.2, max_tokens: 800 })
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error('[mock-llm] provider error', resp.status, t);
      return null;
    }

    const j = await resp.json();
    const content = j?.choices?.[0]?.message?.content;
    if (!content) return null;

    // Provider is instructed to return JSON only. Try to parse it.
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (err) {
      console.error('[mock-llm] failed to parse provider JSON:', err);
      return null;
    }
  } catch (err) {
    console.error('[mock-llm] provider call failed', err);
    return null;
  }
}

// Persist new compounds returned by the provider into server/compounds.js
async function persistCompounds(newCompounds) {
  if (!Array.isArray(newCompounds) || newCompounds.length === 0) return [];
  const filePath = new URL('./compounds.js', import.meta.url);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // naive parse: look for `export const compounds = [` and append JSON entries
    const marker = 'export const compounds = ';
    const start = content.indexOf(marker);
    if (start === -1) return [];
    // to avoid complex AST edits, we'll write new file by importing existing array at runtime
    // and appending unique entries based on formula
    const existing = (await import('./compounds.js')).compounds;
    const existingFormulas = new Set(existing.map(c => c.formula));
    const toAdd = [];
    for (const c of newCompounds) {
      if (!c || !c.formula) continue;
      if (existingFormulas.has(c.formula)) continue;
      // basic validation: formula string, elements array with symbol+count
      if (!Array.isArray(c.elements)) continue;
      const valid = c.elements.every(e => e && typeof e.symbol === 'string' && typeof e.count === 'number');
      if (!valid) continue;
      toAdd.push({ formula: c.formula, name: c.name || '', elements: c.elements });
    }
    if (toAdd.length === 0) return [];

    // Rebuild the file by appending the new entries in JS array syntax
    const beforeArray = content.substring(0, content.indexOf('[', start) + 1);
    const afterArray = content.substring(content.lastIndexOf(']'));
    const entriesText = toAdd.map(c => `\n  { formula: '${c.formula}', name: '${c.name.replace(/'/g, "\\'")}', elements: [ ${c.elements.map(e => `{ symbol: '${e.symbol}', count: ${e.count} }`).join(', ')} ] }`).join(',');
    const newContent = beforeArray + content.substring(content.indexOf('[', start) + 1, content.lastIndexOf(']')) + (content.trim().endsWith('];') ? ',' : ',') + entriesText + afterArray;

    await fs.writeFile(filePath, newContent, 'utf8');
    return toAdd;
  } catch (err) {
    console.error('[mock-llm] error persisting compounds', err);
    return [];
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Lightweight mock LLM endpoint. In production this would call an LLM provider
// and perform retrieval-augmented generation. The endpoint accepts { elements: string[], depth?: 'short'|'long' }
app.post('/api/llm', async (req, res) => {
  console.log('[mock-llm] incoming request', { path: req.path, body: req.body });
  const { elements = [], depth = 'short' } = req.body || {};
  const joined = (elements || []).join(' + ');

  // Compute possible dataset matches (simple symbol membership + equality)
  const possibleCompounds = findPossibleCompounds(elements || []);

  // If a real provider is configured, try calling it and return its structured reply.
  try {
    const remote = await callProvider(elements || [], depth || 'short', possibleCompounds);
    if (remote) {
      // Ensure we always include localPossible as a fallback
      if (!remote.possibleCompounds) remote.possibleCompounds = possibleCompounds;
      // Persist any returned possibleCompounds that are new
      try {
        const added = await persistCompounds(remote.possibleCompounds || []);
        if (added && added.length > 0) {
          // include what was added for visibility
          remote.persisted = added;
        }
      } catch (err) {
        console.error('[mock-llm] persist step failed', err);
      }
      return res.json(remote);
    }
  } catch (err) {
    console.error('[mock-llm] provider returned an error, falling back to local mock', err);
  }

  // Simple mock behavior: special-case common pairs, otherwise return a structured professor note
  if (elements.includes('O') && elements.includes('F')) {
    return res.json({
      summary: `O + F can form reactive species such as OF₂ and O₂F₂.`,
      explanation: depth === 'long' ? `Oxygen difluoride (OF₂) and dioxygen difluoride (O₂F₂) are real but highly reactive compounds. OF₂ is produced from oxygen and fluorine under controlled conditions and is a strong oxidizer; O₂F₂ is even more reactive and typically handled only at low temperatures in specialized labs. These species are dangerous and not encountered in simple classroom demonstrations. Use authoritative references when handling such materials.` : `OF₂ and O₂F₂ exist; they are highly reactive and handled under strict conditions.`,
      citations: [
        { text: 'Oxygen difluoride — PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov/compound/Oxygen-difluoride' },
        { text: 'Dioxygen difluoride — Wikipedia', url: 'https://en.wikipedia.org/wiki/Dioxygen_difluoride' }
      ],
      possibleCompounds
    });
  }

  if (elements.includes('Na') && elements.includes('O')) {
    return res.json({
      summary: `Na and O commonly form sodium oxide (Na₂O) or related oxides.`,
      explanation: `Sodium readily forms ionic oxides; Na₂O is a standard sodium oxide. In aqueous conditions sodium forms hydroxide (NaOH) readily. Stoichiometry matters (Na₂O requires two Na atoms per O).`,
      citations: [ { text: 'Sodium oxide — Wikipedia', url: 'https://en.wikipedia.org/wiki/Sodium_oxide' } ],
      possibleCompounds
    });
  }

  if (elements.includes('C') && elements.includes('O')) {
    return res.json({
      summary: `C + O commonly form carbon oxides such as CO₂ and CO.`,
      explanation: `Carbon and oxygen form two common binary oxides: carbon dioxide (CO₂), where carbon is fully oxidized, and carbon monoxide (CO), an incomplete oxidation product. CO₂ is stable under normal conditions; CO is a toxic gas produced by incomplete combustion. Stoichiometry and reaction conditions determine which forms.`,
      citations: [
        { text: 'Carbon dioxide — Wikipedia', url: 'https://en.wikipedia.org/wiki/Carbon_dioxide' },
        { text: 'Carbon monoxide — Wikipedia', url: 'https://en.wikipedia.org/wiki/Carbon_monoxide' }
      ],
      possibleCompounds
    });
  }

  // Default professor-style reply
  return res.json({
    summary: `${joined || 'Selected elements'} — I couldn't find a direct match in the local dataset.`,
    explanation: depth === 'long' ? `Professor note: For ${joined}, there may be several reasons we don't present a simple compound here: mismatched oxidation states, noble-gas inertness, or compounds that only exist under extreme conditions (high pressure, plasma, cryogenic). If you want, enable web retrieval to find rare/exotic species and I will return citations.` : `No obvious simple compound found; check oxidation states and stoichiometry or enable web retrieval.`,
    citations: [],
    possibleCompounds
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Mock LLM server listening on http://localhost:${port}`));

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', pid: process.pid, uptime: process.uptime() });
});

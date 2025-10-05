import React, { useState, useMemo, useEffect, useRef } from 'react';
import { elements } from '../data/elements';
import { compounds } from '../data/compounds';
import Confetti from './Confetti';
import Certificate from './Certificate';

type Question = {
  prompt: string;
  choices: string[];
  answer: string;
  id?: string;
  elementAtomicNumber?: number | null;
};

function randomChoices(correct: string, others: string[], count = 4) {
  const pool = [...others];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const choices = [correct, ...pool.slice(0, Math.max(0, count - 1))];
  return choices.sort(() => Math.random() - 0.5);
}

const LEVEL_COUNT = 10;
const LEVEL_CONFIG: { poolSize: number; timePerQuestion: number; passingScore: number; questionsPerLevel: number; difficulty: 'Easy'|'Medium'|'Hard' }[] = Array.from({ length: LEVEL_COUNT }).map((_, i) => {
  const poolSize = Math.min(60, 12 + i * 4);
  const timePerQuestion = Math.max(10, 26 - Math.floor(i * 1.3));
  const passingScore = Math.ceil(60 + i * 4);
  // enforce 10 questions per level for consistent progression
  const questionsPerLevel = 10;
  const difficulty = i <= 2 ? 'Easy' : i <= 6 ? 'Medium' : 'Hard';
  return { poolSize, timePerQuestion, passingScore, questionsPerLevel, difficulty };
});

const generateClue = (q?: Question) => {
  if (!q) return 'No clue available.';
  try {
    const id = q.id || '';
    const el = (typeof q.elementAtomicNumber === 'number') ? elements.find(e => e.atomicNumber === q.elementAtomicNumber) : null;

    // Symbol -> Name
    if (id.includes('sym->name')) {
      if (el) return `The name starts with "${el.name.charAt(0)}" and it is classified as ${el.category || 'an element'}.`;
      const m = q.prompt.match(/symbol\s+([A-Za-z]{1,2})/i);
      if (m) return `Its symbol is ${m[1]}; the name often starts with "${m[1].charAt(0)}".`;
    }

    // Name -> Symbol
    if (id.includes('name->sym')) {
      if (el) return `The chemical symbol starts with "${el.symbol.charAt(0)}"${el.symbol.length > 1 ? ` and the second letter is "${el.symbol.charAt(1)}"` : ''}.`;
    }

    // Atomic number <-> Name
    if (id.includes('num->name') || id.includes('name->num')) {
      if (el) return `This element is in period ${el.period ?? 'unknown'}${el.group ? `, group ${el.group}` : ''}. It's ${el.category || 'a typical element'}; that may help narrow choices.`;
      return 'Atomic numbers increase left-to-right across the periodic table; consider position.';
    }

    // Uses / fun-fact -> element
    if (id.includes('use->name')) {
      if (el) {
        const hint = Array.isArray(el.uses) && el.uses.length ? el.uses[0] : (Array.isArray(el.funFacts) && el.funFacts.length ? el.funFacts[0] : null);
        if (hint) return hint.split('.').slice(0,1)[0];
      }
      return 'Think about which elements are common in that application.';
    }

    // Compound-related clues
    if (id.startsWith('cmp:') || id.includes('cmpmulti') || id.includes('cmpname')) {
      // Try extract formula from id
      const m = id.match(/cmp:([^#:]*)/);
      let formula = m ? m[1] : '';
      if (!formula && q.answer && /^[A-Za-z0-9()]+$/.test(String(q.answer))) formula = String(q.answer);
      if (formula) {
        const syms = (formula.match(/([A-Z][a-z]?)/g) || []);
        if (syms.length) return `Contains element: ${syms[0]}. Consider its common valence.`;
      }
      // fallback: if we have an element seed, mention it
      if (el) return `This compound involves ${el.name} (${el.symbol}).`;
      return 'Consider common ions and valences for the elements in the formula.';
    }

    // Electron configuration
    if (id.includes('ecfg')) {
      if (el && el.electronConfiguration) {
        const parts = String(el.electronConfiguration).split(' ');
        const last = parts[parts.length - 1];
        return `The configuration ends with ${last}; that indicates the valence shell.`;
      }
      return 'Look at the outer shell electrons to identify the element.';
    }

    // Oxidation state
    if (id.includes('ox:')) {
      const mm = id.match(/ox:([^#:]*)/);
      if (mm) return `A common oxidation state is ${mm[1]}.`;
    }

    // Generic fallback that uses element metadata where possible
    if (el) return `Think about ${el.category || 'its chemical family'}; the name starts with "${el.name.charAt(0)}".`;
  } catch (e) {
    // ignore and fall through
  }
  return 'Try eliminating clearly wrong choices to increase your odds.';
};

const loadHtml2Canvas = async () => {
  const w = window as any;
  if (w.html2canvas) return w.html2canvas;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await (new Function('return import("html2canvas")')());
    return (mod as any).default ?? (mod as any).html2canvas ?? mod;
  } catch (err) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    document.head.appendChild(s);
    await new Promise((r) => (s.onload = r));
    return (window as any).html2canvas;
  }
};

const loadJsPDF = async () => {
  const w = window as any;
  if (w.jspdf || w.jsPDF) return w.jspdf?.jsPDF ?? w.jspdf ?? w.jsPDF;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await (new Function('return import("jspdf")')());
    return (mod as any).jsPDF ?? (mod as any).default ?? mod;
  } catch (err) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    document.head.appendChild(s);
    await new Promise((r) => (s.onload = r));
    const globalPdf = (window as any).jspdf ?? (window as any).jsPDF ?? (window as any).pdf;
    return globalPdf?.jsPDF ?? globalPdf;
  }
};

const Quiz: React.FC = () => {
  const certificateNode = useRef<HTMLDivElement | null>(null);

  const exportCertificatePNG = async () => {
    if (!certificateNode.current) return;
    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(certificateNode.current, { scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `certificate-${(localStorage.getItem('userName') || 'student').replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const exportCertificatePDF = async () => {
    if (!certificateNode.current) return;
    const html2canvas = await loadHtml2Canvas();
    const jsPDFLib = await loadJsPDF();
    const canvas = await html2canvas(certificateNode.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const PDFCtor = (jsPDFLib && (jsPDFLib.jsPDF ?? jsPDFLib.default ?? jsPDFLib));
    const pdf = new PDFCtor({ orientation: 'landscape', unit: 'pt', format: [820, 580] });
    pdf.addImage(imgData, 'PNG', 0, 0, 820, 580);
    pdf.save(`certificate-${(localStorage.getItem('userName') || 'student').replace(/\s+/g, '_')}.pdf`);
  };

  const exportSelectedCertificatesPDF = async () => {
    if (selectedBadges.length === 0) return;
    const html2canvas = await loadHtml2Canvas();
    const jsPDFLib = await loadJsPDF();
    const PDFCtor = (jsPDFLib && (jsPDFLib.jsPDF ?? jsPDFLib.default ?? jsPDFLib));
    const pdf = new PDFCtor({ orientation: 'landscape', unit: 'pt', format: [820, 580] });
    for (let i = 0; i < selectedBadges.length; i++) {
      const badgeIndex = selectedBadges[i];
      const container = document.createElement('div');
      container.style.width = '820px';
      container.style.height = '580px';
      container.style.padding = '36px';
      container.style.background = 'linear-gradient(135deg,#fff 0%, #f8fafc 100%)';
      container.style.border = '6px solid #f59e0b';
  container.innerHTML = `<div style="font-family: Inter, Arial, sans-serif; text-align:center; width:100%;"><div style="font-size:28px;font-weight:700;color:#0f172a">Certificate of Mastery</div><div style="margin-top:12px; font-size:18px">${localStorage.getItem('userName') || 'Student'}</div><div style="margin-top:8px">${badgeName(badgeIndex)}</div></div>`;
      document.body.appendChild(container);
      // eslint-disable-next-line no-await-in-loop
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage([820, 580], 'landscape');
      pdf.addImage(imgData, 'PNG', 0, 0, 820, 580);
      document.body.removeChild(container);
    }
    pdf.save(`badges-${(localStorage.getItem('userName') || 'student').replace(/\s+/g, '_')}.pdf`);
  };

  const badgeName = (n: number) => {
    const NAMES = ['Novice Spark','Element Seeker','Ion Initiate','Bond Breaker','Valence Virtuoso','Periodic Pro','Orbital Officer','Reaction Ranger','Stoichiometry Star','Elemental Master'];
    return NAMES[(n - 1) % NAMES.length] || `Badge ${n}`;
  };

  const [level, setLevel] = useState<number>(() => { try { return Number(localStorage.getItem('quizLevel') || '1'); } catch { return 1; } });
  const [score, setScore] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(LEVEL_CONFIG[Math.max(0, level - 1)].timePerQuestion);
  const [running, setRunning] = useState<boolean>(false);
  const [badges, setBadges] = useState<boolean[]>(() => {
    try { const raw = localStorage.getItem('quizBadges'); return raw ? JSON.parse(raw) : Array(LEVEL_COUNT).fill(false); } catch { return Array(LEVEL_COUNT).fill(false); }
  });

  // Track atomicNumbers asked during this session to avoid repeats
  const [askedSet, setAskedSet] = useState<number[]>(() => {
    try { const raw = localStorage.getItem('quizAsked'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  // Track exact question ids asked (for compound/formula/other types) to avoid repeating identical questions
  const [askedIds, setAskedIds] = useState<string[]>(() => {
    try { const raw = localStorage.getItem('quizAskedIds'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const askedIdsRef = React.useRef<string[]>(askedIds);
  React.useEffect(() => { askedIdsRef.current = askedIds; }, [askedIds]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [clueVisible, setClueVisible] = useState(false);
  const [clueRevealedForIndex, setClueRevealedForIndex] = useState<number | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<number | null>(null);
  const [locksEnabled, setLocksEnabled] = useState<boolean>(() => {
    try { const raw = localStorage.getItem('quizLocksEnabled'); return raw === null ? false : raw === 'true'; } catch { return false; }
  });
  const [levelComplete, setLevelComplete] = useState<{ passed: boolean; level: number; score: number } | null>(null);
  const [showBadgesPanel, setShowBadgesPanel] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<number[]>(() => {
    try { const raw = localStorage.getItem('selectedBadges'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  // Module hero cards: group levels into themed modules
  const MODULES: { id: string; title: string; desc: string; range: [number, number]; emoji: string; color: string }[] = [
    { id: 'mod1', title: 'Symbols & Names', desc: 'Master element symbols and names.', range: [1, 2], emoji: '🔤', color: 'from-indigo-500 to-indigo-600' },
    { id: 'mod2', title: 'Atomic Numbers', desc: 'Identify elements by atomic number.', range: [3, 4], emoji: '🔢', color: 'from-blue-500 to-blue-600' },
    { id: 'mod3', title: 'Uses & Facts', desc: 'Real-world uses and fun facts.', range: [5, 5], emoji: '🧠', color: 'from-emerald-500 to-emerald-600' },
    { id: 'mod4', title: 'Compounds', desc: 'Binary and multi-element compounds.', range: [6, 7], emoji: '⚗️', color: 'from-amber-500 to-amber-600' },
    { id: 'mod5', title: 'Advanced', desc: 'Oxidation, e-config, mixed challenges.', range: [8, 10], emoji: '🚀', color: 'from-fuchsia-500 to-fuchsia-600' },
  ];

  const moduleStats = (range: [number, number]) => {
    const [start, end] = range;
    const total = end - start + 1;
    let completed = 0;
    for (let i = start; i <= end; i++) completed += badges[i - 1] ? 1 : 0;
    const percent = Math.round((completed / total) * 100);
    // next playable level in the module
    let next = start;
    for (let i = start; i <= end; i++) { if (!badges[i - 1]) { next = i; break; } next = Math.min(end, i); }
    // if locks enabled, ensure all previous global levels are earned
    if (locksEnabled) {
      for (let i = 1; i < next; i++) {
        if (!badges[i - 1]) { next = i; break; }
      }
    }
    return { completed, total, percent, nextLevel: next };
  };

  const startModule = (range: [number, number]) => {
    const { nextLevel } = moduleStats(range);
    setLevel(nextLevel);
    // Defer to next tick so state applies before starting
    setTimeout(() => startLevel(nextLevel), 0);
  };

  const resetModule = (range: [number, number]) => {
    const [start, end] = range;
    const copy = [...badges];
    for (let i = start; i <= end; i++) copy[i - 1] = false;
    setBadges(copy);
    try { localStorage.setItem('quizBadges', JSON.stringify(copy)); } catch {}
    // also clear asked question memory to allow fresh questions for those levels
    try { localStorage.removeItem('quizAsked'); } catch {}
    try { localStorage.removeItem('quizAskedIds'); } catch {}
  };

  const questions: Question[] = useMemo(() => {
    const cfg = LEVEL_CONFIG[level - 1];
    const levelPool = elements.slice(0, cfg.poolSize);
    let available = levelPool.filter(el => !askedSet.includes(el.atomicNumber));
    const effectivePool = available.length >= cfg.questionsPerLevel ? available : levelPool;
    const shuffled = [...effectivePool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(cfg.questionsPerLevel, shuffled.length));

    const qs: Question[] = [];
    selected.forEach((el: any, selIdx) => {
      let q: Question | null = null;
      const baseId = `el:${el.atomicNumber}`;

      // Level-specific generators (progressively harder)
      // 1: symbol -> name
      // 2: name -> symbol
      // 3: atomic number -> name
      // 4: name -> atomic number
      // 5: uses/fun-fact -> element
      // 6: simple compound formula -> name (single element + common)
      // 7: intermediate compound (two elements) formula -> name
      // 8: multi-element compound / scenario recognition
      // 9: oxidation state / electron configuration mix
      // 10: mixed challenge (pick 1-3 types randomly for variety)

      if (level === 1) {
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
        q = { prompt: `Which element has the symbol ${el.symbol}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:sym->name`, elementAtomicNumber: el.atomicNumber };
      } else if (level === 2) {
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.symbol);
        q = { prompt: `What is the chemical symbol for ${el.name}?`, choices: randomChoices(el.symbol, others, 4), answer: el.symbol, id: `${baseId}:name->sym`, elementAtomicNumber: el.atomicNumber };
      } else if (level === 3) {
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
        q = { prompt: `Which element has atomic number ${el.atomicNumber}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:num->name`, elementAtomicNumber: el.atomicNumber };
      } else if (level === 4) {
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => String(o.atomicNumber));
        q = { prompt: `What is the atomic number of ${el.name}?`, choices: randomChoices(String(el.atomicNumber), others, 4), answer: String(el.atomicNumber), id: `${baseId}:name->num`, elementAtomicNumber: el.atomicNumber };
  } else if (level === 5) {
        const hint = (el.uses && el.uses.length > 0) ? el.uses[Math.floor(Math.random() * el.uses.length)] : (el.funFacts && el.funFacts.length > 0 ? el.funFacts[0] : `Used in ${el.name}`);
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
        q = { prompt: `Which element is commonly used for: ${hint}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:use->name`, elementAtomicNumber: el.atomicNumber };
      } else if (level === 6) {
        // Level 6: simple compound formula -> common name (prefer compounds with single other element or hydrates)
        let chosenComp: any | null = null;
        try {
          // lazy load compounds from data module if available in scope
          // (we'll import from local module below in code scope)
        } catch (e) {}
        // We'll fallback to element symbol->name if no compound chosen
        const compoundCandidates: any[] = [];
        try {
          const comps = compounds as any[];
          comps.forEach(c => {
            const symbols = c.elements.map((e: any) => e.symbol);
            if (symbols.includes(el.symbol) && symbols.length <= 2) compoundCandidates.push(c);
          });
        } catch (e) {}
        if (compoundCandidates.length > 0) {
          // bias selection by simpler formulas first
          chosenComp = compoundCandidates[Math.floor(Math.random() * compoundCandidates.length)];
          const others = ((): string[] => {
            try {
              const compsAll = compounds as any[];
              return compsAll.filter(c => c.formula !== (chosenComp && chosenComp.formula)).map(c => c.name).slice(0, 10);
            } catch { return []; }
          })();
          q = { prompt: `What is the common name for the compound ${chosenComp.formula}?`, choices: randomChoices(chosenComp.name, others, 4), answer: chosenComp.name, id: `cmp:${chosenComp.formula}`, elementAtomicNumber: el.atomicNumber };
        } else {
          const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
          q = { prompt: `Which element has the symbol ${el.symbol}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:sym->name`, elementAtomicNumber: el.atomicNumber };
        }
      } else if (level === 7) {
        // Level 7: intermediate compound (two elements) name -> formula
        try {
          const compsAll = compounds as any[];
          const containing = compsAll.filter(c => c.elements.map((e: any) => e.symbol).includes(el.symbol) && c.elements.length === 2);
          if (containing.length > 0) {
            const chosen = containing[Math.floor(Math.random() * containing.length)];
            const others = compsAll.filter(c => c.formula !== chosen.formula).map(c => c.formula).slice(0, 10);
            q = { prompt: `What is the chemical formula for ${chosen.name}?`, choices: randomChoices(chosen.formula, others, 4), answer: chosen.formula, id: `cmpname:${chosen.name}`, elementAtomicNumber: el.atomicNumber };
          }
        } catch (e) {}
        if (!q) {
          const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
          q = { prompt: `Which element has the symbol ${el.symbol}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:sym->name`, elementAtomicNumber: el.atomicNumber };
        }
      } else if (level === 8) {
        // Level 8: multi-element compound or scenario recognition (select compounds with 3+ elements) or oxidation clues
        let chosenCompMulti: any | null = null;
        try {
          const compsAll = compounds as any[];
          const multis = compsAll.filter(c => c.elements.length >= 3 && c.elements.map((e:any)=>e.symbol).includes(el.symbol));
          if (multis.length > 0) chosenCompMulti = multis[Math.floor(Math.random() * multis.length)];
        } catch (e) {}
        if (chosenCompMulti) {
          const others = ((): string[] => { try { const compsAll = compounds as any[]; return compsAll.filter(c => c.formula !== chosenCompMulti.formula).map(c => c.formula).slice(0,10); } catch { return []; } })();
          q = { prompt: `Which compound has the formula ${chosenCompMulti.formula}?`, choices: randomChoices(chosenCompMulti.name, others, 4), answer: chosenCompMulti.name, id: `cmpmulti:${chosenCompMulti.formula}`, elementAtomicNumber: el.atomicNumber };
        } else {
          const ox = el.oxidationStates ? String(el.oxidationStates).split(',')[0].trim() : null;
          if (ox) {
            const others = effectivePool.filter((o: any) => String(o.oxidationStates || '').split(',')[0].trim() !== ox).map((o: any) => o.name);
            q = { prompt: `Which element commonly has oxidation state ${ox}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:ox:${ox}`, elementAtomicNumber: el.atomicNumber };
          }
        }
      } else if (level === 9) {
        // Level 9: electron configuration recognition (short)
        if (el.electronConfiguration) {
          const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.electronConfiguration || '').filter(Boolean);
          if (others.length >= 3) {
            q = { prompt: `Which element has the electron configuration ${el.electronConfiguration}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:ecfg`, elementAtomicNumber: el.atomicNumber };
          }
        }
      } else if (level === 10) {
        // Level 10: mixed challenge - randomly pick one of advanced types for variety
        const pick = selIdx % 3;
        if (pick === 0) {
          // oxidation
          const ox = el.oxidationStates ? String(el.oxidationStates).split(',')[0].trim() : null;
          if (ox) {
            const others = effectivePool.filter((o: any) => String(o.oxidationStates || '').split(',')[0].trim() !== ox).map((o: any) => o.name);
            q = { prompt: `Which element commonly has oxidation state ${ox}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:ox:${ox}`, elementAtomicNumber: el.atomicNumber };
          }
        } else if (pick === 1) {
          // electron config
          if (el.electronConfiguration) {
            const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.electronConfiguration || '').filter(Boolean);
            if (others.length >= 3) q = { prompt: `Which element has the electron configuration ${el.electronConfiguration}?`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:ecfg`, elementAtomicNumber: el.atomicNumber };
          }
        } else {
          // compound name
          try {
            const compsAll = compounds as any[];
            const containing = compsAll.filter(c => c.elements.map((e: any) => e.symbol).includes(el.symbol));
            if (containing.length > 0) {
              const chosen = containing[Math.floor(Math.random() * containing.length)];
              const others = compsAll.filter(c => c.formula !== chosen.formula).map(c => c.formula).slice(0, 10);
              q = { prompt: `What is the chemical formula for ${chosen.name}?`, choices: randomChoices(chosen.formula, others, 4), answer: chosen.formula, id: `cmpname:${chosen.name}`, elementAtomicNumber: el.atomicNumber };
            }
          } catch (e) {}
        }
      }

      if (!q) {
        // fallback generic symbol->name
        const others = effectivePool.filter((o: any) => o.atomicNumber !== el.atomicNumber).map((o: any) => o.name);
        q = { prompt: `Which element has the symbol ${el.symbol}? (fallback)`, choices: randomChoices(el.name, others, 4), answer: el.name, id: `${baseId}:sym->name`, elementAtomicNumber: el.atomicNumber };
      }

        // Avoid exact duplicate questions if possible (check against ref to avoid re-triggering memo)
        if ((askedIdsRef.current || []).includes(q.id || '')) {
          q.id = `${q.id}#${Math.random().toString(36).slice(2,6)}`;
        }

      qs.push(q);
    });

    return qs;
  }, [level, askedSet]);

  // Record which atomicNumbers were selected so future levels avoid repeats.
  useEffect(() => {
    try {
      // Persist question ids to avoid exact duplicate questions across sessions
      const qIds = questions.map(q => q.id).filter(Boolean) as string[];
      if (qIds.length === 0) return;
      setAskedIds(prev => {
        const updated = Array.from(new Set([...(prev || []), ...qIds]));
        try { localStorage.setItem('quizAskedIds', JSON.stringify(updated)); } catch {}
        return updated;
      });
    } catch {}
    // only run when questions array changes
  }, [questions]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setRunning(false);
      setTimeLeft(0);
    }
    // Show clue button when time left is below half for Medium/Hard levels
    try {
      const cfg = LEVEL_CONFIG[level - 1];
      if (cfg.difficulty !== 'Easy' && running && timeLeft <= Math.floor(cfg.timePerQuestion / 2) && clueRevealedForIndex !== index) {
        setClueVisible(true);
      } else {
        setClueVisible(false);
      }
    } catch {}
  }, [timeLeft]);

  const startLevel = (lvl = level) => {
    const cfg = LEVEL_CONFIG[lvl - 1];
    setScore(0);
    setIndex(0);
    setTimeLeft(cfg.timePerQuestion);
    setRunning(true);
    // record the atomicNumbers for questions to avoid repeats in future
    try {
  const qAtomic = questions.map(q => q.elementAtomicNumber).filter(Boolean) as number[];
  const qIds = questions.map(q => q.id).filter(Boolean) as string[];
  const updatedNums = Array.from(new Set([...askedSet, ...qAtomic]));
  const updatedIds = Array.from(new Set([...(askedIds || []), ...qIds]));
  setAskedSet(updatedNums);
  setAskedIds(updatedIds);
  try { localStorage.setItem('quizAsked', JSON.stringify(updatedNums)); } catch {}
  try { localStorage.setItem('quizAskedIds', JSON.stringify(updatedIds)); } catch {}
    } catch {}
  };

  const handleAnswer = (choice: string) => {
    const q = questions[index];
    if (choice === q.answer) {
      setScore(s => s + 10);
    }
    setIndex(i => i + 1);
    // next question timer reset
    setTimeLeft(LEVEL_CONFIG[level - 1].timePerQuestion);
    // reset clue visibility for next question
    setClueVisible(false);
    setClueRevealedForIndex(null);
  };

  const revealClue = () => {
    const q = questions[index];
    if (!q || clueRevealedForIndex === index) return;
    // Deduct 2 points (but not below zero)
    setScore(s => Math.max(0, s - 2));
    setClueRevealedForIndex(index);
    setClueVisible(false);
    // Optionally, we could show a short clue derived from the question
  };

  const finishLevel = () => {
    setRunning(false);
    const cfg = LEVEL_CONFIG[level - 1];
  // If locks are disabled for testing, treat as passed
  const passed = !locksEnabled ? true : (score >= cfg.passingScore);
  // show level complete modal/badge regardless of pass/fail
  setLevelComplete({ passed, level, score });
  if (passed) {
      // celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2200);
      const newBadges = [...badges];
      newBadges[level - 1] = true;
      setBadges(newBadges);
  setJustUnlocked(level);
  setTimeout(() => setJustUnlocked(null), 1600);
      try { localStorage.setItem('quizBadges', JSON.stringify(newBadges)); } catch {}
      // advance level if not last
      if (level < LEVEL_COUNT) {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        try { localStorage.setItem('quizLevel', String(nextLevel)); } catch {}
      } else {
        // completed all levels -> show certificate
        setShowCertificate(true);
      }
    } else {
      // failed: keep level the same
    }
  };

  useEffect(() => {
    // if index exceeds questions, finish
    if (index >= questions.length && running) {
  finishLevel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // compute reduced height style when quiz is running
  const containerStyle: React.CSSProperties = running ? { height: '80%' } : {};

  const levelLabel = (lvl: number) => {
    switch (lvl) {
      case 1: return 'Symbol → Name';
      case 2: return 'Name → Symbol';
      case 3: return 'Atomic Number → Name';
      case 4: return 'Name → Atomic Number';
      default: return LEVEL_CONFIG[lvl-1].difficulty + ' challenges';
    }
  };

  return (
    <div style={containerStyle} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-[920px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to Sam's Element Quiz</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">A progressive 10-level challenge — clear each level to unlock the next and earn badges.</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Current: Level <span className="font-medium">{level}</span> of <span className="font-medium">{LEVEL_COUNT}</span></p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-300">Score</div>
          <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{score}</div>
          <div className="mt-2 text-xs text-gray-400">Locks: <button className={`ml-2 px-2 py-1 rounded text-xs ${locksEnabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`} onClick={() => { const next = !locksEnabled; setLocksEnabled(next); try { localStorage.setItem('quizLocksEnabled', String(next)); } catch {} }}>{locksEnabled ? 'Enabled' : 'Disabled'}</button></div>
          {!locksEnabled && (
            <div className="mt-2 text-xs">
              <button className="mr-2 px-2 py-1 text-xs bg-indigo-50 rounded" onClick={() => { setLevel(LEVEL_COUNT); try { localStorage.setItem('quizLevel', String(LEVEL_COUNT)); } catch {} }}>Jump to Level {LEVEL_COUNT}</button>
              <button className="px-2 py-1 text-xs bg-amber-50 rounded" onClick={() => {
                // mark all badges earned and show certificate for testing
                const all = Array(LEVEL_COUNT).fill(true);
                setBadges(all);
                try { localStorage.setItem('quizBadges', JSON.stringify(all)); } catch {}
                setShowCertificate(true);
              }}>Open Certificate (test)</button>
            </div>
          )}
        </div>
      </div>

      {/* Module hero cards (restyled) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((m) => {
          const stats = moduleStats(m.range);
          const [s, e] = m.range;
          const done = stats.completed === stats.total;
          const actionLabel = done ? 'Review Module' : (stats.completed > 0 ? 'Resume Module' : 'Start Module');
          return (
            <div
              key={m.id}
              className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg">
                  <span className="select-none">{m.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{m.title}</h3>
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Lv {s}–{e}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{m.desc}</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div>{stats.completed}/{stats.total} complete</div>
                  <div className="font-medium">{stats.percent}%</div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="h-2 bg-indigo-500 dark:bg-indigo-400 transition-all" style={{ width: `${stats.percent}%` }} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="px-3.5 py-2 text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition"
                    onClick={() => startModule(m.range)}
                  >
                    {actionLabel}
                  </button>
                  <button
                    className="px-3.5 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition"
                    onClick={() => resetModule(m.range)}
                    title="Clear badges and question memory for this module"
                  >
                    Reset Module
                  </button>
                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">Next: Level {stats.nextLevel}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

  <div className="mt-2 text-sm text-gray-600">Question type: <span className="font-semibold">{levelLabel(level)}</span></div>

      <div className="mt-6">
        <div className="flex items-center gap-3 flex-wrap">
          {Array.from({ length: LEVEL_COUNT }).map((_, i) => {
            const isEarned = badges[i];
            const isNew = justUnlocked === i + 1;
            return (
              <div key={i} className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${isEarned ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-50 text-gray-300 border border-gray-100 dark:bg-gray-700 dark:border-gray-600'} ${isNew ? 'badge-unlock-anim' : ''}`}>
                  {isEarned ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center text-xs text-amber-800">{i+1}</span>
                    <span>{badgeName(i+1)}</span>
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">🔒</span>
                    <span className="text-gray-400">Locked</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Simple timeline/roadmap */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div>Roadmap to Certificate</div>
            <div>{badges.filter(Boolean).length}/{LEVEL_COUNT} badges earned</div>
          </div>
            <div className="w-full relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-amber-400 transition-all" style={{ width: `${(badges.filter(Boolean).length / LEVEL_COUNT) * 100}%` }} />
              </div>
              {/* Milestone ticks: one per level (10 milestones) */}
              <div className="absolute inset-0 pointer-events-none">
                { Array.from({ length: LEVEL_COUNT }).map((_, idx) => {
                  const p = (idx + 1) / LEVEL_COUNT;
                  return (
                    <div key={idx} style={{ left: `${p*100}%` }} className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2">
                      <div className={`w-3 h-3 rounded-full ${ (badges.filter(Boolean).length/LEVEL_COUNT) >= p ? 'bg-amber-600' : 'bg-gray-300' } border-2 border-white`} />
                    </div>
                  );
                }) }
              </div>
            </div>
          <div className="mt-2 text-xs text-gray-500">Earn all badges to unlock the certificate</div>
        </div>
      </div>

        {/* Difficulty label */}
        <div className="mt-3 text-sm text-gray-600">Difficulty: <span className="font-semibold">{LEVEL_CONFIG[level-1].difficulty}</span></div>

      <div className="mt-6">
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${((level - 1) / (LEVEL_COUNT - 1)) * 100}%` }} />
        </div>
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-300">Each level increases difficulty. Reach the passing score to unlock the next level and earn the badge.</div>
      </div>

  {!running ? (
        <div className="mt-6 flex items-center gap-3">
          <button className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform active:scale-95" onClick={() => startLevel()}>
            Start Level {level}
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" onClick={() => {
            // Reset all quiz progress and persisted state
            try { localStorage.removeItem('quizLevel'); } catch {}
            try { localStorage.removeItem('quizBadges'); } catch {}
            try { localStorage.removeItem('quizAsked'); } catch {}
            try { localStorage.removeItem('quizAskedIds'); } catch {}
            try { localStorage.removeItem('selectedBadges'); } catch {}
            setLevel(1);
            setBadges(Array(LEVEL_COUNT).fill(false));
            setAskedSet([]);
            setAskedIds([]);
            setSelectedBadges([]);
          }}>Reset Progress</button>
          <button className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-md border ml-2" onClick={() => setShowBadgesPanel(true)}>View Badges</button>
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-300">Passing score: <span className="font-mono">{LEVEL_CONFIG[level - 1].passingScore}</span></div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-300">Time left</div>
            <div className="text-sm font-mono text-gray-700 dark:text-gray-200">{timeLeft}s</div>
          </div>

          <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{questions[index]?.prompt || '... preparing ...'}</div>
            {/* Clue button & text */}
            {clueVisible && clueRevealedForIndex !== index && (
              <div className="mt-2">
                <button className="px-3 py-1 bg-yellow-400 text-white rounded" onClick={revealClue}>Show Clue (-2 pts)</button>
              </div>
            )}
            {clueRevealedForIndex === index && (
              <div className="mt-3 text-sm text-gray-600 bg-yellow-50 p-2 rounded">{generateClue(questions[index])}</div>
            )}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questions[index]?.choices?.map((c, i) => (
                <button key={i} onClick={() => handleAnswer(c)} className="w-full text-left p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg hover:shadow-md transition transform hover:-translate-y-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{c}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showConfetti && <Confetti />}
      {justUnlocked && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-70">
          <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 border border-amber-200">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800">{justUnlocked}</div>
            <div>
              <div className="font-semibold">Badge Unlocked</div>
              <div className="text-sm text-gray-600">{badgeName(justUnlocked)}</div>
            </div>
          </div>
        </div>
      )}
      {showCertificate && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-xl p-4 shadow-xl max-w-3xl w-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">Congratulations!</h3>
                <p className="text-sm text-gray-600">You've completed all levels. Download your certificate from Sam's Academy.</p>
              </div>
              <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setShowCertificate(false)}>Close</button>
            </div>
            <div className="mt-4">
              <div className="certificate-export-wrapper" ref={(el) => (certificateNode.current = el)}>
                <Certificate name={localStorage.getItem('userName') || 'Student'} levelCount={LEVEL_COUNT} onClose={() => setShowCertificate(false)} />
              </div>
              <div className="mt-3 flex gap-3 justify-end">
                <button onClick={exportCertificatePNG} className="px-4 py-2 bg-indigo-600 text-white rounded">Export PNG</button>
                <button onClick={exportCertificatePDF} className="px-4 py-2 bg-amber-500 text-white rounded">Export PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBadgesPanel && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/30 p-6">
          <div className="bg-white rounded-xl p-4 shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Badges</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded" onClick={async () => { await exportSelectedCertificatesPDF(); }}>Export Selected</button>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded" onClick={() => setShowBadgesPanel(false)}>Close</button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {badges.map((b, i) => (
                <label key={i} className={`p-3 rounded-lg border ${b ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                  <input type="checkbox" disabled={!b} checked={selectedBadges.includes(i+1)} onChange={(e) => {
                    const next = e.currentTarget.checked ? [...selectedBadges, i+1] : selectedBadges.filter(x => x !== i+1);
                    setSelectedBadges(next);
                    try { localStorage.setItem('selectedBadges', JSON.stringify(next)); } catch {}
                  }} />
                  <div className="ml-2 inline-block align-middle">
                    <div className="font-semibold">{b ? badgeName(i+1) : `Locked ${i+1}`}</div>
                    {b ? <div className="text-sm text-gray-600">Unlocked</div> : <div className="text-sm text-gray-400">Earn this badge to reveal details</div>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Level complete modal */}
      {levelComplete && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Level {levelComplete.level} {levelComplete.passed ? 'Complete' : 'Finished'}</h3>
                <p className="text-sm text-gray-600 mt-1">You scored <span className="font-mono">{levelComplete.score}</span>. {levelComplete.passed ? 'Great job — you unlocked the badge!' : 'You did not reach the passing score. Try again or review the badge roadmap.'}</p>
                <div className="mt-3 text-xs text-gray-500">Next: Difficulty — <span className="font-semibold">{LEVEL_CONFIG[Math.max(0, levelComplete.level-1)].difficulty}</span></div>
              </div>
              <div>
                <button className="px-3 py-1 rounded bg-gray-100" onClick={() => setLevelComplete(null)}>Close</button>
              </div>
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              {!levelComplete.passed ? (
                <>
                  <button className="px-4 py-2 bg-yellow-400 text-white rounded" onClick={() => { setLevelComplete(null); startLevel(level); }}>Retry Level</button>
                  <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setLevelComplete(null); setShowBadgesPanel(true); }}>View Badges</button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { setLevelComplete(null); startLevel(level); }}>Next Level</button>
                  <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setLevelComplete(null); setShowBadgesPanel(true); }}>View Badges</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

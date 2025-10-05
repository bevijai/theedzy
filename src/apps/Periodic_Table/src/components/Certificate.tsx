import React from 'react';
import logoUrl from '../assets/logo.svg';

const Certificate: React.FC<{ name?: string; date?: string; levelCount?: number; issuerName?: string; serial?: string; onClose?: () => void }> = ({
  name = 'Student',
  date = new Date().toLocaleDateString(),
  levelCount = 10,
  issuerName = "Sam's Academy",
  serial = `SN-${Math.random().toString(36).slice(2,9).toUpperCase()}`,
  onClose,
}) => {
  return (
    <div className="w-[1024px] h-[720px] p-10 bg-[#e9f1ff] flex items-center justify-center">
      <div className="relative w-[920px] h-[640px] bg-white shadow-inner" style={{ borderRadius: 8, overflow: 'hidden' }}>

        {/* Outer ornate borders */}
        <div style={{ position: 'absolute', inset: 12, borderRadius: 8, boxSizing: 'border-box', padding: 10 }}>
          <div style={{ height: '100%', border: '10px solid #dcd3f4', borderRadius: 6, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '4px solid #f3eefc', borderRadius: 4 }} />
          </div>
        </div>

        {/* Subtle paper texture using svg filter and a very faint noise pattern */}
        <svg style={{ position: 'absolute', inset: 36, width: 'calc(100% - 72px)', height: 'calc(100% - 72px)', pointerEvents: 'none', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="noise"><feTurbulence baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" seed="2"/><feColorMatrix type="saturate" values="0"/></filter>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#fafafa" /></linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)" />
          <rect width="100%" height="100%" filter="url(#noise)" fill="white" />
        </svg>

  {/* Guilloche watermark - subtle ornamental pattern */}
  <svg viewBox="0 0 800 600" style={{ position: 'absolute', left: '50%', top: '34%', transform: 'translate(-50%,-24%)', width: 760, height: 420, opacity: 0.06, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" /><stop offset="100%" stopColor="#e6e6ff" stopOpacity="0.12"/></radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="none" />
          {/* repeated circles to give guilloche feel */}
          {Array.from({ length: 18 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <g key={i} transform={`rotate(${(i * 20) % 360} 400 300)`}>
              <ellipse cx="400" cy="300" rx={200 + i * 6} ry={120 + i * 2} fill="none" stroke="#cfcff8" strokeWidth="0.6" />
            </g>
          ))}
          <rect width="100%" height="100%" fill="url(#rg)" />
        </svg>

  {/* Subtle curved-line texture (like the sample) */}
  <svg viewBox="0 0 1200 200" style={{ position: 'absolute', left: '50%', top: '12%', transform: 'translate(-50%, -10%)', width: 980, height: 200, opacity: 0.12, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lg1" x1="0" x2="1"><stop offset="0%" stopColor="#dfe6ff" stopOpacity="0.12" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0.04"/></linearGradient>
          </defs>
          <g stroke="url(#lg1)" strokeWidth="0.9" fill="none">
            {Array.from({ length: 10 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <path key={i} d={`M0 ${30 + i*12} C 200 ${10 + i*6}, 400 ${50 + i*4}, 600 ${20 + i*8} C 800 ${-10 + i*6}, 1000 ${40 + i*2}, 1200 ${30 + i*6}`} opacity={0.6 - i*0.04} />
            ))}
          </g>
        </svg>

        {/* Close button */}
        {onClose && (
          <button onClick={onClose} style={{ position: 'absolute', right: 18, top: 18, background: '#fff', border: '1px solid rgba(15,23,42,0.06)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Close</button>
        )}

        {/* Watermark text */}
        <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%) rotate(-20deg)', fontSize: 90, color: '#8b8bd6', opacity: 0.03, fontWeight: 800, pointerEvents: 'none' }}>Sam's Academy</div>

        <div style={{ position: 'absolute', inset: 60, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: "Georgia, 'Times New Roman', Times, serif", color: '#1f2937' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={logoUrl} alt={issuerName} style={{ width: 72, height: 72 }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{issuerName}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Certified Program</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#6b7280' }}>Certificate ID: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{serial}</span></div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#2b2b2b', letterSpacing: 1 }}>GRADUATION CERTIFICATE</div>
              <div style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>This is to certify that</div>
              <div style={{ marginTop: 16, fontSize: 48, fontWeight: 800 }}>{name}</div>
              <div style={{ marginTop: 12, fontSize: 14, color: '#4b5563' }}>has successfully completed all requirements for</div>
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>{issuerName} — Elemental Mastery — {levelCount} Levels</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 240, height: 2, background: '#111827', opacity: 0.85, margin: '0 auto' }} />
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>{'Samyuktha Vijai'}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Instructor</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 240, height: 2, background: '#111827', opacity: 0.85, margin: '0 auto' }} />
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>Registrar</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Certifying Officer</div>
            </div>

            <div style={{ textAlign: 'right', maxWidth: 240 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Awarded on</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700 }}>{date}</div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280' }}>Certificate validated by {issuerName}. Certificate ID: <span style={{ fontFamily: 'monospace' }}>{serial}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

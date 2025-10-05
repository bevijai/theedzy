import React from 'react';

type Props = {
  badges: boolean[];
  justUnlocked?: number | null;
  onBadgeClick?: (index: number) => void;
};

const medalGradient = 'linear-gradient(135deg,#ffd86b 0%,#ffb86b 100%)';

const BadgesLuxe: React.FC<Props> = ({ badges, justUnlocked, onBadgeClick }) => {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {badges.map((earned, i) => (
        <button
          key={i}
          onClick={() => onBadgeClick && onBadgeClick(i+1)}
          className={`relative p-4 rounded-2xl shadow-xl border border-white/10 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md dark:from-gray-800 dark:to-gray-700 overflow-hidden focus:outline-none transform transition-transform duration-300 ${justUnlocked === i+1 ? 'scale-105' : 'scale-100'}`}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-none">
              <div style={{ width: 64, height: 64, background: earned ? medalGradient : '#f3f4f6', borderRadius: 9999 }} className={`flex items-center justify-center shadow-md border ${earned ? 'border-amber-300' : 'border-gray-200'}`}>
                {earned ? (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3.2" fill="#fff" />
                    <path d="M12 12v6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="#cbd5e1" strokeWidth="1.2" />
                    <path d="M8 12h8" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              {/* subtle highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0))', mixBlendMode: 'overlay' }} />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">{i+1}. {earned ? badgeTitle(i+1) : 'Locked'}</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">{earned ? 'Earned — tap for details' : 'Locked — complete the level'}</div>
            </div>
            <div className="flex-none">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{earned ? 'Collected' : 'Locked'}</div>
            </div>
          </div>

          {justUnlocked === i+1 && (
            <div className="absolute inset-0 rounded-2xl bg-amber-50/60 flex items-center justify-center transition-opacity duration-300">
              <div className="text-amber-800 font-bold">Unlocked!</div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

const badgeTitle = (n: number) => {
  const names = ['Novice Spark','Element Seeker','Ion Initiate','Bond Breaker','Valence Virtuoso','Periodic Pro','Orbital Officer','Reaction Ranger','Stoichiometry Star','Elemental Master'];
  return names[(n-1) % names.length];
};

export default BadgesLuxe;

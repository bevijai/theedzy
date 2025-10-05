import React, { useState, useEffect, useRef } from 'react';
import useFocusTrap from '../utils/useFocusTrap';
import { X, Atom, Thermometer, Weight, Zap, Lightbulb, User } from 'lucide-react';
import { IndicatorDemo } from './IndicatorDemo';
import { Element } from '../types/chemistry';
import { elementCategories } from '../data/elements';
import { speak, stopSpeaking } from '../utils/tts';

const clickAudio = typeof Audio !== 'undefined' ? new Audio() : null;
if (clickAudio) {
  // a tiny pluck-like base64 WAV (very small) could be embedded; placeholder using empty source
  // leave source unset so users can optionally set their own sound file
}
const AtomicViewer = React.lazy(() => import('./AtomicViewer'));

interface ElementModalProps {
  element: Element;
  isOpen: boolean;
  onClose: () => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({ element, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [show3D, setShow3D] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('ttsEnabled') === 'true'; } catch { return false; }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('soundEnabled') === 'true'; } catch { return true; }
  });

  const categoryName = elementCategories[element.category];

  // Generate a friendly description if missing
  const generatedDescription = React.useMemo(() => {
    if (element.description && element.description.trim().length > 0) return element.description;
    const parts: string[] = [];
    parts.push(`${element.name} is element number ${element.atomicNumber}.`);
    parts.push(`It is classified as ${categoryName.replace(/-/g, ' ')}.`);
    parts.push(`Common uses include ${element.uses.slice(0, 3).join(', ')}.`);
    return parts.join(' ');
  }, [element, categoryName]);

  // Provide simple indicator badges for common properties if not provided
  const generatedIndicators = React.useMemo(() => {
    if (element.indicators && element.indicators.length) return element.indicators;
    const inds: string[] = [];
    // reactivity hints
    if (element.category === 'alkali-metals') inds.push('Highly reactive with water');
    if (element.category === 'halogens') inds.push('Reactive nonmetal');
    if (element.category === 'noble-gases') inds.push('Inert under normal conditions');
    if (element.discoveredBy && element.discoveryYear && element.discoveryYear < 1800) inds.push('Known since early history');
    if (element.atomicMass && element.atomicMass > 200) inds.push('Heavy element');
    if (!inds.length) inds.push('No special indicators');
    return inds;
  }, [element]);

  useEffect(() => {
    if (isOpen && soundEnabled && clickAudio) {
      // play a short system beep if audio source set
      try { clickAudio.play(); } catch {}
    }
  }, [isOpen, soundEnabled]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(containerRef, isOpen);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="element-modal-title">
      <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: element.color }}
            >
              {element.symbol}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{element.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">Atomic Number: {element.atomicNumber}</p>
              <p className="text-gray-700 dark:text-gray-200 mt-2 italic">{generatedDescription}</p>
              <div className="mt-3">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">Indicators:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {generatedIndicators.map((indicator, idx) => {
                    // pick icon for a few known keys
                    let icon = 'ℹ️';
                    const ik = indicator.toLowerCase();
                    if (ik.includes('reactive') || ik.includes('water')) icon = '⚠️';
                    if (ik.includes('toxic') || ik.includes('poison')) icon = '☠️';
                    if (ik.includes('inert') || ik.includes('noble')) icon = '⭕';
                    if (ik.includes('radio') || ik.includes('radioactive')) icon = '☢️';
                    if (ik.includes('flamm') || ik.includes('fire')) icon = '🔥';
                    return (
                      <div key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full text-gray-800 dark:text-gray-100">
                        <span className="text-sm">{icon}</span>
                        <span>{indicator}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

                        <div className="p-6 space-y-6">
                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
                          <p className="text-gray-700 dark:text-gray-300">{element.description || 'No description available for this element.'}</p>
                        </div>
                        {/* Basic Properties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                              <Atom className="h-5 w-5 mr-2" />
                              Basic Properties
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-blue-800 dark:text-blue-200">Symbol:</span>
                                <span className="font-mono text-blue-900 dark:text-white">{element.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-800">Atomic Mass:</span>
                                <span className="font-mono text-blue-900">{element.atomicMass} u</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-800">Period:</span>
                                <span className="font-mono text-blue-900">{element.period}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-800">Group:</span>
                                <span className="font-mono text-blue-900">{element.group}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-800">Category:</span>
                                <span className="text-blue-900">{categoryName}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center">
                              <Zap className="h-5 w-5 mr-2" />
                              Electronic Properties
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <span className="text-green-800 block">Electron Configuration:</span>
                                <span className="font-mono text-sm text-green-900">{element.electronConfiguration}</span>
                              </div>
                              <div>
                                <span className="text-green-800 block">Oxidation States:</span>
                                <span className="font-mono text-green-900">{element.oxidationStates}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Physical Properties */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                            <Thermometer className="h-5 w-5 mr-2" />
                            Physical Properties
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">{element.meltingPoint}</div>
                              <div className="text-sm text-orange-800">Melting Point</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">{element.boilingPoint}</div>
                              <div className="text-sm text-orange-800">Boiling Point</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">{element.density}</div>
                              <div className="text-sm text-orange-800">Density</div>
                            </div>
                          </div>
                        </div>

                        {/* Discovery Information */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Discovery
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-purple-800 dark:text-purple-200 block">Discovered by:</span>
                              <span className="text-purple-900 dark:text-white font-medium">{element.discoveredBy}</span>
                            </div>
                            <div>
                              <span className="text-purple-800 dark:text-purple-200 block">Year:</span>
                              <span className="text-purple-900 dark:text-white font-medium">
                                {element.discoveryYear > 0 ? element.discoveryYear : 'Ancient times'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Uses */}
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200 mb-4 flex items-center">
                            <Weight className="h-5 w-5 mr-2" />
                            Common Uses
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {element.uses.map((use, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span className="text-teal-900 dark:text-white">{use}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Indicator Demo (wow factor) */}
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="10" rx="2" fill="currentColor"/></svg>
                            Indicators
                          </h3>
                          <IndicatorDemo initial={7} />
                        </div>

                        {/* 3D Atomic Viewer Toggle */}
                        <div className="p-6">
                          <label className="inline-flex items-center space-x-3">
                            <input type="checkbox" className="w-4 h-4" checked={show3D} onChange={() => setShow3D(s => !s)} />
                            <span className="text-sm text-gray-700 dark:text-gray-200">Show 3D atomic model</span>
                          </label>
                          {show3D && (
                            <React.Suspense fallback={<div className="mt-4">Loading 3D viewer...</div>}>
                              <AtomicViewer electrons={Math.min(18, Math.max(1, element.atomicNumber))} symbol={element.symbol} />
                            </React.Suspense>
                          )}
                        </div>

                        {/* Sound & TTS Controls */}
                          <div className="p-6 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4" checked={ttsEnabled} onChange={(e)=>{ setTtsEnabled(e.target.checked); try{ localStorage.setItem('ttsEnabled', String(e.target.checked)); }catch{} }} />
                              <span className="text-sm text-gray-700 dark:text-gray-200">Enable TTS (read description)</span>
                            </label>
                            <label className="inline-flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4" checked={soundEnabled} onChange={(e)=>{ setSoundEnabled(e.target.checked); try{ localStorage.setItem('soundEnabled', String(e.target.checked)); }catch{} }} />
                              <span className="text-sm text-gray-700 dark:text-gray-200">Enable sounds</span>
                            </label>
                          </div>
                          <div>
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-md"
                              onClick={() => {
                                if (ttsEnabled) {
                                  const intro = `${element.name}, atomic number ${element.atomicNumber}.`;
                                  const desc = generatedDescription ? ` ${generatedDescription}` : '';
                                  speak(intro + desc);
                                }
                              }}
                            >
                              Play description
                            </button>
                            <button className="ml-2 px-3 py-1 bg-gray-200 rounded-md" onClick={() => { stopSpeaking(); }}>
                              Stop
                            </button>
                          </div>
                        </div>

                        {/* Fun Facts */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                            <Lightbulb className="h-5 w-5 mr-2" />
                            Fun Facts
                          </h3>
                          <div className="space-y-3">
                            {element.funFacts.map((fact, index) => (
                              <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 text-sm font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-yellow-900 dark:text-white">{fact}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  );
};

export default ElementModal;
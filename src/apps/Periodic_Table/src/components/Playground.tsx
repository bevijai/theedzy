import React, { useState, useRef } from 'react';
import { Trash2, Plus, Zap, Info, BookOpen, Play } from 'lucide-react';
import { Element, Compound } from '../types/chemistry';
import { elements } from '../data/elements';
import { compounds, findPossibleCompounds } from '../data/compounds';

interface DraggedElement extends Element {
  id: string;
  x: number;
  y: number;
}

export const Playground: React.FC = () => {
  const [draggedElements, setDraggedElements] = useState<DraggedElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [reactedElementsSymbols, setReactedElementsSymbols] = useState<string[]>([]);
  const [possibleCompounds, setPossibleCompounds] = useState<Compound[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<Compound | null>(null);
  const reactionAreaRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const [compoundSuggestions, setCompoundSuggestions] = useState<string[]>([]);
  const [professorReply, setProfessorReply] = useState<{ summary: string; explanation?: string; citations?: Array<{text:string;url:string}>; possibleCompounds?: Compound[]; persisted?: any[] } | null>(null);
  const [askingProfessor, setAskingProfessor] = useState(false);

  const updateSelectedElements = (elements: string[]) => {
    setSelectedElements(elements);
  };

  const handleStartReaction = () => {
    const uniqueElements = [...new Set(selectedElements)];
    setReactedElementsSymbols(uniqueElements);
    const possible = findPossibleCompounds(uniqueElements);
    setPossibleCompounds(possible);
    const suggestions = generateCompoundSuggestions(uniqueElements);
    setCompoundSuggestions(suggestions);
  };

  const askProfessor = async (depth: 'short' | 'long' = 'short') => {
    if (selectedElements.length === 0) return;
    setAskingProfessor(true);
    setProfessorReply(null);
    try {
  // use a relative path so Vite dev server can proxy to the mock server (avoids CORS)
  const res = await fetch(`/api/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: [...new Set(selectedElements)], depth })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setProfessorReply(data);
    } catch (err) {
      setProfessorReply({ summary: 'Professor service unavailable', explanation: String(err) });
    } finally {
      setAskingProfessor(false);
    }
  };

  const handleElementDragStart = (e: React.DragEvent, element: Element) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
  };

  const handleReactionAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('application/json');
    if (elementData) {
      const element = JSON.parse(elementData) as Element;
      const rect = reactionAreaRef.current?.getBoundingClientRect();
      if (rect) {
        const newElement: DraggedElement = {
          ...element,
          id: `${element.symbol}-${dragCounter.current++}`,
          x: e.clientX - rect.left - 30,
          y: e.clientY - rect.top - 30
        };
        setDraggedElements(prev => [...prev, newElement]);
        updateSelectedElements([...selectedElements, element.symbol]);
      }
    }
  };

  const handleReactionAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const generateCompoundSuggestions = (currentElements: string[]): string[] => {
    const suggestions: string[] = [];
    const findElement = (s: string) => elements.find(e => e.symbol === s);

    // quick noble-gas check
    const nobleSymbols = elements.filter(e => e.category && String(e.category).toUpperCase().includes('NOBLE')).map(e => e.symbol);
    const foundNoble = currentElements.find(s => nobleSymbols.includes(s));
    if (foundNoble) {
      const el = findElement(foundNoble)!;
      return [
        `Professor note: ${el.name} (${el.symbol}) is a noble gas — it has a full valence shell and is largely unreactive under normal conditions. Only heavier noble gases (e.g., Xe, Kr) form a handful of compounds under special conditions; ${el.symbol} rarely forms stable compounds.`
      ];
    }

    // 1) Exact-or-superset matches in dataset (compounds that include all selected symbols)
    const matches = compounds.filter(c => {
      const cSyms = c.elements.map(e => e.symbol);
      return currentElements.every(sym => cSyms.includes(sym));
    });
    if (matches.length > 0) {
      for (const m of matches.slice(0, 4)) {
        const missing = m.elements.map(e => e.symbol).filter(s => !currentElements.includes(s));
        if (missing.length === 0) {
          suggestions.push(`${currentElements.join(' + ')} directly matches ${m.formula} (${m.name}).`);
        } else {
          suggestions.push(`Add ${missing.join(', ')} → ${m.formula} (${m.name}).`);
        }
      }
      return suggestions;
    }

    // 2) Special-case heuristics (notable unusual compounds)
    const sortedKey = [...currentElements].sort().join(',');
    const special: Record<string, Array<{ formula: string; name: string; note?: string }> > = {
      'F,O': [
        { formula: 'OF₂', name: 'Oxygen difluoride', note: 'Exists — toxic, reactive; produced under controlled conditions' },
        { formula: 'O₂F₂', name: 'Dioxygen difluoride', note: 'Exists — extremely reactive and unstable; handled at low temperatures' }
      ],
      'Na,O': [
        { formula: 'Na₂O', name: 'Sodium oxide', note: 'Ionic oxide of sodium' }
      ],
      'Na,Cl': [
        { formula: 'NaCl', name: 'Sodium chloride', note: 'Common ionic salt' }
      ]
    };
    if (special[sortedKey]) {
      for (const s of special[sortedKey]) {
        suggestions.push(`${currentElements.join(' + ')} → ${s.formula} (${s.name})${s.note ? ` — ${s.note}` : ''}`);
      }
      return suggestions.slice(0, 4);
    }

    // 3) Partial dataset matches: find compounds that share one or more of the selected elements and suggest additions
    const partials = compounds
      .map(c => ({ compound: c, overlap: c.elements.map(e => e.symbol).filter(sym => currentElements.includes(sym)).length }))
      .filter(x => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap);
    if (partials.length > 0) {
      const top = partials.slice(0, 4);
      for (const p of top) {
        const missing = p.compound.elements.map(e => e.symbol).filter(s => !currentElements.includes(s));
        suggestions.push(`To get ${p.compound.formula} (${p.compound.name}) try adding: ${missing.join(', ')}.`);
      }
      return suggestions.slice(0, 4);
    }

    // 4) If no matches at all, provide a short professor-style explanation of plausible reasons
    const elemMeta = currentElements.map(s => findElement(s));
    const categories = Array.from(new Set(elemMeta.map(e => e?.category).filter(Boolean)));
    const professorNotes: string[] = [];
    professorNotes.push(`Professor note: I checked known compounds — nothing obvious matches ${currentElements.join(' + ')} in our dataset.`);
    if (categories.includes(undefined as any)) {
      professorNotes.push('Possible reason: one or more selected elements are unusual or missing metadata in the dataset.');
    }
    // Valence/chemistry reasons
    professorNotes.push('Chemically, combinations can fail because of: full valence shells (noble gases), incompatible oxidation states, or because the elements prefer to form homonuclear molecules/gases rather than binary compounds under normal conditions. Some compounds only form under extreme conditions (very low/high temperature, plasma, or with catalysts).');
    professorNotes.push('If you want, I can check stoichiometry (counts) or search external references for rare oxyfluorides and exotic species like O₂F₂.');

    return professorNotes.slice(0, 3);
  };

  const removeElement = (id: string) => {
    const elementToRemove = draggedElements.find(el => el.id === id);
    if (elementToRemove) {
      const newDraggedElements = draggedElements.filter(el => el.id !== id);
      setDraggedElements(newDraggedElements);
      
      const newSelectedElements = selectedElements.filter((_, index) => {
        const elementIndex = draggedElements.findIndex(el => el.id === id);
        return index !== elementIndex;
      });
      updateSelectedElements(newSelectedElements);
    }
  };

  const clearReactionArea = () => {
    setDraggedElements([]);
    setSelectedElements([]);
    setReactedElementsSymbols([]);
    setPossibleCompounds([]);
    setSelectedCompound(null);
    setCompoundSuggestions([]);
  };

  const getElementCount = (symbol: string) => {
    return selectedElements.filter(el => el === symbol).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Chemistry Playground
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Drag elements into the reaction area to explore possible compounds and chemical reactions. Discover how elements combine to form the world around us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Element Bank */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Element Bank
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {elements.map(element => (
                  <div
                    key={element.atomicNumber}
                    draggable
                    onDragStart={(e) => handleElementDragStart(e, element)}
                    className="p-3 rounded-lg cursor-move transition-all duration-200 hover:scale-105 hover:shadow-lg text-white font-semibold text-center"
                    style={{ backgroundColor: element.color }}
                  >
                    <div className="text-xs">{element.atomicNumber}</div>
                    <div className="text-lg font-bold">{element.symbol}</div>
                    <div className="text-xs truncate">{element.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reaction Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Reaction Area
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleStartReaction}
                    disabled={selectedElements.length === 0}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Reaction</span>
                  </button>
                  <button
                    onClick={() => askProfessor('short')}
                    disabled={selectedElements.length === 0 || askingProfessor}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{askingProfessor ? 'Asking...' : 'Ask Professor'}</span>
                  </button>
                  <button
                    onClick={clearReactionArea}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              
              <div
                ref={reactionAreaRef}
                onDrop={handleReactionAreaDrop}
                onDragOver={handleReactionAreaDragOver}
                className="relative h-80 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center"
              >
                {draggedElements.length === 0 ? (
                  <div className="text-gray-500 text-center">
                    <div className="text-4xl mb-2">🧪</div>
                    <p>Drag elements here to create compounds</p>
                  </div>
                ) : (
                  draggedElements.map(element => (
                    <div
                      key={element.id}
                      className="absolute w-16 h-16 rounded-lg text-white font-semibold flex flex-col items-center justify-center cursor-pointer group"
                      style={{ 
                        backgroundColor: element.color,
                        left: element.x,
                        top: element.y
                      }}
                      onClick={() => removeElement(element.id)}
                    >
                      <div className="text-sm font-bold">{element.symbol}</div>
                      <div className="text-xs">{element.atomicNumber}</div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Elements Summary */}
              {selectedElements.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Elements:</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(selectedElements)].map(symbol => (
                      <span key={symbol} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                        {symbol}{getElementCount(symbol) > 1 && <sub>{getElementCount(symbol)}</sub>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compound Results */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Possible Compounds
              </h2>
              
              {reactedElementsSymbols.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <div className="text-3xl mb-2">⚗️</div>
                  <p>Add elements and start reaction to see possible compounds</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {possibleCompounds.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      <div className="text-3xl mb-2">🚫</div>
                      <p className="mb-4">No known compounds found with these elements</p>
                      
                      {/* Compound Suggestions */}
                      {compoundSuggestions.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                            💡 Suggestions to form compounds:
                          </h4>
                          <div className="space-y-2">
                            {compoundSuggestions.map((suggestion, index) => (
                              <div key={index} className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                <div className="space-y-3">
                  {possibleCompounds.map((compound, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCompound(compound)}
                      className="w-full p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl hover:from-teal-100 hover:to-blue-100 transition-all duration-200 text-left"
                    >
                      <div className="font-bold text-lg text-gray-800 mb-1">
                        {compound.formula}
                      </div>
                      <div className="text-gray-600 text-sm">{compound.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Click for details
                      </div>
                    </button>
                  ))}
                      
                      {/* Additional Suggestions even when compounds are found */}
                      {compoundSuggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            🔬 Try these combinations for more compounds:
                          </h4>
                          <div className="space-y-2">
                            {compoundSuggestions.map((suggestion, index) => (
                              <div key={index} className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                </div>
              )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compound Detail Modal */}
        {selectedCompound && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCompound.formula}</h2>
                  <p className="text-gray-600">{selectedCompound.name}</p>
                </div>
                <button
                  onClick={() => setSelectedCompound(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Properties */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Properties
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-green-800 block">Molar Mass:</span>
                      <span className="text-green-900 font-medium">{selectedCompound.molarMass} g/mol</span>
                    </div>
                    <div>
                      <span className="text-green-800 block">Density:</span>
                      <span className="text-green-900 font-medium">{selectedCompound.density}</span>
                    </div>
                    <div>
                      <span className="text-green-800 block">Melting Point:</span>
                      <span className="text-green-900 font-medium">{selectedCompound.meltingPoint}</span>
                    </div>
                    <div>
                      <span className="text-green-800 block">Boiling Point:</span>
                      <span className="text-green-900 font-medium">{selectedCompound.boilingPoint}</span>
                    </div>
                  </div>
                </div>

                {/* Common Names */}
                {selectedCompound.commonNames.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Common Names</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompound.commonNames.map((name, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uses */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Applications</h3>
                  <div className="space-y-2">
                    {selectedCompound.uses.map((use, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-900">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Information */}
                {selectedCompound.hazards.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Safety Information</h3>
                    <div className="space-y-2">
                      {selectedCompound.hazards.map((hazard, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg border-l-4 border-red-400">
                          <span className="text-red-900">{hazard}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Professor Reply Modal */}
        {professorReply && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ask Professor</h2>
                  <p className="text-gray-600 text-sm">A short explanatory reply from the local professor assistant.</p>
                </div>
                <button onClick={() => setProfessorReply(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-lg font-semibold text-gray-900">{professorReply.summary}</div>
                {professorReply.explanation && <div className="text-gray-700">{professorReply.explanation}</div>}
                {professorReply.citations && professorReply.citations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900">Citations</h4>
                    <ul className="list-disc ml-6 text-sm text-blue-700">
                      {professorReply.citations.map((c, i) => (
                        <li key={i}><a href={c.url} target="_blank" rel="noreferrer" className="underline">{c.text}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                {professorReply.possibleCompounds && professorReply.possibleCompounds.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mt-4">Possible Compounds (from LLM / local matches)</h4>
                    <ul className="list-disc ml-6 text-sm text-gray-700">
                      {professorReply.possibleCompounds.map((c, i) => (
                        <li key={i}>{c.formula}{c.name ? ` — ${c.name}` : ''}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {professorReply.persisted && professorReply.persisted.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mt-4">Newly persisted compounds</h4>
                    <ul className="list-disc ml-6 text-sm text-gray-700">
                      {professorReply.persisted.map((c, i) => (
                        <li key={i}>{c.formula}{c.name ? ` — ${c.name}` : ''}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';

// Small helper to pick an emoji for a given item name (fallback if unknown)
function pickEmojiFor(name: string) {
  const map: Record<string, string> = {
    water: '💧', bottle: '🍼', salt: '🧂', sugar: '🍬', spoon: '🥄', fork: '🍴', knife: '🔪', plate: '🍽️', cup: '☕', mug: '☕',
    bowl: '🍚', toothbrush: '🪥', toothpaste: '🪥', soap: '🧼', shampoo: '🧴', towel: '🧻', sponge: '🧽', bucket: '🪣', broom: '🧹', mop: '🧼',
    vacuum: '🧹', bulb: '💡', battery: '🔋', phone: '📱', laptop: '💻', charger: '🔌', headphones: '🎧', speaker: '🔊', remote: '📺', tv: '📺',
    radio: '📻', key: '🔑', wallet: '👛', watch: '⌚', glasses: '👓', pen: '🖊️', pencil: '✏️', notebook: '📓', scissors: '✂️', tape: '📼',
    bottle2: '🍾', can: '🥫', jar: '🍯', pan: '🍳', pot: '🍲', kettle: '☕', ovenmitt: '🧤', stove: '🍳', fridge: '🧊', microwave: '📡'
  };
  const key = name.toLowerCase().replace(/\s+/g, '');
  return map[key] || '📦';
}

// Simple inline SVG icon renderer to avoid external assets. Matches name substrings.
function Icon({ name, size = 40 }: { name: string; size?: number }) {
  const key = name.toLowerCase();
  const commonProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true } as any;
  if (key.includes('water') || key.includes('h2o')) {
    return (
      <svg {...commonProps} className="text-blue-600">
        <path d="M12 2s5 4 5 7a5 5 0 0 1-10 0c0-3 5-7 5-7z" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('salt')) {
    return (
      <svg {...commonProps} className="text-gray-700">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('sugar') || key.includes('sucrose')) {
    return (
      <svg {...commonProps} className="text-yellow-600">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="0.9" />
      </svg>
    );
  }
  if (key.includes('vinegar') || key.includes('acetic')) {
    return (
      <svg {...commonProps} className="text-amber-600">
        <path d="M7 2h10l-2 6a4 4 0 0 1-6 0L7 2z" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('bleach') || key.includes('hypochlorite')) {
    return (
      <svg {...commonProps} className="text-indigo-600">
        <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  if (key.includes('ammonia') || key.includes('nh3')) {
    return (
      <svg {...commonProps} className="text-purple-600">
        <path d="M6 21h12l-2-8H8l-2 8zM12 3v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (key.includes('alcohol') || key.includes('isoprop') || key.includes('ethanol')) {
    return (
      <svg {...commonProps} className="text-pink-600">
        <path d="M7 2h10v6a5 5 0 0 1-10 0V2z" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('hydrogen') || key.includes('peroxide') || key.includes('h2o2')) {
    return (
      <svg {...commonProps} className="text-sky-600">
        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M12 2v4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (key.includes('chalk') || key.includes('calcium') || key.includes('caco')) {
    return (
      <svg {...commonProps} className="text-stone-600">
        <rect x="5" y="7" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    );
  }
  if (key.includes('gas') || key.includes('methane') || key.includes('propane') || key.includes('butane')) {
    return (
      <svg {...commonProps} className="text-orange-600">
        <path d="M12 3c3 3 4 6 4 8s-1 5-4 7c-3-2-4-5-4-7s1-5 4-8z" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('co2') || key.includes('carbon dioxide') || key.includes('dry ice')) {
    return (
      <svg {...commonProps} className="text-gray-600">
        <circle cx="8" cy="12" r="2" fill="currentColor" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }
  // Generic pill/chemical icon for many substances
  return (
    <svg {...commonProps} className="text-gray-700">
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M7 6v12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Generate 50 household items as draggable cards (no external images)
// Replace library with user-provided common household chemicals list (50 entries)
const NAMES = [
  'Water','Table Salt','Table Sugar','Baking Soda','Vinegar','Bleach','Ammonia','Rubbing Alcohol','Hydrogen Peroxide','Chalk',
  'Natural Gas (Methane)','Butane','Carbon Dioxide','Dry Ice','Antacid (Magnesium Hydroxide)','Talcum Powder','Caffeine','Vitamin C','Aspirin','Lye',
  'Soap (Sodium Stearate)','Washing Soda','Plaster of Paris','Propane','Silicon Dioxide','Formalin','Toluene','Naphthalene','Gypsum','Epsom Salt',
  'Boric Acid','Citric Acid','Limestone','Nitrous Oxide','Sulfuric Acid','Rust (Iron Oxide)','Detergent (SLS)','Baking Powder','Muriatic Acid','Drain Cleaner',
  'Antifreeze','Paint (TiO2)','Concrete','Sand','Cinnamon (Cinnamaldehyde)','Carbon Monoxide','Tylenol (Acetaminophen)','Coffee (Caffeine)','Chocolate (Theobromine)','Antacid (Calcium Carbonate)'
];

const LIB = NAMES.map((name, i) => ({ id: `item-${i+1}`, name, emoji: pickEmojiFor(name) }));

// Chemical/composition info for some items; fallback used for others
type ChemInfo = { title: string; formula?: string; composition: string; howFormed?: string; more?: string };
const CHEM: Record<string, ChemInfo> = {
  'item-1': {
    title: 'Water',
    formula: 'H2O',
    composition: 'Molecular compound (H2O)',
    howFormed: 'Water is formed when two hydrogen atoms form covalent bonds with one oxygen atom (sharing electrons) resulting in a stable H2O molecule; the bonds are polar covalent.',
    more: "Water is a transparent, tasteless, odorless chemical substance, vital for life and an excellent solvent; it participates in many chemical and biological processes."
  },
  'item-2': {
    title: 'Salt',
    formula: 'NaCl',
    composition: 'Ionic compound (Na+ and Cl-)',
    howFormed: 'Formed by transfer of an electron from sodium to chlorine, producing Na+ and Cl- ions that attract each other to form an ionic lattice.',
    more: 'Common table salt is used in food and industrial processes; it dissolves readily in water to yield sodium and chloride ions.'
  },
  'item-3': {
    title: 'Sugar',
    formula: 'C12H22O11',
    composition: 'Sucrose (disaccharide)',
    howFormed: 'Sucrose forms from a glycosidic bond between glucose and fructose monosaccharides via dehydration synthesis.',
    more: 'Sucrose is a common sugar used as a sweetener; it is metabolized to provide energy in organisms.'
  },
  'item-11': { title: 'Toothbrush', composition: 'Nylon (polyamide) bristles and plastic handle', more: 'Made of synthetic polymers.' },
  'item-21': { title: 'Lightbulb', composition: 'Glass envelope and tungsten filament (for incandescent bulbs)', more: 'Contains glass and metal components.' },
  'item-24': { title: 'Charger', composition: 'Copper wiring with polymer insulation', more: 'Electrical components and insulating polymers.' },
  'item-32': { title: 'Watch', composition: 'Stainless steel, glass, and battery components', more: 'Mechanical and electronic materials.' },
  'item-38': { title: 'Scissors', composition: 'Stainless steel (Fe-Cr alloy)', more: 'Metal alloy used for blades.' }
};
  // Populate remaining items (student-friendly summaries)
  const MORE_CHEM: Record<string, ChemInfo> = {
    'item-4': { title: 'Spoon', composition: 'Stainless steel or plastic', more: 'Made from metal alloys or plastics used for utensils.' },
    'item-5': { title: 'Fork', composition: 'Stainless steel', more: 'Typically stainless steel (iron + chromium).' },
    'item-6': { title: 'Knife', composition: 'Stainless steel', more: 'Often high-carbon stainless steel for blades.' },
    'item-7': { title: 'Plate', composition: 'Ceramic (silicates) or glass', more: 'Ceramic plates are made from fired clay and glazes.' },
    'item-8': { title: 'Cup', composition: 'Ceramic, glass, or plastic', more: 'Materials vary by cup type.' },
    'item-9': { title: 'Mug', composition: 'Ceramic or glass', more: 'Mugs are usually glazed ceramics.' },
    'item-10': { title: 'Bowl', composition: 'Ceramic or glass', more: 'Common kitchen bowls are ceramic or glass.' },
    'item-12': { title: 'Toothpaste', composition: 'Fluoride compounds, abrasives, glycerin', more: 'Contains active fluoride and mild abrasives.' },
    'item-13': { title: 'Soap', composition: 'Fatty acid salts (e.g., sodium stearate)', more: 'Soaps are made by saponification of fats with an alkali.' },
    'item-14': { title: 'Shampoo', composition: 'Surfactants, water, conditioning agents', more: 'Cleansers made from surfactant chemicals.' },
    'item-15': { title: 'Towel', composition: 'Cotton fibers (cellulose)', more: 'Made from natural cellulose fibers like cotton.' },
    'item-16': { title: 'Sponge', composition: 'Cellulose or synthetic polymer (polyurethane)', more: 'Natural or synthetic absorbent materials.' },
    'item-17': { title: 'Bucket', composition: 'Plastic (polyethylene) or metal', more: 'Commonly molded plastics or metal buckets.' },
    'item-18': { title: 'Broom', composition: 'Wood handle and synthetic bristles', more: 'Simple tools made from wood and polymers.' },
    'item-19': { title: 'Mop', composition: 'Cotton or synthetic fibers', more: 'Absorbent fibers attached to a handle.' },
    'item-20': { title: 'Vacuum', composition: 'Plastics, metals, motor components', more: 'Electromechanical device with mixed materials.' },
    'item-22': { title: 'Battery', composition: 'Depends on type: alkaline (Zn/MnO2) or Li-ion', more: 'Electrochemical cells store energy.' },
    'item-23': { title: 'Phone', composition: 'Glass, metals, polymers, silicon electronics', more: 'Complex device with many material types.' },
    'item-25': { title: 'Headphones', composition: 'Plastic housing, copper wiring, magnets', more: 'Contain electrical coils and magnets.' },
    'item-26': { title: 'Speaker', composition: 'Magnet, copper coil, plastic cone', more: 'Converts electrical signals to sound.' },
    'item-27': { title: 'Remote', composition: 'Plastic casing, batteries, circuit board', more: 'Electronic device with plastic and metal.' },
    'item-28': { title: 'TV', composition: 'Glass screen, semiconductors, plastics, metals', more: 'Electronic components and display materials.' },
    'item-29': { title: 'Radio', composition: 'Metals, plastics, electronic components', more: 'Contains circuits and antennas.' },
    'item-30': { title: 'Key', composition: 'Brass or steel', more: 'Simple metal alloy objects.' },
    'item-31': { title: 'Wallet', composition: 'Leather or synthetic materials', more: 'Made from organic or synthetic materials.' },
    'item-33': { title: 'Glasses', composition: 'Glass lenses, metal or plastic frames', more: 'Optical lenses made of glass or polycarbonate.' },
    'item-34': { title: 'Sunglasses', composition: 'Tinted glass or plastic lenses', more: 'Lenses reduce UV transmission.' },
    'item-35': { title: 'Pen', composition: 'Plastic body, metal tip, ink (dyes/pigments)', more: 'Ink contains solvents and dyes.' },
    'item-36': { title: 'Pencil', composition: 'Graphite (carbon) core, wood shaft', more: 'Graphite is a form of carbon.' },
    'item-37': { title: 'Notebook', composition: 'Paper (cellulose)', more: 'Paper made from wood pulp (cellulose).' },
    'item-39': { title: 'Tape', composition: 'Adhesive polymers on a plastic film', more: 'Adhesives and backing materials.' },
    'item-40': { title: 'Bottle', composition: 'Glass or plastic (PET)', more: 'Material depends on bottle type.' },
    'item-41': { title: 'Can', composition: 'Aluminum or tin-plated steel', more: 'Metal cans made from aluminum or steel.' },
    'item-42': { title: 'Jar', composition: 'Glass or plastic', more: 'Used for food storage.' },
    'item-43': { title: 'Pan', composition: 'Aluminum, stainless steel, non-stick coatings', more: 'Cookware materials vary.' },
    'item-44': { title: 'Pot', composition: 'Metal (stainless steel) or cast iron', more: 'Good heat conduction materials.' },
    'item-45': { title: 'Kettle', composition: 'Metal (stainless steel) or electric with heating element', more: 'Contains heating element and metal body.' },
    'item-46': { title: 'OvenMitt', composition: 'Cotton with heat-resistant coating', more: 'Insulating fabrics to protect hands.' },
    'item-47': { title: 'Stove', composition: 'Metal surfaces, burners, electronic controls', more: 'Large appliance with metal and electronics.' },
    'item-48': { title: 'Fridge', composition: 'Metals, insulating foam, refrigerant chemicals', more: 'Contains refrigerant fluids and insulation.' },
    'item-49': { title: 'Microwave', composition: 'Metal cavity, magnetron (electronics)', more: 'Uses microwaves generated by magnetron.' },
    'item-50': { title: 'Kettle', composition: 'Metal or electric components', more: '(Duplicate label handled similarly to item-45).' }
  };

  // merge MORE_CHEM into CHEM (keep existing more detailed entries)
  for (const k of Object.keys(MORE_CHEM)) {
    if (!CHEM[k]) CHEM[k] = MORE_CHEM[k];
  }

  // Add formulas/howFormed/more for the new chemical-focused items (where appropriate)
  const CHEM_UPDATES: Record<string, ChemInfo> = {
    'item-1': { title: 'Water', formula: 'H2O', composition: 'Water molecule', howFormed: 'Formed by covalent bonding between hydrogen and oxygen atoms.', more: 'Essential for life; polar molecule and excellent solvent.' },
    'item-2': { title: 'Table Salt', formula: 'NaCl', composition: 'Sodium chloride (ionic)', howFormed: 'Formed by ionic bonding between Na+ and Cl-.', more: 'Common seasoning and preservative.' },
    'item-3': { title: 'Table Sugar (Sucrose)', formula: 'C12H22O11', composition: 'Sucrose', howFormed: 'Formed by glycosidic bond between glucose and fructose.', more: 'Sweetener found in many foods.' },
    'item-4': { title: 'Baking Soda', formula: 'NaHCO3', composition: 'Sodium bicarbonate', more: 'Used in baking and as a mild base.' },
    'item-5': { title: 'Vinegar (Acetic Acid)', formula: 'CH3COOH', composition: 'Acetic acid solution', more: 'Used for cleaning and cooking.' },
    'item-6': { title: 'Bleach (Sodium Hypochlorite)', formula: 'NaClO', composition: 'Sodium hypochlorite', more: 'Used as a disinfectant and bleaching agent.' },
    'item-7': { title: 'Ammonia', formula: 'NH3', composition: 'Ammonia gas or aqueous ammonium hydroxide', more: 'Used as a cleaner; pungent gas.' },
    'item-8': { title: 'Rubbing Alcohol (Isopropyl Alcohol)', formula: 'C3H8O', composition: 'Isopropanol', more: 'Common antiseptic and solvent.' },
    'item-9': { title: 'Hydrogen Peroxide', formula: 'H2O2', composition: 'Hydrogen peroxide', more: 'Oxidizing agent used for cleaning and bleaching.' },
    'item-10': { title: 'Chalk (Calcium Carbonate)', formula: 'CaCO3', composition: 'Calcium carbonate', more: 'Used in classrooms and as antacid.' },
    'item-11': { title: 'Natural Gas (Methane)', formula: 'CH4', composition: 'Methane gas', more: 'Primary component of natural gas.' },
    'item-12': { title: 'Butane', formula: 'C4H10', composition: 'Butane gas', more: 'Used in lighters and as fuel.' },
    'item-13': { title: 'Carbon Dioxide', formula: 'CO2', composition: 'CO2 gas', more: 'Produced by respiration and combustion; used in carbonated drinks.' },
    'item-14': { title: 'Dry Ice (Solid CO2)', formula: 'CO2', composition: 'Solid carbon dioxide', more: 'Sublimates to gas at -78.5°C.' },
    'item-15': { title: 'Antacid (Magnesium Hydroxide)', formula: 'Mg(OH)2', composition: 'Basic magnesium compound', more: 'Neutralizes stomach acid.' },
    'item-16': { title: 'Talcum Powder (Magnesium Silicate)', formula: 'Mg3Si4O10(OH)2', composition: 'Talc (silicate mineral)', more: 'Used as powder for skin; mineral composition.' },
    'item-17': { title: 'Caffeine', formula: 'C8H10N4O2', composition: 'Alkaloid stimulant', more: 'Found in coffee and tea; stimulant.' },
    'item-18': { title: 'Vitamin C (Ascorbic Acid)', formula: 'C6H8O6', composition: 'Ascorbic acid', more: 'Essential vitamin and antioxidant.' },
    'item-19': { title: 'Aspirin', formula: 'C9H8O4', composition: 'Acetylsalicylic acid', more: 'Analgesic and anti-inflammatory drug.' },
    'item-20': { title: 'Lye (Sodium Hydroxide)', formula: 'NaOH', composition: 'Strong base', more: 'Used in drain cleaners and soap making.' },
    'item-21': { title: 'Soap (Sodium Stearate)', formula: 'C18H35NaO2', composition: 'Soap salt', more: 'Made by saponification of fats with NaOH.' },
    'item-22': { title: 'Washing Soda (Sodium Carbonate)', formula: 'Na2CO3', composition: 'Sodium carbonate', more: 'Used in cleaning and laundry.' },
    'item-23': { title: 'Plaster of Paris (Calcium Sulfate Hemihydrate)', formula: 'CaSO4·0.5H2O', composition: 'Calcium sulfate hemihydrate', more: 'Used in casts and building materials.' },
    'item-24': { title: 'Propane', formula: 'C3H8', composition: 'Propane gas', more: 'Fuel for heating and grills.' },
    'item-25': { title: 'Silicon Dioxide (in glass)', formula: 'SiO2', composition: 'Silica', more: 'Main component of glass and sand.' },
    'item-26': { title: 'Formalin (Formaldehyde solution)', formula: 'CH2O', composition: 'Formaldehyde in water', more: 'Used as disinfectant and preservative (toxic).' },
    'item-27': { title: 'Toluene', formula: 'C7H8', composition: 'Aromatic hydrocarbon', more: 'Used as solvent in paint thinners.' },
    'item-28': { title: 'Naphthalene', formula: 'C10H8', composition: 'Aromatic hydrocarbon', more: 'Found in mothballs.' },
    'item-29': { title: 'Gypsum (Calcium Sulfate Dihydrate)', formula: 'CaSO4·2H2O', composition: 'Hydrated calcium sulfate', more: 'Used in plaster and drywall.' },
    'item-30': { title: 'Epsom Salt (Magnesium Sulfate)', formula: 'MgSO4', composition: 'Magnesium sulfate', more: 'Used in baths and as a laxative.' },
    'item-31': { title: 'Boric Acid', formula: 'H3BO3', composition: 'Boric acid', more: 'Used in some cleaning products and insecticides.' },
    'item-32': { title: 'Citric Acid', formula: 'C6H8O7', composition: 'Organic acid', more: 'Found in citrus fruits; used as a preservative.' },
    'item-33': { title: 'Limestone (Calcium Carbonate)', formula: 'CaCO3', composition: 'Calcium carbonate', more: 'Rock-forming mineral used in construction.' },
    'item-34': { title: 'Nitrous Oxide', formula: 'N2O', composition: 'Dinitrogen monoxide', more: 'Used as anesthetic and propellant.' },
    'item-35': { title: 'Sulfuric Acid', formula: 'H2SO4', composition: 'Strong mineral acid', more: 'Used in car batteries; highly corrosive.' },
    'item-36': { title: 'Rust (Iron(III) Oxide)', formula: 'Fe2O3', composition: 'Iron oxide', more: 'Formed by oxidation of iron.' },
    'item-37': { title: 'Detergent (Sodium Lauryl Sulfate)', formula: 'C12H25SO4Na', composition: 'Anionic surfactant', more: 'Used in many cleaning products.' },
    'item-38': { title: 'Baking Powder', composition: 'Mix (often contains NaHCO3)', more: 'Leavening agent for baking; contains baking soda and acid salts.' },
    'item-39': { title: 'Muriatic Acid (Hydrochloric Acid)', formula: 'HCl', composition: 'Hydrochloric acid', more: 'Used for cleaning and pH adjustment; corrosive.' },
    'item-40': { title: 'Drain Cleaner (Sodium Hydroxide)', formula: 'NaOH', composition: 'Strong base', more: 'Used to clear clogs; very caustic.' },
    'item-41': { title: 'Antifreeze (Ethylene Glycol)', formula: 'C2H6O2', composition: 'Ethylene glycol', more: 'Used in engine coolants; toxic if ingested.' },
    'item-42': { title: 'Paint (Titanium Dioxide pigment)', formula: 'TiO2', composition: 'Titanium dioxide', more: 'Widely used white pigment in paints.' },
    'item-43': { title: 'Concrete (Calcium Silicate)', formula: 'CaSiO3', composition: 'Calcium silicate', more: 'Common building material.' },
    'item-44': { title: 'Sand (Silicon Dioxide)', formula: 'SiO2', composition: 'Silica', more: 'Component of sand and glass.' },
    'item-45': { title: 'Cinnamon (Cinnamaldehyde)', formula: 'C9H8O', composition: 'Organic aldehyde', more: 'Gives cinnamon its flavor and aroma.' },
    'item-46': { title: 'Carbon Monoxide', formula: 'CO', composition: 'Carbon monoxide gas', more: 'Toxic, produced by incomplete combustion.' },
    'item-47': { title: 'Tylenol (Acetaminophen)', formula: 'C8H9NO2', composition: 'Paracetamol analgesic', more: 'Used for pain relief; follow dosing instructions.' },
    'item-48': { title: 'Coffee (Caffeine)', formula: 'C8H10N4O2', composition: 'Contains caffeine and other compounds', more: 'Popular stimulant beverage.' },
    'item-49': { title: 'Chocolate (Theobromine)', formula: 'C7H8N4O2', composition: 'Contains theobromine and caffeine', more: 'Stimulant compounds; chocolate is a food.' },
    'item-50': { title: 'Antacid (Calcium Carbonate)', formula: 'CaCO3', composition: 'Calcium carbonate', more: 'Used to neutralize stomach acid.' }
  };

  // merge updates into CHEM
  for (const k of Object.keys(CHEM_UPDATES)) {
    CHEM[k] = { ...CHEM[k], ...CHEM_UPDATES[k] };
  }

  // Learn more modal state and component handled inside the ImageAnalyzer render

type LibItem = { id: string; name: string; emoji: string };

// helper to render chemical formulas with digits as subscripts
function renderFormula(formula: string) {
  return formula.split(/(\d+)/).map((part, i) => (/\d+/.test(part) ? <sub key={i}>{part}</sub> : <span key={i}>{part}</span>));
}

const ImageAnalyzer: React.FC = () => {
  const [dropped, setDropped] = useState<LibItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChemInfo | null>(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const onDragStart = (e: React.DragEvent, item: LibItem) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const lib = LIB.find(l => l.id === id);
    if (lib) {
      setDropped(lib);
      setResult(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const analyze = async () => {
    if (!dropped) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
  const info: ChemInfo = CHEM[dropped.id] || { title: dropped.name, composition: 'Mixed materials (metals, polymers, glass)', more: 'Generic household item composition.' };
    setLoading(false);
    setResult(info);
  };

  const reset = () => {
    setDropped(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Image Analyzer</h1>
      <p className="text-gray-700 mb-6">Click or drag an item from the library into the table area and click Analyze to see simulated composition details.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="font-semibold mb-2 text-gray-800">Library</h2>
          <div className="grid grid-cols-1 gap-2 max-h-[560px] overflow-auto">
            {LIB.map(item => (
              <button key={item.id} onClick={() => { setDropped(item); setResult(null); }}
                className="flex items-center space-x-3 p-3 rounded border hover:bg-gray-50 text-gray-800 text-left"
                draggable
                onDragStart={(e) => onDragStart(e, item)}
              >
                <div className="w-10 text-center"><Icon name={item.name} size={28} /></div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">Click or drag to table</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h2 className="font-semibold mb-2 text-gray-800">Table (Drop Zone)</h2>
          <div className="border border-dashed border-gray-300 rounded p-6 min-h-[200px] flex items-center justify-center" onDrop={onDrop} onDragOver={onDragOver}>
            {dropped ? (
              <div className="flex items-center space-x-4">
                <div className="w-12"><Icon name={dropped.name} size={36} /></div>
                <div className="text-lg font-semibold text-gray-800">{dropped.name}</div>
              </div>
            ) : (
              <div className="text-gray-500">Drop an item here</div>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <button className={`px-4 py-2 rounded ${dropped && !loading ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`} onClick={analyze} disabled={!dropped || loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button className="px-4 py-2 rounded bg-gray-100 text-gray-800" onClick={reset}>Reset</button>
          </div>

          {result && (
            <div className="mt-6 p-4 border rounded bg-white shadow-sm text-gray-800">
              <h3 className="text-lg font-semibold">Results</h3>
              <div className="mt-2">
                <div><strong>Item:</strong> {result.title}</div>
                {result.formula && (
                  <div className="mt-1"><strong>Formula:</strong> <span className="font-mono">{renderFormula(result.formula)}</span></div>
                )}
                <div className="mt-1"><strong>Composition:</strong> <span className="font-mono">{result.composition}</span></div>
                {result.howFormed && (
                  <div className="mt-2"><strong>How it is formed:</strong>
                    <p className="text-sm text-gray-700 mt-1">{result.howFormed}</p>
                  </div>
                )}
                {result.more && (
                  <div className="mt-2"><strong>More information:</strong>
                    <p className="text-sm text-gray-700 mt-1">{result.more}</p>
                  </div>
                )}
                <div className="mt-4">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setShowLearnMore(true)}>Learn more</button>
                </div>
              </div>
            </div>
          )}

          {/* Learn more modal */}
          {showLearnMore && result && (
            <div className="fixed inset-0 z-40 flex items-center justify-center" role="dialog" aria-modal="true">
              <div className="absolute inset-0 bg-black/70" onClick={() => setShowLearnMore(false)} />
              <div className="relative max-w-2xl w-full mx-4 bg-white rounded shadow-lg p-6 z-50">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-semibold">{result.title} — Details</h4>
                  <button aria-label="Close" className="text-gray-600 hover:text-gray-800 ml-4" onClick={() => setShowLearnMore(false)}>✕</button>
                </div>
                <div className="mt-4 text-gray-800">
                  {result.formula && (<div className="mb-2"><strong>Formula:</strong> <span className="font-mono">{renderFormula(result.formula)}</span></div>)}
                  <div className="mb-2"><strong>Composition:</strong> <div className="text-sm text-gray-700 mt-1">{result.composition}</div></div>
                  {result.howFormed && (<div className="mb-2"><strong>How it is formed:</strong> <div className="text-sm text-gray-700 mt-1">{result.howFormed}</div></div>)}
                  {result.more && (<div className="mb-2"><strong>More information:</strong> <div className="text-sm text-gray-700 mt-1">{result.more}</div></div>)}

                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded">
                    <strong>Safety notes:</strong>
                    <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                      <li>Some items may be toxic, corrosive, flammable, or reactive; handle only with appropriate protective equipment.</li>
                      <li>Do not taste or inhale chemicals; keep household chemicals away from children and pets.</li>
                      <li>For strong acids/bases and solvents, follow label instructions and consult SDS (safety data sheet) when available.</li>
                    </ul>
                  </div>

                  <div className="mt-4 text-right">
                    <button className="px-4 py-2 bg-gray-100 rounded mr-2" onClick={() => setShowLearnMore(false)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;


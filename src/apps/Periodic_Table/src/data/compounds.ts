import { Compound } from '../types/chemistry';

export const compounds: Compound[] = [
  {
    formula: 'H₂O',
    name: 'Water',
    commonNames: ['Dihydrogen monoxide', 'Aqua'],
    molarMass: 18.015,
    density: '1.00 g/cm³',
    meltingPoint: '0°C',
    boilingPoint: '100°C',
    solubility: 'N/A (is the solvent)',
    hazards: ['None at normal conditions'],
    uses: ['Essential for life', 'Solvent', 'Cleaning', 'Power generation'],
    elements: [
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 }
    ]
  },
  {
    formula: 'NaCl',
    name: 'Sodium Chloride',
    commonNames: ['Table salt', 'Halite', 'Rock salt'],
    molarMass: 58.44,
    density: '2.16 g/cm³',
    meltingPoint: '801°C',
    boilingPoint: '1465°C',
    solubility: '360 g/L in water',
    hazards: ['High sodium intake health risks'],
    uses: ['Food seasoning', 'Road de-icing', 'Chemical production', 'Food preservation'],
    elements: [
      { symbol: 'Na', count: 1 },
      { symbol: 'Cl', count: 1 }
    ]
  },
  {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    commonNames: ['Dry ice (solid)', 'Carbonic acid gas'],
    molarMass: 44.01,
    density: '1.98 g/L',
    meltingPoint: '-78.5°C (sublimes)',
    boilingPoint: '-78.5°C (sublimes)',
    solubility: '1.7 g/L in water',
    hazards: ['Asphyxiation in high concentrations', 'Greenhouse gas'],
    uses: ['Fire extinguishers', 'Carbonated beverages', 'Dry ice', 'Plant photosynthesis'],
    elements: [
      { symbol: 'C', count: 1 },
      { symbol: 'O', count: 2 }
    ]
  },
  {
    formula: 'H₂SO₄',
    name: 'Sulfuric Acid',
    commonNames: ['Oil of vitriol', 'Battery acid'],
    molarMass: 98.08,
    density: '1.84 g/cm³',
    meltingPoint: '10°C',
    boilingPoint: '337°C',
    solubility: 'Miscible with water',
    hazards: ['Highly corrosive', 'Causes severe burns', 'Reactive with metals'],
    uses: ['Car batteries', 'Fertilizer production', 'Chemical synthesis', 'Metal processing'],
    elements: [
      { symbol: 'H', count: 2 },
      { symbol: 'S', count: 1 },
      { symbol: 'O', count: 4 }
    ]
  },
  {
    formula: 'NH₃',
    name: 'Ammonia',
    commonNames: ['Ammonium hydroxide (in water)', 'Hartshorn'],
    molarMass: 17.03,
    density: '0.73 g/L',
    meltingPoint: '-77.73°C',
    boilingPoint: '-33.34°C',
    solubility: '540 g/L in water',
    hazards: ['Toxic', 'Corrosive', 'Irritant to eyes and respiratory system'],
    uses: ['Fertilizers', 'Cleaning products', 'Refrigeration', 'Chemical production'],
    elements: [
      { symbol: 'N', count: 1 },
      { symbol: 'H', count: 3 }
    ]
  },
  {
    formula: 'CH₄',
    name: 'Methane',
    commonNames: ['Natural gas', 'Marsh gas', 'Biogas'],
    molarMass: 16.04,
    density: '0.717 g/L',
    meltingPoint: '-182.5°C',
    boilingPoint: '-161.5°C',
    solubility: '0.035 g/L in water',
    hazards: ['Highly flammable', 'Asphyxiant', 'Greenhouse gas'],
    uses: ['Fuel', 'Heating', 'Chemical feedstock', 'Power generation'],
    elements: [
      { symbol: 'C', count: 1 },
      { symbol: 'H', count: 4 }
    ]
  },
  {
    formula: 'CaCO₃',
    name: 'Calcium Carbonate',
    commonNames: ['Limestone', 'Chalk', 'Marble', 'Calcite'],
    molarMass: 100.09,
    density: '2.71 g/cm³',
    meltingPoint: '1339°C (decomposes)',
    boilingPoint: 'Decomposes',
    solubility: '0.013 g/L in water',
    hazards: ['Generally safe', 'Dust may irritate respiratory system'],
    uses: ['Construction material', 'Paper production', 'Antacids', 'Paint filler'],
    elements: [
      { symbol: 'Ca', count: 1 },
      { symbol: 'C', count: 1 },
      { symbol: 'O', count: 3 }
    ]
  },
  {
    formula: 'HCl',
    name: 'Hydrochloric Acid',
    commonNames: ['Muriatic acid', 'Stomach acid'],
    molarMass: 36.46,
    density: '1.18 g/cm³',
    meltingPoint: '-114.22°C',
    boilingPoint: '-85.05°C',
    solubility: '720 g/L in water',
    hazards: ['Highly corrosive', 'Causes severe burns', 'Toxic vapors'],
    uses: ['Steel pickling', 'pH control', 'Food processing', 'Cleaning'],
    elements: [
      { symbol: 'H', count: 1 },
      { symbol: 'Cl', count: 1 }
    ]
  },
  {
    formula: 'NaOH',
    name: 'Sodium Hydroxide',
    commonNames: ['Caustic soda', 'Lye'],
    molarMass: 39.997,
    density: '2.13 g/cm³',
    meltingPoint: '318°C',
    boilingPoint: '1388°C',
    solubility: '1110 g/L in water',
    hazards: ['Highly corrosive', 'Causes severe burns', 'Reacts violently with acids'],
    uses: ['Soap making', 'Paper production', 'Drain cleaner', 'Food processing'],
    elements: [
      { symbol: 'Na', count: 1 },
      { symbol: 'O', count: 1 },
      { symbol: 'H', count: 1 }
    ]
  },
  {
    formula: 'Na₂O',
    name: 'Sodium Oxide',
    commonNames: ['Sodium oxide'],
    molarMass: 61.98,
    density: '2.27 g/cm³',
    meltingPoint: '1275°C',
    boilingPoint: '1950°C (decomposes)',
    solubility: 'Reacts with water to form NaOH',
    hazards: ['Corrosive when reacting with water'],
    uses: ['Ceramics', 'Glass production', 'Chemical synthesis'],
    elements: [
      { symbol: 'Na', count: 2 },
      { symbol: 'O', count: 1 }
    ]
  },
  {
    formula: 'KNO₃',
    name: 'Potassium Nitrate',
    commonNames: ['Saltpeter', 'Niter'],
    molarMass: 101.10,
    density: '2.11 g/cm³',
    meltingPoint: '334°C',
    boilingPoint: '400°C (decomposes)',
    solubility: '316 g/L in water',
    hazards: ['Oxidizer', 'Fire hazard', 'Explosive when mixed with fuels'],
    uses: ['Fertilizers', 'Gunpowder', 'Food preservation', 'Fireworks'],
    elements: [
      { symbol: 'K', count: 1 },
      { symbol: 'N', count: 1 },
      { symbol: 'O', count: 3 }
    ]
  },
  {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    commonNames: ['Magnesia', 'Periclase'],
    molarMass: 40.30,
    density: '3.58 g/cm³',
    meltingPoint: '2852°C',
    boilingPoint: '3600°C',
    solubility: '0.0086 g/L in water',
    hazards: ['Irritant to eyes and respiratory system'],
    uses: ['Refractory materials', 'Antacids', 'Fertilizers', 'Fire retardants'],
    elements: [
      { symbol: 'Mg', count: 1 },
      { symbol: 'O', count: 1 }
    ]
  },
  {
    formula: 'Al₂O₃',
    name: 'Aluminum Oxide',
    commonNames: ['Alumina', 'Corundum'],
    molarMass: 101.96,
    density: '3.95 g/cm³',
    meltingPoint: '2072°C',
    boilingPoint: '2977°C',
    solubility: 'Insoluble in water',
    hazards: ['Generally safe', 'Dust may cause respiratory irritation'],
    uses: ['Abrasives', 'Ceramics', 'Aluminum production', 'Catalyst support'],
    elements: [
      { symbol: 'Al', count: 2 },
      { symbol: 'O', count: 3 }
    ]
  },
  {
    formula: 'SiO₂',
    name: 'Silicon Dioxide',
    commonNames: ['Silica', 'Quartz', 'Sand'],
    molarMass: 60.08,
    density: '2.65 g/cm³',
    meltingPoint: '1713°C',
    boilingPoint: '2950°C',
    solubility: 'Insoluble in water',
    hazards: ['Crystalline form causes silicosis'],
    uses: ['Glass making', 'Electronics', 'Construction', 'Abrasives'],
    elements: [
      { symbol: 'Si', count: 1 },
      { symbol: 'O', count: 2 }
    ]
  },
  {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide',
    commonNames: ['Rust', 'Hematite', 'Red iron oxide'],
    molarMass: 159.69,
    density: '5.24 g/cm³',
    meltingPoint: '1566°C',
    boilingPoint: 'Decomposes',
    solubility: 'Insoluble in water',
    hazards: ['Generally safe', 'Dust may irritate respiratory system'],
    uses: ['Pigments', 'Iron production', 'Magnetic materials', 'Polishing compounds'],
    elements: [
      { symbol: 'Fe', count: 2 },
      { symbol: 'O', count: 3 }
    ]
  },
  {
    formula: 'CuSO₄',
    name: 'Copper(II) Sulfate',
    commonNames: ['Blue vitriol', 'Bluestone'],
    molarMass: 159.61,
    density: '3.60 g/cm³',
    meltingPoint: '110°C (dehydrates)',
    boilingPoint: '650°C (decomposes)',
    solubility: '203 g/L in water',
    hazards: ['Harmful if ingested', 'Irritant to eyes and skin'],
    uses: ['Fungicides', 'Algaecides', 'Electroplating', 'Wood preservation'],
    elements: [
      { symbol: 'Cu', count: 1 },
      { symbol: 'S', count: 1 },
      { symbol: 'O', count: 4 }
    ]
  }
];

export const getCompoundByFormula = (formula: string): Compound | undefined => {
  return compounds.find(compound => compound.formula === formula);
};

export const findPossibleCompounds = (elementSymbols: string[]): Compound[] => {
  return compounds.filter(compound => {
    const compoundElements = compound.elements.map(e => e.symbol);
    // All selected elements must be in the compound, and all compound elements must be in the selection
    const selectedSet = new Set(elementSymbols);
    const compoundSet = new Set(compoundElements);
    if (selectedSet.size !== compoundSet.size) return false;
    for (const symbol of selectedSet) {
      if (!compoundSet.has(symbol)) return false;
    }
    return true;
  });
};
export const compounds = [
  { formula: 'H2O', name: 'Water', elements: [ { symbol: 'H', count: 2 }, { symbol: 'O', count: 1 } ] },
  { formula: 'CO2', name: 'Carbon dioxide', elements: [ { symbol: 'C', count: 1 }, { symbol: 'O', count: 2 } ] },
  { formula: 'CO', name: 'Carbon monoxide', elements: [ { symbol: 'C', count: 1 }, { symbol: 'O', count: 1 } ] },
  { formula: 'Na2O', name: 'Sodium oxide', elements: [ { symbol: 'Na', count: 2 }, { symbol: 'O', count: 1 } ] },
  { formula: 'NaCl', name: 'Sodium chloride', elements: [ { symbol: 'Na', count: 1 }, { symbol: 'Cl', count: 1 } ] },
  { formula: 'OF2', name: 'Oxygen difluoride', elements: [ { symbol: 'O', count: 1 }, { symbol: 'F', count: 2 } ] },
  { formula: 'O2F2', name: 'Dioxygen difluoride', elements: [ { symbol: 'O', count: 2 }, { symbol: 'F', count: 2 } ] },
  { formula: 'NaOH', name: 'Sodium hydroxide', elements: [ { symbol: 'Na', count: 1 }, { symbol: 'O', count: 1 }, { symbol: 'H', count: 1 } ] }
  ,
  { formula: 'NO', name: 'Nitric oxide', elements: [ { symbol: 'N', count: 1 }, { symbol: 'O', count: 1 } ] },
  { formula: 'NO2', name: 'Nitrogen dioxide', elements: [ { symbol: 'N', count: 1 }, { symbol: 'O', count: 2 } ] },
  { formula: 'N2O', name: 'Nitrous oxide', elements: [ { symbol: 'N', count: 2 }, { symbol: 'O', count: 1 } ] },
  { formula: 'N2O3', name: 'Dinitrogen trioxide', elements: [ { symbol: 'N', count: 2 }, { symbol: 'O', count: 3 } ] },
  { formula: 'N2O4', name: 'Dinitrogen tetroxide', elements: [ { symbol: 'N', count: 2 }, { symbol: 'O', count: 4 } ] },
  { formula: 'N2O5', name: 'Dinitrogen pentoxide', elements: [ { symbol: 'N', count: 2 }, { symbol: 'O', count: 5 } ] }
];

export const findPossibleCompounds = (selectedSymbols) => {
  const selSet = new Set(selectedSymbols);
  return compounds.filter(c => {
    const cSymbols = c.elements.map(e => e.symbol);
    const cSet = new Set(cSymbols);
    // simple membership: every selected symbol must appear in the compound
    for (const s of selSet) if (!cSet.has(s)) return false;
    // also require that the compound doesn't include extra symbols beyond the selection
    for (const s of cSet) if (!selSet.has(s)) return false;
    return true;
  });
};

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  electronConfiguration: string;
  oxidationStates: string;
  meltingPoint: string;
  boilingPoint: string;
  density: string;
  category: ElementCategory;
  period: number;
  group: number;
  discoveredBy: string;
  discoveryYear: number;
  uses: string[];
  funFacts: string[];
  color: string;
  position: { row: number; col: number };
  description?: string;
  indicators?: string[];
}

export enum ElementCategory {
  ALKALI_METALS = 'alkali-metals',
  ALKALINE_EARTH_METALS = 'alkaline-earth-metals',
  TRANSITION_METALS = 'transition-metals',
  POST_TRANSITION_METALS = 'post-transition-metals',
  METALLOIDS = 'metalloids',
  NONMETALS = 'nonmetals',
  HALOGENS = 'halogens',
  NOBLE_GASES = 'noble-gases',
  LANTHANIDES = 'lanthanides',
  ACTINIDES = 'actinides'
}

export interface Compound {
  formula: string;
  name: string;
  commonNames: string[];
  molarMass: number;
  density: string;
  meltingPoint: string;
  boilingPoint: string;
  solubility: string;
  hazards: string[];
  uses: string[];
  elements: { symbol: string; count: number }[];
}

export interface Reaction {
  reactants: string[];
  products: string[];
  type: ReactionType;
  conditions: string;
  energyChange: 'endothermic' | 'exothermic';
  balancedEquation: string;
}

export enum ReactionType {
  SYNTHESIS = 'synthesis',
  DECOMPOSITION = 'decomposition',
  SINGLE_REPLACEMENT = 'single-replacement',
  DOUBLE_REPLACEMENT = 'double-replacement',
  COMBUSTION = 'combustion',
  ACID_BASE = 'acid-base'
}
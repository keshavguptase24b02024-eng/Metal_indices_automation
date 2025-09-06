import { Metal, MetalStandards, GroundwaterSample, GeneralParameter } from './types';

export const METALS: Metal[] = ['Pb', 'Cd', 'Cr', 'As', 'Hg', 'Ni', 'Zn'];
export const GENERAL_PARAMETERS: GeneralParameter[] = ['ec', 'chloride', 'fluoride', 'nitrate'];

// CGWB follows BIS standards (IS 10500:2012, Acceptable Limits for Drinking Water)
export const CGWB_STANDARDS: MetalStandards = {
  Pb: 0.01,
  Cd: 0.003,
  Cr: 0.05,
  As: 0.01,
  Hg: 0.001,
  Ni: 0.02,
  Zn: 5.0,
};

export const REGIONAL_STANDARDS = {
  'CGWB': CGWB_STANDARDS,
};

// Example initial sample data
export const DEFAULT_SAMPLES: GroundwaterSample[] = [
  {
    sample_id: "S1 (High Pollution)",
    latitude: 30.72,
    longitude: 76.78,
    Pb: 0.12,
    Cd: 0.03,
    Cr: 0.05,
    As: 0.01,
    Ni: 0.02,
    Zn: 0.07,
    ec: 3500,
    chloride: 1200,
    fluoride: 2.5,
    nitrate: 100,
  },
  {
    sample_id: "S2 (Low Pollution)",
    latitude: 30.75,
    longitude: 76.80,
    Pb: 0.005,
    Cd: 0.001,
    Cr: 0.01,
    As: 0.002,
    Ni: 0.01,
    Zn: 1.5,
    ec: 500,
    chloride: 150,
    fluoride: 0.8,
    nitrate: 20,
  },
];

// Classification Thresholds
export const HPI_THRESHOLDS = {
  HIGH: 100,
  MEDIUM: 50,
};

export const HEI_THRESHOLDS = {
  HIGH: 20,
  MEDIUM: 10,
};

export const CD_THRESHOLDS = {
  HIGH: 3,
  MEDIUM: 1,
};

export const GENERAL_THRESHOLDS = {
    ec: {
        FRESH: 750,
        MODERATE: 3000,
    },
    chloride: {
        DESIRABLE: 250,
        PERMISSIBLE: 1000,
    },
    fluoride: {
        DESIRABLE: 1.0,
        PERMISSIBLE: 1.5,
    },
    nitrate: {
        PERMISSIBLE: 45,
    }
};

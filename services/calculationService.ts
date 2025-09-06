import { GroundwaterSample, MetalStandards, CalculationResult, Classification, IndexResult, Metal } from '../types';
import { METALS, HPI_THRESHOLDS, HEI_THRESHOLDS, CD_THRESHOLDS, GENERAL_THRESHOLDS } from '../constants';

// Helper function for HPI classification
const getHpiClassification = (hpi: number): Classification => {
  if (hpi > HPI_THRESHOLDS.HIGH) return 'High Pollution';
  if (hpi > HPI_THRESHOLDS.MEDIUM) return 'Medium Pollution';
  return 'Low Pollution';
};

// Helper function for HEI classification
const getHeiClassification = (hei: number): Classification => {
  if (hei > HEI_THRESHOLDS.HIGH) return 'High Pollution';
  if (hei > HEI_THRESHOLDS.MEDIUM) return 'Medium Pollution';
  return 'Low Pollution';
};

// Helper function for Cd classification
const getCdClassification = (cd: number): Classification => {
  if (cd > CD_THRESHOLDS.HIGH) return 'High Contamination';
  if (cd > CD_THRESHOLDS.MEDIUM) return 'Medium Contamination';
  return 'Low Contamination';
};

// Helper functions for general parameter classifications
const getEcClassification = (value: number): Classification => {
    if (value > GENERAL_THRESHOLDS.ec.MODERATE) return 'Highly Mineralized';
    if (value > GENERAL_THRESHOLDS.ec.FRESH) return 'Moderate';
    return 'Fresh';
};

const getChlorideClassification = (value: number): Classification => {
    if (value > GENERAL_THRESHOLDS.chloride.PERMISSIBLE) return 'Beyond Permissible';
    if (value > GENERAL_THRESHOLDS.chloride.DESIRABLE) return 'Permissible';
    return 'Desirable';
};

const getFluorideClassification = (value: number): Classification => {
    if (value > GENERAL_THRESHOLDS.fluoride.PERMISSIBLE) return 'Beyond Permissible';
    if (value > GENERAL_THRESHOLDS.fluoride.DESIRABLE) return 'Permissible';
    return 'Desirable';
};

const getNitrateClassification = (value: number): Classification => {
    if (value > GENERAL_THRESHOLDS.nitrate.PERMISSIBLE) return 'Beyond Permissible';
    return 'Permissible';
};


export const calculateIndices = (sample: GroundwaterSample, standards: MetalStandards): CalculationResult => {
  let hpiNumerator = 0;
  let hpiDenominator = 0;
  let heiSum = 0;
  let cdSum = 0;

  METALS.forEach((metal: Metal) => {
    const Mi = sample[metal] || 0;
    const Si = standards[metal];

    if (Si <= 0 || Mi === 0) {
      return; 
    }

    const Wi = 1 / Si;
    const Qi = (Mi / Si) * 100;
    hpiNumerator += (Qi * Wi);
    hpiDenominator += Wi;

    heiSum += (Mi / Si);

    if (Mi > Si) {
      const Cfi = (Mi / Si) - 1;
      cdSum += Cfi;
    }
  });

  const hpiValue = hpiDenominator > 0 ? hpiNumerator / hpiDenominator : 0;
  const heiValue = heiSum;
  const cdValue = cdSum;

  const results: CalculationResult = {
    sample_id: sample.sample_id,
    hpi: {
      value: parseFloat(hpiValue.toFixed(2)),
      classification: getHpiClassification(hpiValue),
    },
    hei: {
      value: parseFloat(heiValue.toFixed(2)),
      classification: getHeiClassification(heiValue),
    },
    cd: {
      value: parseFloat(cdValue.toFixed(2)),
      classification: getCdClassification(cdValue),
    },
  };

  if (sample.ec !== undefined) {
    results.ec = { value: sample.ec, classification: getEcClassification(sample.ec) };
  }
  if (sample.chloride !== undefined) {
    results.chloride = { value: sample.chloride, classification: getChlorideClassification(sample.chloride) };
  }
  if (sample.fluoride !== undefined) {
    results.fluoride = { value: sample.fluoride, classification: getFluorideClassification(sample.fluoride) };
  }
  if (sample.nitrate !== undefined) {
    results.nitrate = { value: sample.nitrate, classification: getNitrateClassification(sample.nitrate) };
  }

  return results;
};

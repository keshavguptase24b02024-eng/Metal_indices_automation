export type Metal = 'Pb' | 'Cd' | 'Cr' | 'As' | 'Hg' | 'Ni' | 'Zn';
export type GeneralParameter = 'ec' | 'chloride' | 'fluoride' | 'nitrate';

export type MetalConcentrations = {
  [key in Metal]?: number;
};

export type GeneralParameterConcentrations = {
    [key in GeneralParameter]?: number;
};

export interface GroundwaterSample extends MetalConcentrations, GeneralParameterConcentrations {
  sample_id: string;
  latitude?: number;
  longitude?: number;
}

export type MetalStandards = {
  [key in Metal]: number;
};

export type StandardType = 'CGWB' | 'Custom';

export type Classification = 
  | 'Low Pollution' | 'Medium Pollution' | 'High Pollution'
  | 'Low Contamination' | 'Medium Contamination' | 'High Contamination'
  | 'Fresh' | 'Moderate' | 'Highly Mineralized'
  | 'Desirable' | 'Permissible' | 'Beyond Permissible';


export interface IndexResult {
  value: number;
  classification: Classification;
}

export interface CalculationResult {
  sample_id: string;
  hpi: IndexResult;
  hei: IndexResult;
  cd: IndexResult;
  ec?: IndexResult;
  chloride?: IndexResult;
  fluoride?: IndexResult;
  nitrate?: IndexResult;
}

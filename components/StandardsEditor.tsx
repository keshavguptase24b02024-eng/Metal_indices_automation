import React from 'react';
import { Metal, MetalStandards, StandardType } from '../types';
import { REGIONAL_STANDARDS } from '../constants';

interface StandardsEditorProps {
  standards: MetalStandards;
  onStandardChange: (metal: Metal, value: number) => void;
  metals: Metal[];
  selectedStandard: StandardType;
  onStandardSelect: (standardType: StandardType) => void;
}

const StandardsEditor: React.FC<StandardsEditorProps> = ({ standards, onStandardChange, metals, selectedStandard, onStandardSelect }) => {
  const isCustom = selectedStandard === 'Custom';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        Standard Permissible Limits (mg/L)
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select Standard Set</label>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(Object.keys(REGIONAL_STANDARDS) as Array<keyof typeof REGIONAL_STANDARDS>).map((std) => (
            <div key={std} className="flex items-center">
              <input
                type="radio"
                id={`standard-select-${std}`}
                name="standard-select"
                value={std}
                checked={selectedStandard === std}
                onChange={() => onStandardSelect(std)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor={`standard-select-${std}`} className="ml-2 block text-sm text-gray-900">
                {std === 'CGWB' ? 'CGWB (IS 10500:2012)' : std}
              </label>
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="radio"
              id="standard-select-custom"
              name="standard-select"
              value="Custom"
              checked={isCustom}
              onChange={() => onStandardSelect('Custom')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="standard-select-custom" className="ml-2 block text-sm text-gray-900">
              Custom
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metals.map(metal => (
          <div key={metal}>
            <label htmlFor={`standard-${metal}`} className="block text-sm font-medium text-gray-600">
              {metal}
            </label>
            <input
              type="number"
              id={`standard-${metal}`}
              name={metal}
              value={standards[metal]}
              onChange={(e) => onStandardChange(metal, parseFloat(e.target.value) || 0)}
              className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                !isCustom ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              step="0.001"
              min="0"
              readOnly={!isCustom}
            />
          </div>
        ))}
      </div>
       <p className="text-xs text-gray-500 mt-4">
        {isCustom 
          ? 'You are editing a custom set of standards.' 
          : 'Select "Custom" to edit these values.'
        }
      </p>
    </div>
  );
};

export default StandardsEditor;
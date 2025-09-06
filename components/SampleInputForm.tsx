import React, { useState } from 'react';
import { GroundwaterSample, Metal, GeneralParameter } from '../types';

interface SampleInputFormProps {
  onAddSample: (sample: GroundwaterSample) => void;
  metals: Metal[];
  generalParameters: GeneralParameter[];
  existingSampleIds: string[];
}

const SampleInputForm: React.FC<SampleInputFormProps> = ({ onAddSample, metals, generalParameters, existingSampleIds }) => {
  const getInitialState = () => ({
    sample_id: '',
    ...[...metals, ...generalParameters].reduce((acc, param) => ({ ...acc, [param]: '' }), {})
  });

  const [sampleData, setSampleData] = useState<any>(getInitialState());
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSampleData({ ...sampleData, [name]: value });

    if (name === 'sample_id') {
      if (existingSampleIds.includes(value)) {
        setError('Sample ID already exists. Please use a unique ID.');
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleData.sample_id.trim()) {
      setError('Sample ID is required.');
      return;
    }
    if (existingSampleIds.includes(sampleData.sample_id)) {
        setError('Sample ID already exists. Please use a unique ID.');
        return;
    }
    setError(null);
    
    const newSample: GroundwaterSample = {
      sample_id: sampleData.sample_id,
    };
    
    [...metals, ...generalParameters].forEach(param => {
      const val = parseFloat(sampleData[param]);
      if (!isNaN(val)) {
        // @ts-ignore
        newSample[param] = val;
      }
    });

    onAddSample(newSample);
    setSampleData(getInitialState());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        Add New Groundwater Sample
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sample_id" className="block text-sm font-medium text-gray-600">
            Sample ID
          </label>
          <input
            type="text"
            id="sample_id"
            name="sample_id"
            value={sampleData.sample_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <h3 className="text-md font-semibold text-gray-600 mt-4 mb-2 border-t pt-4">Heavy Metal Concentrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metals.map(metal => (
              <div key={metal}>
                <label htmlFor={`conc-${metal}`} className="block text-sm font-medium text-gray-600">
                  {metal} (mg/L)
                </label>
                <input
                  type="number"
                  id={`conc-${metal}`}
                  name={metal}
                  value={sampleData[metal] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  step="0.001"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold text-gray-600 mt-4 mb-2 border-t pt-4">General Quality Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="conc-ec" className="block text-sm font-medium text-gray-600">EC (μS/cm)</label>
                <input type="number" id="conc-ec" name="ec" value={sampleData.ec || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" min="0" placeholder="e.g., 750" />
              </div>
              <div>
                <label htmlFor="conc-chloride" className="block text-sm font-medium text-gray-600">Chloride (mg/L)</label>
                <input type="number" id="conc-chloride" name="chloride" value={sampleData.chloride || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" min="0" placeholder="e.g., 250" />
              </div>
              <div>
                <label htmlFor="conc-fluoride" className="block text-sm font-medium text-gray-600">Fluoride (mg/L)</label>
                <input type="number" id="conc-fluoride" name="fluoride" value={sampleData.fluoride || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" step="0.01" min="0" placeholder="e.g., 1.0" />
              </div>
              <div>
                <label htmlFor="conc-nitrate" className="block text-sm font-medium text-gray-600">Nitrate (mg/L)</label>
                <input type="number" id="conc-nitrate" name="nitrate" value={sampleData.nitrate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" min="0" placeholder="e.g., 45" />
              </div>
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          type="submit"
          disabled={!!error || !sampleData.sample_id.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Sample
        </button>
      </form>
    </div>
  );
};

export default SampleInputForm;

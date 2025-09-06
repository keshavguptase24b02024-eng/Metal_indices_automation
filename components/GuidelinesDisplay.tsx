import React from 'react';

const guidelines = [
  {
    parameter: 'EC (μS/cm)',
    unit: 'μS/cm at 25°C',
    classifications: [
      { range: '< 750', label: 'Fresh', color: 'bg-green-100' },
      { range: '750 - 3000', label: 'Moderate', color: 'bg-yellow-100' },
      { range: '> 3000', label: 'Highly Mineralized', color: 'bg-red-100' },
    ],
  },
  {
    parameter: 'Chloride',
    unit: 'mg/L',
    classifications: [
      { range: '< 250', label: 'Desirable', color: 'bg-green-100' },
      { range: '251 - 1000', label: 'Permissible', color: 'bg-yellow-100' },
      { range: '> 1000', label: 'Beyond Permissible', color: 'bg-red-100' },
    ],
  },
  {
    parameter: 'Fluoride',
    unit: 'mg/L',
    classifications: [
      { range: '< 1.0', label: 'Desirable', color: 'bg-green-100' },
      { range: '1.0 - 1.5', label: 'Permissible', color: 'bg-yellow-100' },
      { range: '> 1.5', label: 'Beyond Permissible', color: 'bg-red-100' },
    ],
  },
  {
    parameter: 'Nitrate',
    unit: 'mg/L',
    classifications: [
      { range: '< 45', label: 'Permissible', color: 'bg-green-100' },
      { range: '> 45', label: 'Beyond Permissible', color: 'bg-red-100' },
    ],
  },
];

const GuidelinesDisplay: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        CGWB Quality Guidelines
      </h2>
      <div className="space-y-4">
        {guidelines.map((guide) => (
          <div key={guide.parameter}>
            <h3 className="text-sm font-semibold text-gray-800">{guide.parameter}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {guide.classifications.map((c) => (
                <div key={c.label} className={`px-2 py-1 text-xs rounded-md ${c.color}`}>
                  <strong>{c.label}:</strong> {c.range}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
       <p className="text-xs text-gray-500 mt-4">
        Source: Central Ground Water Board (CGWB) reports on drinking water quality.
      </p>
    </div>
  );
};

export default GuidelinesDisplay;

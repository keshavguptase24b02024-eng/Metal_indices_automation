import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { GroundwaterSample } from '../types';

interface DataUploaderProps {
  onDataUploaded: (samples: GroundwaterSample[]) => void;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75M4.5 12.75h15" />
    </svg>
);


const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded }) => {
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.csv')) {
        setStatusMessage('Error: Please upload a valid CSV file.');
        setIsError(true);
        return;
    }

    setIsLoading(true);
    setStatusMessage('Processing file...');
    setIsError(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        setIsLoading(false);
        if (results.errors.length) {
          console.error('CSV Parsing Errors:', results.errors);
          setStatusMessage(`Error parsing CSV: ${results.errors[0].message}`);
          setIsError(true);
          return;
        }

        const parsedData = results.data as any[];
        if (!parsedData.length || !parsedData[0].sample_id) {
            setStatusMessage('Error: CSV must contain a "sample_id" column and at least one data row.');
            setIsError(true);
            return;
        }
        
        const newSamples: GroundwaterSample[] = parsedData.map((row, index) => {
            const sample: GroundwaterSample = {
                sample_id: row.sample_id?.toString() ?? `Row-${index + 1}`,
                Pb: typeof row.Pb === 'number' ? row.Pb : undefined,
                Cd: typeof row.Cd === 'number' ? row.Cd : undefined,
                Cr: typeof row.Cr === 'number' ? row.Cr : undefined,
                As: typeof row.As === 'number' ? row.As : undefined,
                Hg: typeof row.Hg === 'number' ? row.Hg : undefined,
                Ni: typeof row.Ni === 'number' ? row.Ni : undefined,
                Zn: typeof row.Zn === 'number' ? row.Zn : undefined,
                ec: typeof row.ec === 'number' ? row.ec : undefined,
                chloride: typeof row.chloride === 'number' ? row.chloride : undefined,
                fluoride: typeof row.fluoride === 'number' ? row.fluoride : undefined,
                nitrate: typeof row.nitrate === 'number' ? row.nitrate : undefined,
            };
            return sample;
        });

        onDataUploaded(newSamples);
        setStatusMessage(`${newSamples.length} samples loaded successfully.`);
        setIsError(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error('File Reading Error:', error);
        setStatusMessage('Error reading file.');
        setIsError(true);
      }
    });
    // Reset file input to allow re-uploading the same file
    event.target.value = ''; 
  }, [onDataUploaded]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-700 border-b pb-2">
        Upload Data File
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Upload a CSV file with data. Headers must include <code className="bg-gray-200 p-1 rounded">sample_id</code> and any of the following: <code className="bg-gray-200 p-1 rounded">Pb</code>, <code className="bg-gray-200 p-1 rounded">Cd</code>, <code className="bg-gray-200 p-1 rounded">Cr</code>, <code className="bg-gray-200 p-1 rounded">As</code>, <code className="bg-gray-200 p-1 rounded">Hg</code>, <code className="bg-gray-200 p-1 rounded">Ni</code>, <code className="bg-gray-200 p-1 rounded">Zn</code>, <code className="bg-gray-200 p-1 rounded">ec</code>, <code className="bg-gray-200 p-1 rounded">chloride</code>, <code className="bg-gray-200 p-1 rounded">fluoride</code>, <code className="bg-gray-200 p-1 rounded">nitrate</code>.
      </p>
      
      <label htmlFor="file-upload" className="w-full cursor-pointer flex items-center justify-center py-2 px-4 border border-dashed border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
        <UploadIcon className="w-5 h-5 mr-2" />
        <span>{isLoading ? 'Processing...' : 'Select CSV File'}</span>
      </label>
      <input 
        id="file-upload" 
        name="file-upload" 
        type="file" 
        className="sr-only" 
        accept=".csv"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      {statusMessage && (
        <p className={`text-sm mt-3 text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default DataUploader;
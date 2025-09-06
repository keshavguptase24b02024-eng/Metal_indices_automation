import React, { useState, useEffect, useCallback } from 'react';
import { GroundwaterSample, Metal, MetalStandards, CalculationResult, StandardType } from './types';
import { METALS, GENERAL_PARAMETERS } from './constants';
import { calculateIndices } from './services/calculationService';
import Header from './components/Header';
import StandardsEditor from './components/StandardsEditor';
import SampleInputForm from './components/SampleInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { REGIONAL_STANDARDS } from './constants';
import GuidelinesDisplay from './components/GuidelinesDisplay';
import DataUploader from './components/DataUploader';


const App: React.FC = () => {
  const [samples, setSamples] = useState<GroundwaterSample[]>([]);
  const [selectedStandardType, setSelectedStandardType] = useState<StandardType>('CGWB');
  const [standards, setStandards] = useState<MetalStandards>(REGIONAL_STANDARDS.CGWB);
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handleAddSample = (newSample: GroundwaterSample) => {
    setSamples(prevSamples => [...prevSamples, newSample]);
  };

  const handleDataUpload = (uploadedSamples: GroundwaterSample[]) => {
    setSamples(uploadedSamples);
  };

  const handleRemoveSample = (sampleId: string) => {
    setSamples(prevSamples => prevSamples.filter(s => s.sample_id !== sampleId));
  };
  
  const handleStandardsChange = (metal: Metal, value: number) => {
    setSelectedStandardType('Custom');
    setStandards(prevStandards => ({
      ...prevStandards,
      [metal]: value
    }));
  };

  const handleStandardSelect = (standardType: StandardType) => {
    setSelectedStandardType(standardType);
    if (standardType !== 'Custom') {
      setStandards(REGIONAL_STANDARDS[standardType]);
    }
  };

  const moveSample = useCallback((dragIndex: number, hoverIndex: number) => {
    setSamples(prevSamples => {
      const newSamples = [...prevSamples];
      const [movedSample] = newSamples.splice(dragIndex, 1);
      newSamples.splice(hoverIndex, 0, movedSample);
      return newSamples;
    });
  }, []);

  useEffect(() => {
    const newResults = samples.map(sample => calculateIndices(sample, standards));
    setResults(newResults);
  }, [samples, standards]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <DataUploader onDataUploaded={handleDataUpload} />
              <StandardsEditor 
                standards={standards} 
                onStandardChange={handleStandardsChange} 
                metals={METALS} 
                selectedStandard={selectedStandardType}
                onStandardSelect={handleStandardSelect}
              />
              <GuidelinesDisplay />
              <SampleInputForm 
                onAddSample={handleAddSample} 
                metals={METALS} 
                generalParameters={GENERAL_PARAMETERS}
                existingSampleIds={samples.map(s => s.sample_id)}
              />
            </div>
            <div className="lg:col-span-2">
              <ResultsDisplay 
                results={results} 
                onRemoveSample={handleRemoveSample} 
                moveSample={moveSample}
                samples={samples}
              />
            </div>
          </div>
        </main>
        <footer className="text-center p-4 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Groundwater Quality Analytics. All rights reserved.</p>
        </footer>
      </div>
    </DndProvider>
  );
};

export default App;
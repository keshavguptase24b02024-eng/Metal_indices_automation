import React from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import type { XYCoord } from 'dnd-core';
import { CalculationResult, Classification, GroundwaterSample } from '../types';

// FIX: Changed `classification` parameter type from `Classification` to `string`.
// The exhaustive switch statement caused TypeScript to infer `classification` as `never` in the `default`
// case, which does not have an `includes` method, causing a type error on line 25.
const getClassificationColor = (classification: string): string => {
  switch (classification) {
    case 'Low Pollution':
    case 'Low Contamination':
    case 'Fresh':
    case 'Desirable':
    case 'Permissible': // Permissible is green for Nitrate
      return 'bg-green-100 text-green-800';
    case 'Medium Pollution':
    case 'Medium Contamination':
    case 'Moderate':
    case 'Permissible': // Permissible is yellow for F and Cl
      return 'bg-yellow-100 text-yellow-800';
    case 'High Pollution':
    case 'High Contamination':
    case 'Highly Mineralized':
    case 'Beyond Permissible':
      return 'bg-red-100 text-red-800';
    default:
      if (classification?.includes('Permissible')) return 'bg-yellow-100 text-yellow-800';
      return 'bg-gray-100 text-gray-800';
  }
};

const ItemTypes = {
  SAMPLE: 'sample',
};

interface DraggableRowProps {
    id: string;
    index: number;
    moveSample: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

const DraggableRow: React.FC<DraggableRowProps> = ({ id, index, moveSample, children }) => {
    const ref = React.useRef<HTMLTableRowElement>(null);

    const [, drop] = useDrop({
        accept: ItemTypes.SAMPLE,
        hover(item: { id: string; index: number }, monitor: DropTargetMonitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveSample(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.SAMPLE,
        item: () => ({ id, index }),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    return <tr ref={ref} style={{ opacity }} className="group">{children}</tr>;
};

interface ResultsDisplayProps {
  results: CalculationResult[];
  samples: GroundwaterSample[];
  onRemoveSample: (sampleId: string) => void;
  moveSample: (dragIndex: number, hoverIndex: number) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onRemoveSample, moveSample, samples }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">No Data to Display</h2>
        <p className="text-gray-500">
          Upload a CSV file or add a sample manually to see the assessment results.
        </p>
      </div>
    );
  }
  
  const renderResult = (result?: { value: number, classification: Classification }) => {
    if (result === undefined) {
        return <span className="text-gray-400">N/A</span>;
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getClassificationColor(result.classification)}`}>
            {result.value} ({result.classification})
        </span>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
        Assessment Results
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom">Sample ID</th>
              <th scope="col" colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Heavy Metal Indices</th>
              <th scope="col" colSpan={4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">General Quality Parameters</th>
              <th scope="col" rowSpan={2} className="relative px-4 py-3 align-bottom">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HPI</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEI</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cd</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EC</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chloride</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fluoride</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nitrate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
               <DraggableRow key={result.sample_id} id={result.sample_id} index={index} moveSample={moveSample}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.sample_id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.hpi)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.hei)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.cd)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.ec)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.chloride)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.fluoride)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{renderResult(result.nitrate)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onRemoveSample(result.sample_id)}
                        className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove sample"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
              </DraggableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsDisplay;
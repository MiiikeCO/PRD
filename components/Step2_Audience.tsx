
import React from 'react';
import { ProductData } from '../types';
import Button from './common/Button';

interface Props {
  data: ProductData;
  updateData: (data: Partial<ProductData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2_Audience: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const canProceed = data.targetAudience.trim() !== '' && data.problemToSolve.trim() !== '';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Define Your Focus</h2>
        <p className="text-gray-400 mt-1">Who is this for and what problem are you solving?</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="targetAudience" className="font-semibold text-gray-300">Target Audience</label>
        <textarea
          id="targetAudience"
          rows={3}
          value={data.targetAudience}
          onChange={(e) => updateData({ targetAudience: e.target.value })}
          placeholder="e.g., 'Digital artists, graphic designers, and creative professionals who need inspiration.'"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="problemToSolve" className="font-semibold text-gray-300">Problem to Solve</label>
        <textarea
          id="problemToSolve"
          rows={3}
          value={data.problemToSolve}
          onChange={(e) => updateData({ problemToSolve: e.target.value })}
          placeholder="e.g., 'Artists often face creative blocks and spend hours searching for unique concepts. This tool will provide instant, high-quality visual ideas.'"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={onBack} variant="secondary">Back</Button>
        <Button onClick={onNext} disabled={!canProceed}>
            Next: Core Features
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step2_Audience;

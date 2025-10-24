
import React from 'react';
import { ProductData } from '../types';
import Button from './common/Button';

interface Props {
  data: ProductData;
  updateData: (data: Partial<ProductData>) => void;
  onNext: () => void;
}

const Step1_Welcome: React.FC<Props> = ({ data, updateData, onNext }) => {
  const canProceed = data.projectName.trim() !== '' && data.description.trim() !== '';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Let's Get Started</h2>
        <p className="text-gray-400 mt-1">Tell us about your brilliant idea.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectName" className="font-semibold text-gray-300">Project Name</label>
        <input
          id="projectName"
          type="text"
          value={data.projectName}
          onChange={(e) => updateData({ projectName: e.target.value })}
          placeholder="e.g., 'Cosmic Canvas'"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold text-gray-300">High-Level Description</label>
        <textarea
          id="description"
          rows={4}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Briefly describe what your product does. For example, 'An AI-powered platform for generating unique digital art.'"
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onNext} disabled={!canProceed}>
          Next: Audience & Problem
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step1_Welcome;

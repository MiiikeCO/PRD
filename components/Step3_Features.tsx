
import React from 'react';
import { ProductData } from '../types';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface Props {
  data: ProductData;
  updateData: (data: Partial<ProductData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const Step3_Features: React.FC<Props> = ({ data, updateData, onNext, onBack, isLoading }) => {
  const canProceed = data.features.trim() !== '';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {isLoading ? <LoadingSpinner text="Analyzing..."/> : (
      <>
        <div>
            <h2 className="text-2xl font-bold text-white">Outline Core Features</h2>
            <p className="text-gray-400 mt-1">What are the key capabilities of your product? List each feature or user story on a new line.</p>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="features" className="font-semibold text-gray-300">Features / User Stories</label>
            <textarea
            id="features"
            rows={8}
            value={data.features}
            onChange={(e) => updateData({ features: e.target.value })}
            placeholder={
`As a user, I can generate art based on a text prompt.
As a user, I can choose different art styles.
As a user, I can save my favorite creations to a personal gallery.
As a user, I can export images in high resolution.`
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-mono text-sm"
            />
        </div>

        <div className="flex justify-between mt-4">
            <Button onClick={onBack} variant="secondary" disabled={isLoading}>Back</Button>
            <Button onClick={onNext} disabled={!canProceed || isLoading}>
            Analyze & Suggest Platform
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            </Button>
        </div>
      </>
      )}
    </div>
  );
};

export default Step3_Features;

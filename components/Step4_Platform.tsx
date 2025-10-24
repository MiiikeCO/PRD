
import React from 'react';
import { PlatformRecommendation } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface Props {
  platformRecommendation: PlatformRecommendation | null;
  onNext: () => void;
  onBack: () => void;
}

const Step4_Platform: React.FC<Props> = ({ platformRecommendation, onNext, onBack }) => {

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Platform Recommendation</h2>
        <p className="text-gray-400 mt-1">Based on your input, here's the best platform for your product.</p>
      </div>

      {platformRecommendation && (
        <Card className="bg-gray-900/50 border-blue-500/50">
          <h3 className="text-xl font-bold text-blue-400">{platformRecommendation.platform}</h3>
          <p className="text-gray-300 mt-2 whitespace-pre-wrap">{platformRecommendation.justification}</p>
        </Card>
      )}

      <div className="flex justify-between mt-4">
        <Button onClick={onBack} variant="secondary">Back</Button>
        <Button onClick={onNext} disabled={!platformRecommendation}>
          Next: View Results
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step4_Platform;

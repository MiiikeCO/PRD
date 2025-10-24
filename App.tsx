
import React, { useState } from 'react';
import { ProductData, GeneratedContent, Ticket, AIPrompt } from './types';
import StepIndicator from './components/StepIndicator';
import Step1_Welcome from './components/Step1_Welcome';
import Step2_Audience from './components/Step2_Audience';
import Step3_Features from './components/Step3_Features';
import Step4_Platform from './components/Step4_Platform';
import Step5_Results from './components/Step5_Results';
import { getPlatformRecommendation, generatePRD, generateTickets, generateAIPrompts } from './services/geminiService';

const App: React.FC = () => {
  const initialProductData: ProductData = {
    projectName: '',
    description: '',
    targetAudience: '',
    problemToSolve: '',
    features: '',
  };
  
  const initialGeneratedContent: GeneratedContent = {
    platform: null,
    prd: null,
    tickets: null,
    prompts: null,
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState<ProductData>(initialProductData);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialGeneratedContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (step: number) => {
    if (step < currentStep) {
        setCurrentStep(step);
    }
  }

  const updateProductData = (data: Partial<ProductData>) => {
    setProductData((prev) => ({ ...prev, ...data }));
  };

  const handlePlatformGeneration = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // When re-generating, clear old documents
      setGeneratedContent(prev => ({ platform: prev.platform, prd: null, tickets: null, prompts: null }));
      const platformRec = await getPlatformRecommendation(productData);
      setGeneratedContent(prev => ({ ...prev, platform: platformRec }));
      handleNext();
    } catch (e) {
      setError('Failed to generate platform recommendation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentGeneration = async () => {
    if (!generatedContent.platform) {
      setError("Platform recommendation must be available to generate documents.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fullProductData = { ...productData, platform: generatedContent.platform.platform };
      
      const [prd, tickets, prompts] = await Promise.all([
        generatePRD(fullProductData),
        generateTickets(fullProductData),
        generateAIPrompts(fullProductData),
      ]);
      
      setGeneratedContent(prev => ({
        ...prev,
        prd,
        tickets: tickets as Ticket[],
        prompts: prompts as AIPrompt[],
      }));
    } catch (e) {
      setError('Failed to generate documents. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setProductData(initialProductData);
    setGeneratedContent(initialGeneratedContent);
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_Welcome data={productData} updateData={updateProductData} onNext={handleNext} />;
      case 2:
        return <Step2_Audience data={productData} updateData={updateProductData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3_Features data={productData} updateData={updateProductData} onNext={handlePlatformGeneration} onBack={handleBack} isLoading={isLoading} />;
      case 4:
        return <Step4_Platform platformRecommendation={generatedContent.platform} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5_Results content={generatedContent} onGenerate={handleDocumentGeneration} onStartOver={handleStartOver} isLoading={isLoading} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto relative">
        <span className="absolute top-0 left-0 text-xs text-gray-500 font-mono">v1.3.0</span>
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Product AI Assistant</h1>
          <p className="text-gray-400 mt-2">Your partner in building world-class products from idea to implementation.</p>
        </header>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} onStepClick={handleStepClick} />
        
        {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <main className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          {renderStep()}
        </main>
      </div>
    </div>
  );
};

export default App;

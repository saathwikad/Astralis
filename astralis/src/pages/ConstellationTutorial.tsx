import React, { useState } from 'react';
import { X } from 'lucide-react';

const ConstellationTutorial: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Constellation Creator",
      description: "Create your own unique star constellation by following these simple steps.",
      illustration: "🌟"
    },
    {
      title: "Add Stars",
      description: "Click 'Add Stars' mode and then click anywhere on the canvas to place stars.",
      illustration: "➕"
    },
    {
      title: "Connect Stars",
      description: "Switch to 'Connect Stars' mode. Click two stars to draw a line between them.",
      illustration: "🔗"
    },
    {
      title: "Delete Stars",
      description: "Use 'Delete Stars' mode to remove any star by clicking on it.",
      illustration: "🗑️"
    },
    {
      title: "Name Your Constellation",
      description: "Enter a name for your constellation in the input field at the top.",
      illustration: "✏️"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-space-dark rounded-lg p-6 w-96 relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white hover:text-red-500"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="text-4xl mb-4">{steps[currentStep].illustration}</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/80 mb-6">
            {steps[currentStep].description}
          </p>
          
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button 
                onClick={handlePrevious}
                className="px-4 py-2 bg-space-light text-white rounded-lg"
              >
                Previous
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-star-glow text-white rounded-lg ml-auto"
            >
              {currentStep === steps.length - 1 ? 'Close' : 'Next'}
            </button>
          </div>

          <div className="flex justify-center mt-4">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstellationTutorial;
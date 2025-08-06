import React, { ReactNode } from 'react';

interface WarningAlert {
  type: any;
  title: ReactNode;
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface WarningModalProps {
  warnings: WarningAlert[];
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ 
  warnings, 
  isOpen, 
  onClose, 
  onProceed 
}) => {
  if (!isOpen || !warnings.length) return null;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': 
        return 'border-red-500 bg-red-50 text-red-800';
      case 'medium': 
        return 'border-orange-500 bg-orange-50 text-orange-800';
      default: 
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '⚡';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-xl font-semibold text-red-600">
              Legal Notice Warnings
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {warnings.map((warning: WarningAlert, index: number) => (
            <div 
              key={`${warning.type}-${index}`}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(warning.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-1">
                  {getSeverityIcon(warning.severity)}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-base">
                    {warning.title}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {warning.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Important:</strong> These warnings indicate potential legal issues. 
            Please review your information carefully or consult with your lawyer before proceeding.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Review & Edit Details
            </button>
            <button 
              onClick={onProceed}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Proceed Despite Warnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;

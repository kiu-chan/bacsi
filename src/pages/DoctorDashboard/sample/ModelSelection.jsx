import React from 'react';

function ModelSelection({ selectedModel, onSelectModel, sampleId, isAnalyzing, isConnected, handleAnalyze, availableModels }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-800">Cấu hình phân tích</h2>
      </div>
      
      <div className="p-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">Chọn mô hình phân tích</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {availableModels.map((model) => (
            <div 
              key={model.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                selectedModel === model.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => onSelectModel(model.id)}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  selectedModel === model.id 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-400'
                  } flex-shrink-0 mr-3`}
                >
                  {selectedModel === model.id && (
                    <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-800">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.description}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">{model.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Lệnh phân tích sẽ được thực hiện:</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
{`(base) hoangkhanh@192 bacsi % cd wsinfer
(pytorch-env) (base) hoangkhanh@192 wsinfer % wsinfer run \\
   --wsi-dir ./slides/ \\
   --results-dir ./results/${sampleId}/${selectedModel}/ \\
   --model ${selectedModel}`}
          </pre>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !isConnected}
            className={`flex items-center px-6 py-3 rounded-md font-medium text-base ${
              isAnalyzing || !isConnected
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAnalyzing && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {!isAnalyzing && (
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            )}
            {isAnalyzing ? 'Đang phân tích...' : 'Bắt đầu phân tích'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelSelection;
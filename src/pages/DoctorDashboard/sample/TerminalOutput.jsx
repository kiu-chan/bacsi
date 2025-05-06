import React, { useRef, useEffect } from 'react';

function TerminalOutput({ logOutput, isAnalyzing }) {
  const terminalRef = useRef(null);

  // Tự động cuộn xuống cuối khi có log mới
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logOutput]);

  // Hàm cuộn xuống cuối thủ công
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-800">Terminal Output</h2>
        {isAnalyzing && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Đang xử lý
          </span>
        )}
      </div>
      
      <div 
        ref={terminalRef}
        className="bg-black text-green-400 p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto terminal-output"
      >
        {logOutput.map((line, index) => (
          <div key={index} className="py-0.5">
            {index === logOutput.length - 1 && line.includes('Finished.') ? (
              <span className="text-green-500 font-bold">{line}</span>
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
        {isAnalyzing && <span className="animate-pulse">_</span>}
      </div>

      {/* Nút cuộn xuống cuối */}
      <div className="p-2 border-t border-gray-800 bg-gray-900">
        <button
          onClick={scrollToBottom}
          className="text-xs text-gray-400 hover:text-white flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Cuộn xuống cuối
        </button>
      </div>
    </div>
  );
}

export default TerminalOutput;
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeAnalysisPanel } from './components/CodeAnalysisPanel';
import { CodeExplanation } from './components/CodeExplanation';
import { PythonSampleLibrary } from './components/PythonSampleLibrary';
import { PythonAnalyzer } from './utils/pythonAnalyzer';
import { AnalysisResult } from './types/analyzer';

const INITIAL_PYTHON_CODE = `# Python code analysis example
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def main():
    numbers = [5, 10, 15]
    
    for num in numbers:
        result = calculate_fibonacci(num)
        print(f"Fibonacci({num}) = {result}")
    
    # Potential issues in this code:
    # 1. Inefficient recursive implementation
    # 2. No input validation
    # 3. Could use memoization for better performance

if __name__ == "__main__":
    main()`;

function App() {
  const [code, setCode] = useState(INITIAL_PYTHON_CODE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample code analysis on first load
  useEffect(() => {
    if (code === INITIAL_PYTHON_CODE) {
      runAnalysis();
    }
  }, []);

  const runAnalysis = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      
      const analyzer = new PythonAnalyzer(code);
      const analysisResult = analyzer.analyze();
      setAnalysis(analysisResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
      if (error instanceof Error && error.message === "I can only analyze Python code.") {
        setError("I can only analyze Python code.");
        setAnalysis(null);
      } else {
        setError('An error occurred during analysis. Please check your code and try again.');
        setAnalysis(null);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handleLoadSample = (sampleCode: string) => {
    setCode(sampleCode);
    resetAnalysis();
  };

  const exportResults = useCallback(async () => {
    try {
      const results = {
        sourceCode: code,
        analysis,
        timestamp: new Date().toISOString(),
        language: 'python'
      };
      
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `python-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [code, analysis]);

  return (
    <div className="min-h-screen bg-dark-900">
      <Header onExport={exportResults} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Code Editor */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🐍</span>
                  Python Code
                </h2>
              </div>
              
              {/* Button Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <PythonSampleLibrary onLoadSample={handleLoadSample} />
                <button
                  onClick={resetAnalysis}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Reset
                </button>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className={`btn-primary text-sm px-4 py-2 ${
                    isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Python Code'}
                </button>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-dark-900 text-white font-mono text-sm p-4 rounded-lg border border-dark-600 focus:border-primary-500 focus:outline-none resize-none"
                placeholder="Enter your Python code here..."
                spellCheck={false}
              />
              
              <div className="mt-2 text-xs text-gray-400">
                Lines: {code.split('\n').length} | Characters: {code.length}
              </div>

              {/* Language Restriction Notice */}
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 text-sm">ℹ️</span>
                  <span className="text-blue-300 text-sm font-medium">Python Analysis Only</span>
                </div>
                <p className="text-blue-200 text-xs mt-1">
                  This tool analyzes Python code exclusively. Non-Python code will be rejected.
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 text-sm">⚠️</span>
                    <span className="text-red-300 text-sm font-medium">Analysis Error</span>
                  </div>
                  <p className="text-red-200 text-xs mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Middle Column - Analysis Results */}
          <div className="lg:col-span-1 space-y-6">
            <CodeAnalysisPanel analysis={analysis} />
          </div>
          
          {/* Right Column - Code Explanation */}
          <div className="lg:col-span-1 space-y-6">
            <CodeExplanation analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
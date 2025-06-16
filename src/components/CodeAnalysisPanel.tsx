// Import required types and components
import { AnalysisResult } from '../types/analyzer';
// Import Lucide icons for various UI elements
import { AlertTriangle, Info, Zap, Shield, Eye, Wrench, Target, Code2 } from 'lucide-react';

// Define the props interface for the CodeAnalysisPanel component
interface CodeAnalysisPanelProps {
  analysis: AnalysisResult | null;  // The analysis result object containing Python code analysis data
}

/**
 * CodeAnalysisPanel Component
 * Displays detailed analysis of Python code including:
 * - Code quality metrics
 * - Complexity analysis
 * - Syntax issues
 * - Control flow analysis
 * - Python-specific recommendations
 */
export function CodeAnalysisPanel({ analysis }: CodeAnalysisPanelProps) {
  // Display placeholder when no analysis is available
  if (!analysis) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Code2 className="w-5 h-5 mr-2 text-primary-400" />
          Python Code Analysis
        </h2>
        <div className="text-center text-gray-400 py-8">
          <div className="text-6xl mb-4">🐍</div>
          <p>No analysis available.</p>
          <p className="text-sm mt-2">Enter Python code and click "Analyze Python Code" to see detailed insights.</p>
        </div>
      </div>
    );
  }

  /**
   * Returns the appropriate icon component based on the severity level
   * @param severity - The severity level ('error', 'warning', 'info')
   * @returns A Lucide icon component with appropriate styling
   */
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * Returns the appropriate icon component for different types of suggestions
   * @param type - The suggestion type ('optimization', 'security', 'readability', 'best-practice')
   * @returns A Lucide icon component with appropriate styling
   */
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': 
      case 'performance': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      case 'readability': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'best-practice': return <Target className="w-4 h-4 text-green-500" />;
      default: return <Wrench className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * Determines the text color class based on the quality score
   * @param score - The quality score (0-100)
   * @returns Tailwind CSS color class
   */
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  /**
   * Determines the progress bar color class based on the quality score
   * @param score - The quality score (0-100)
   * @returns Tailwind CSS background color class
   */
  const getQualityBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  /**
   * Returns the appropriate background, border, and text color classes for different issue types
   * @param type - The issue type ('pep8', 'security', 'performance', 'best-practice', 'bug')
   * @returns Tailwind CSS classes for styling the issue container
   */
  const getIssueTypeColor = (type: string) => {
    switch (type) {
      case 'pep8': return 'bg-blue-900/20 border-blue-500/30 text-blue-300';
      case 'security': return 'bg-red-900/20 border-red-500/30 text-red-300';
      case 'performance': return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
      case 'best-practice': return 'bg-green-900/20 border-green-500/30 text-green-300';
      case 'bug': return 'bg-red-900/20 border-red-500/30 text-red-300';
      default: return 'bg-gray-900/20 border-gray-500/30 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Code Quality Metrics Section 
          Displays various code quality metrics with visual progress bars */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-400" />
          Python Code Quality
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Maintainability', value: analysis.codeQuality.maintainability },
            { label: 'Readability', value: analysis.codeQuality.readability },
            { label: 'Testability', value: analysis.codeQuality.testability },
            { label: 'Performance', value: analysis.codeQuality.performance },
            { label: 'Security', value: analysis.codeQuality.security }
          ].map(metric => (
            <div key={metric.label} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{metric.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getQualityBarColor(metric.value)} transition-all duration-300`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${getQualityColor(metric.value)}`}>
                  {metric.value.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Metrics Section
          Shows cyclomatic complexity, cognitive complexity, LOC, and nesting depth */}
      <div className="card p-6">
        <h3 className="text-md font-semibold text-white mb-3 flex items-center">
          <Wrench className="w-4 h-4 mr-2 text-orange-400" />
          Complexity Analysis
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-dark-700 p-3 rounded">
            <div className="text-gray-400">Cyclomatic Complexity</div>
            <div className="text-xl font-bold text-white">{analysis.logicalAnalysis.complexity.cyclomaticComplexity}</div>
          </div>
          <div className="bg-dark-700 p-3 rounded">
            <div className="text-gray-400">Cognitive Complexity</div>
            <div className="text-xl font-bold text-white">{analysis.logicalAnalysis.complexity.cognitiveComplexity}</div>
          </div>
          <div className="bg-dark-700 p-3 rounded">
            <div className="text-gray-400">Lines of Code</div>
            <div className="text-xl font-bold text-white">{analysis.logicalAnalysis.complexity.linesOfCode}</div>
          </div>
          <div className="bg-dark-700 p-3 rounded">
            <div className="text-gray-400">Max Nesting Depth</div>
            <div className="text-xl font-bold text-white">{analysis.logicalAnalysis.complexity.nestingDepth}</div>
          </div>
        </div>
      </div>

      {/* Python-Specific Issues Section
          Lists syntax issues, PEP8 violations, and other code problems */}
      {analysis.syntaxIssues.length > 0 && (
        <div className="card p-6">
          <h3 className="text-md font-semibold text-white mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
            Issues Found ({analysis.syntaxIssues.length})
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analysis.syntaxIssues.map((issue, index) => (
              <div key={index} className={`p-3 rounded border ${getIssueTypeColor(issue.type)}`}>
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{issue.message}</span>
                      <span className="text-xs px-2 py-1 bg-dark-800 rounded">
                        {issue.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">Line {issue.line}, Column {issue.column}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Flow Analysis Section
          Shows conditional branches and loops with potential issues */}
      {(analysis.logicalAnalysis.controlFlow.branches.length > 0 || 
        analysis.logicalAnalysis.controlFlow.loops.length > 0) && (
        <div className="card p-6">
          <h3 className="text-md font-semibold text-white mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2 text-blue-400" />
            Control Flow Analysis
          </h3>
          
          {analysis.logicalAnalysis.controlFlow.branches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Conditional Branches</h4>
              <div className="space-y-1">
                {analysis.logicalAnalysis.controlFlow.branches.map((branch, index) => (
                  <div key={index} className="text-sm bg-dark-700 p-2 rounded">
                    <span className="text-blue-300">Line {branch.line}</span>: {branch.type} statement
                    {branch.condition && <span className="text-gray-400 ml-2">({branch.condition})</span>}
                    {branch.alwaysTrue && <span className="text-yellow-400 ml-2">(always true)</span>}
                    {branch.alwaysFalse && <span className="text-red-400 ml-2">(always false)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.logicalAnalysis.controlFlow.loops.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Loops</h4>
              <div className="space-y-1">
                {analysis.logicalAnalysis.controlFlow.loops.map((loop, index) => (
                  <div key={index} className="text-sm bg-dark-700 p-2 rounded">
                    <span className="text-green-300">Line {loop.line}</span>: {loop.type} loop
                    {loop.condition && <span className="text-gray-400 ml-2">({loop.condition})</span>}
                    {loop.potentialIssues.length > 0 && (
                      <div className="text-yellow-400 text-xs mt-1">
                        Issues: {loop.potentialIssues.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Python Recommendations Section
          Displays suggestions for code improvements with examples */}
      {analysis.suggestions.length > 0 && (
        <div className="card p-6">
          <h3 className="text-md font-semibold text-white mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            Python Recommendations ({analysis.suggestions.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="border border-dark-600 rounded p-3">
                <div className="flex items-start space-x-3">
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{suggestion.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        suggestion.priority === 'high' ? 'bg-red-900 text-red-300' :
                        suggestion.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{suggestion.description}</div>
                    {suggestion.example && (
                      <div className="text-xs text-gray-400 bg-dark-800 p-2 rounded font-mono">
                        {suggestion.example}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">Line {suggestion.line}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
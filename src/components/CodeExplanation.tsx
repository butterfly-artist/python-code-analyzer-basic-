// Import required dependencies from React and custom types
import React from 'react';
import { AnalysisResult } from '../types/analyzer';
// Import Lucide icons for UI elements
import { MessageSquare } from 'lucide-react';

// Define the component's props interface
interface CodeExplanationProps {
  analysis: AnalysisResult | null;  // The analysis result object that contains Python code explanation
}

// CodeExplanation component displays the analysis results for Python code
export function CodeExplanation({ analysis }: CodeExplanationProps) {
  // If no analysis is available, display a placeholder UI
  if (!analysis) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-primary-400" />
          Python Code Explanation
        </h2>
        <div className="text-center text-gray-400 py-8">
          <div className="text-6xl mb-4">📝</div>
          <p>No explanation available.</p>
          <p className="text-sm mt-2">Run Python code analysis to see detailed explanations.</p>
        </div>
      </div>
    );
  }

  /**
   * Converts markdown-like text into formatted JSX elements
   * Supports different formatting styles:
   * - ## for main headings
   * - ### for subheadings
   * - ** ** for bold text with labels
   * - - for bullet points
   * - Regular text for paragraphs
   */
  const formatExplanation = (text: string) => {
    // Split the text into individual lines for processing
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      // Convert main headings (##)
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-white mt-6 mb-3 first:mt-0">
            {line.replace('## ', '')}
          </h3>
        );
      } 
      // Convert subheadings (###)
      else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-md font-semibold text-primary-300 mt-4 mb-2">
            {line.replace('### ', '')}
          </h4>
        );
      } 
      // Convert bold text with labels (**label: value**)
      else if (line.startsWith('**') && line.endsWith('**')) {
        const content = line.replace(/\*\*/g, '');
        const [label, ...rest] = content.split(': ');
        elements.push(
          <div key={index} className="mb-2">
            <span className="font-semibold text-white">{label}:</span>
            <span className="text-gray-300 ml-1">{rest.join(': ')}</span>
          </div>
        );
      } 
      // Convert bullet points (-)
      else if (line.startsWith('- ')) {
        elements.push(
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-primary-400 mt-1">•</span>
            <span className="text-gray-300 text-sm">{line.replace('- ', '')}</span>
          </div>
        );
      } 
      // Convert regular text into paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={index} className="text-gray-300 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  // Render the main component with the formatted analysis explanation
  return (
    <div className="card p-6">
      {/* Header section */}
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-primary-400" />
        Python Code Explanation
      </h2>
      
      <div className="prose prose-invert max-w-none">
        {/* Information banner */}
        <div className="bg-dark-700 p-4 rounded-lg border-l-4 border-primary-500 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🐍</span>
            <span className="text-sm font-medium text-primary-300">Python Code Analysis</span>
          </div>
          <p className="text-sm text-gray-300">
            This analysis provides detailed insights into your Python code's structure, 
            performance, PEP 8 compliance, security, and potential improvements.
          </p>
        </div>
        
        {/* Analysis content */}
        <div className="space-y-2">
          {formatExplanation(analysis.explanation)}
        </div>
      </div>
    </div>
  );
}
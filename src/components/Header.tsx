import React from 'react';
import { Download, Github, Brain } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center">
              <span className="text-2xl mr-2">🐍</span>
              Python Code Analyzer
            </h1>
            <p className="text-sm text-gray-400">
              Specialized Python code analysis focusing on structure, performance, PEP 8, and security
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
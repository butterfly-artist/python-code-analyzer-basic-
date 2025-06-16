import { AnalysisResult, SyntaxIssue, LogicalAnalysis, CodeQuality, Suggestion, ControlFlowAnalysis, DataFlowAnalysis, ComplexityMetrics, BranchInfo, LoopInfo, VariableLifetime, CodeLocation } from '../types/analyzer';

export class PythonAnalyzer {
  private code: string;
  private lines: string[];

  constructor(code: string) {
    this.code = code;
    this.lines = code.split('\n');
  }

  analyze(): AnalysisResult {
    // Check if code is Python
    if (!this.isPythonCode()) {
      throw new Error("I can only analyze Python code.");
    }

    const syntaxIssues = this.analyzeSyntax();
    const logicalAnalysis = this.analyzeLogic();
    const codeQuality = this.analyzeQuality();
    const suggestions = this.generateSuggestions();
    const explanation = this.generateExplanation();

    return {
      syntaxIssues,
      logicalAnalysis,
      codeQuality,
      suggestions,
      explanation
    };
  }

  private isPythonCode(): boolean {
    const pythonKeywords = ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with', 'as', 'lambda', 'yield', 'return'];
    const pythonPatterns = [
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /^def\s+\w+\s*\(/m,
      /^class\s+\w+/m,
      /^\s*#.*$/m,
      /print\s*\(/,
      /:\s*$/m
    ];

    const codeText = this.code.toLowerCase();
    const hasKeywords = pythonKeywords.some(keyword => codeText.includes(keyword));
    const hasPatterns = pythonPatterns.some(pattern => pattern.test(this.code));
    
    return hasKeywords || hasPatterns || this.code.includes('python') || this.code.includes('#!/usr/bin/env python');
  }

  private analyzeSyntax(): SyntaxIssue[] {
    const issues: SyntaxIssue[] = [];
    const variables = new Map<string, { line: number; scope: string; type?: string }>();
    const imports = new Set<string>();
    const functions = new Set<string>();
    const classes = new Set<string>();

    this.lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      const originalLine = line;

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) return;

      // Check indentation (PEP 8: 4 spaces)
      if (originalLine.startsWith('\t')) {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: 'Use 4 spaces for indentation instead of tabs (PEP 8)',
          type: 'pep8'
        });
      }

      const leadingSpaces = originalLine.length - originalLine.trimStart().length;
      if (leadingSpaces > 0 && leadingSpaces % 4 !== 0) {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: 'Indentation should be a multiple of 4 spaces (PEP 8)',
          type: 'pep8'
        });
      }

      // Check line length (PEP 8: max 79 characters)
      if (originalLine.length > 79) {
        issues.push({
          line: lineNum,
          column: 80,
          severity: 'info',
          message: 'Line too long (>79 characters). Consider breaking it up (PEP 8)',
          type: 'pep8'
        });
      }

      // Check for trailing whitespace
      if (originalLine.endsWith(' ') || originalLine.endsWith('\t')) {
        issues.push({
          line: lineNum,
          column: originalLine.length,
          severity: 'info',
          message: 'Trailing whitespace (PEP 8)',
          type: 'pep8'
        });
      }

      // Variable assignments
      const varAssignment = trimmedLine.match(/^(\w+)\s*=\s*(.+)/);
      if (varAssignment) {
        const varName = varAssignment[1];
        const value = varAssignment[2];
        
        // Check naming conventions (PEP 8)
        if (!/^[a-z_][a-z0-9_]*$/.test(varName)) {
          issues.push({
            line: lineNum,
            column: trimmedLine.indexOf(varName) + 1,
            severity: 'warning',
            message: `Variable '${varName}' should use snake_case naming (PEP 8)`,
            type: 'pep8'
          });
        }

        variables.set(varName, { line: lineNum, scope: 'local' });

        // Check for potential security issues
        if (value.includes('eval(') || value.includes('exec(')) {
          issues.push({
            line: lineNum,
            column: trimmedLine.indexOf('eval') + 1 || trimmedLine.indexOf('exec') + 1,
            severity: 'error',
            message: 'Use of eval() or exec() is dangerous and should be avoided',
            type: 'security'
          });
        }

        // Check for SQL injection risks
        if (value.includes('execute(') && value.includes('%') && !value.includes('?')) {
          issues.push({
            line: lineNum,
            column: 1,
            severity: 'warning',
            message: 'Potential SQL injection risk. Use parameterized queries',
            type: 'security'
          });
        }
      }

      // Function definitions
      const funcDef = trimmedLine.match(/^def\s+(\w+)\s*\(/);
      if (funcDef) {
        const funcName = funcDef[1];
        
        // Check function naming (PEP 8)
        if (!/^[a-z_][a-z0-9_]*$/.test(funcName)) {
          issues.push({
            line: lineNum,
            column: trimmedLine.indexOf(funcName) + 1,
            severity: 'warning',
            message: `Function '${funcName}' should use snake_case naming (PEP 8)`,
            type: 'pep8'
          });
        }

        functions.add(funcName);

        // Check for missing docstring
        const nextLine = this.lines[index + 1];
        if (!nextLine || !nextLine.trim().startsWith('"""') && !nextLine.trim().startsWith("'''")) {
          issues.push({
            line: lineNum + 1,
            column: 1,
            severity: 'info',
            message: `Function '${funcName}' should have a docstring (PEP 257)`,
            type: 'documentation'
          });
        }
      }

      // Class definitions
      const classDef = trimmedLine.match(/^class\s+(\w+)/);
      if (classDef) {
        const className = classDef[1];
        
        // Check class naming (PEP 8: CapWords)
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
          issues.push({
            line: lineNum,
            column: trimmedLine.indexOf(className) + 1,
            severity: 'warning',
            message: `Class '${className}' should use CapWords naming (PEP 8)`,
            type: 'pep8'
          });
        }

        classes.add(className);
      }

      // Import statements
      const importMatch = trimmedLine.match(/^(?:import|from)\s+(\w+)/);
      if (importMatch) {
        imports.add(importMatch[1]);
        
        // Check for wildcard imports
        if (trimmedLine.includes('import *')) {
          issues.push({
            line: lineNum,
            column: trimmedLine.indexOf('*') + 1,
            severity: 'warning',
            message: 'Avoid wildcard imports (import *) as they pollute namespace',
            type: 'best-practice'
          });
        }
      }

      // Check for bare except clauses
      if (trimmedLine === 'except:') {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: 'Bare except clause catches all exceptions. Specify exception types',
          type: 'best-practice'
        });
      }

      // Check for mutable default arguments
      if (trimmedLine.includes('def ') && (trimmedLine.includes('=[]') || trimmedLine.includes('={}'))) {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          message: 'Mutable default arguments can cause unexpected behavior',
          type: 'bug'
        });
      }

      // Check for == with None (should use 'is')
      if (trimmedLine.includes('== None') || trimmedLine.includes('!= None')) {
        issues.push({
          line: lineNum,
          column: trimmedLine.indexOf('None') - 3,
          severity: 'warning',
          message: "Use 'is None' or 'is not None' instead of '== None' or '!= None'",
          type: 'best-practice'
        });
      }

      // Check for potential performance issues
      if (trimmedLine.includes('for ') && trimmedLine.includes('range(len(')) {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'info',
          message: 'Consider using enumerate() instead of range(len())',
          type: 'performance'
        });
      }

      // Check for string concatenation in loops
      if ((trimmedLine.includes('for ') || trimmedLine.includes('while ')) && 
          (trimmedLine.includes('+=') && trimmedLine.includes('"'))) {
        issues.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: 'String concatenation in loops is inefficient. Use join() or f-strings',
          type: 'performance'
        });
      }

      // Check for unused imports (simplified check)
      imports.forEach(imp => {
        if (!this.code.includes(imp + '.') && !this.code.includes(imp + '(')) {
          const importLine = this.lines.findIndex(l => l.includes(`import ${imp}`)) + 1;
          if (importLine > 0) {
            issues.push({
              line: importLine,
              column: 1,
              severity: 'info',
              message: `Import '${imp}' appears to be unused`,
              type: 'unused'
            });
          }
        }
      });
    });

    return issues;
  }

  private analyzeLogic(): LogicalAnalysis {
    const controlFlow = this.analyzeControlFlow();
    const dataFlow = this.analyzeDataFlow();
    const complexity = this.calculateComplexity();

    return {
      controlFlow,
      dataFlow,
      complexity
    };
  }

  private analyzeControlFlow(): ControlFlowAnalysis {
    const branches: BranchInfo[] = [];
    const loops: LoopInfo[] = [];
    const unreachableCode: CodeLocation[] = [];
    const potentialInfiniteLoops: CodeLocation[] = [];

    this.lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // Analyze if statements
      if (trimmedLine.startsWith('if ')) {
        const condition = this.extractPythonCondition(trimmedLine, 'if');
        branches.push({
          line: lineNum,
          type: 'if',
          condition,
          alwaysTrue: this.isPythonAlwaysTrue(condition),
          alwaysFalse: this.isPythonAlwaysFalse(condition),
          edgeCases: this.findPythonEdgeCases(condition)
        });
      }

      // Analyze loops
      if (trimmedLine.startsWith('while ')) {
        const condition = this.extractPythonCondition(trimmedLine, 'while');
        loops.push({
          line: lineNum,
          type: 'while',
          condition,
          potentialIssues: this.analyzePythonLoopIssues(condition, 'while')
        });

        if (condition === 'True' || condition === '1') {
          potentialInfiniteLoops.push({
            line: lineNum,
            column: 1,
            description: 'Potential infinite loop with always-true condition'
          });
        }
      }

      if (trimmedLine.startsWith('for ')) {
        const condition = trimmedLine.substring(4);
        loops.push({
          line: lineNum,
          type: 'for',
          condition,
          potentialIssues: this.analyzePythonLoopIssues(condition, 'for')
        });
      }

      // Check for unreachable code after return
      if (trimmedLine.startsWith('return') && index < this.lines.length - 1) {
        const nextLineIndex = index + 1;
        const nextLine = this.lines[nextLineIndex]?.trim();
        if (nextLine && !nextLine.startsWith('#') && nextLine !== '' && 
            !nextLine.startsWith('def ') && !nextLine.startsWith('class ')) {
          // Check if next line has same or greater indentation
          const currentIndent = line.length - line.trimStart().length;
          const nextIndent = this.lines[nextLineIndex].length - this.lines[nextLineIndex].trimStart().length;
          
          if (nextIndent >= currentIndent) {
            unreachableCode.push({
              line: nextLineIndex + 1,
              column: 1,
              description: 'Code after return statement is unreachable'
            });
          }
        }
      }
    });

    return {
      branches,
      loops,
      unreachableCode,
      potentialInfiniteLoops
    };
  }

  private analyzeDataFlow(): DataFlowAnalysis {
    const uninitializedVariables: string[] = [];
    const unusedVariables: string[] = [];
    const variableLifetime: VariableLifetime[] = [];
    const memoryLeaks: CodeLocation[] = [];

    const variables = new Map<string, { declared: number; lastUsed: number; initialized: boolean }>();

    this.lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      
      // Track variable assignments
      const varAssignment = trimmedLine.match(/^(\w+)\s*=\s*(.+)/);
      if (varAssignment) {
        const varName = varAssignment[1];
        variables.set(varName, {
          declared: lineNum,
          lastUsed: lineNum,
          initialized: true
        });
      }

      // Track variable usage
      variables.forEach((info, varName) => {
        if (line.includes(varName) && !line.includes(`${varName} =`)) {
          info.lastUsed = lineNum;
        }
      });

      // Check for potential memory issues with file handles
      if (trimmedLine.includes('open(') && !this.code.includes('with ') && !this.code.includes('.close()')) {
        memoryLeaks.push({
          line: lineNum,
          column: trimmedLine.indexOf('open(') + 1,
          description: 'File opened but not properly closed. Use context manager (with statement)'
        });
      }
    });

    // Analyze variable usage patterns
    variables.forEach((info, varName) => {
      if (info.lastUsed === info.declared) {
        unusedVariables.push(varName);
      }

      variableLifetime.push({
        name: varName,
        declared: info.declared,
        lastUsed: info.lastUsed,
        scope: 'local'
      });
    });

    return {
      uninitializedVariables,
      unusedVariables,
      variableLifetime,
      memoryLeaks
    };
  }

  private calculateComplexity(): ComplexityMetrics {
    let cyclomaticComplexity = 1;
    let cognitiveComplexity = 0;
    let nestingDepth = 0;
    let maxNesting = 0;
    const linesOfCode = this.lines.filter(line => line.trim().length > 0 && !line.trim().startsWith('#')).length;

    this.lines.forEach(line => {
      const trimmedLine = line.trim();
      const indentLevel = (line.length - line.trimStart().length) / 4;
      
      maxNesting = Math.max(maxNesting, indentLevel);
      
      // Count decision points
      if (trimmedLine.startsWith('if ') || 
          trimmedLine.startsWith('elif ') ||
          trimmedLine.startsWith('while ') || 
          trimmedLine.startsWith('for ') ||
          trimmedLine.includes(' and ') ||
          trimmedLine.includes(' or ') ||
          trimmedLine.startsWith('try:') ||
          trimmedLine.startsWith('except ')) {
        cyclomaticComplexity++;
        cognitiveComplexity += 1 + indentLevel;
      }
    });

    return {
      cyclomaticComplexity,
      cognitiveComplexity,
      linesOfCode,
      nestingDepth: maxNesting
    };
  }

  private analyzeQuality(): CodeQuality {
    const complexity = this.calculateComplexity();
    const issues = this.analyzeSyntax();
    
    const maintainability = Math.max(0, 100 - complexity.cyclomaticComplexity * 5 - issues.filter(i => i.severity === 'error').length * 10);
    const readability = Math.max(0, 100 - complexity.nestingDepth * 8 - issues.filter(i => i.type === 'pep8').length * 3);
    const testability = Math.max(0, 100 - complexity.cognitiveComplexity * 3);
    const performance = this.analyzePerformance();
    const security = this.analyzeSecurity();

    return {
      maintainability,
      readability,
      testability,
      performance,
      security
    };
  }

  private analyzePerformance(): number {
    let score = 100;
    
    this.lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Inefficient patterns
      if (trimmedLine.includes('range(len(')) score -= 5;
      if (trimmedLine.includes('for ') && trimmedLine.includes('+=') && trimmedLine.includes('"')) score -= 10;
      if (trimmedLine.includes('.append(') && trimmedLine.includes('for ')) score -= 8;
      if (trimmedLine.includes('list(') && trimmedLine.includes('range(')) score -= 3;
      
      // Nested loops
      const indentLevel = (line.length - line.trimStart().length) / 4;
      if ((trimmedLine.startsWith('for ') || trimmedLine.startsWith('while ')) && indentLevel > 1) {
        score -= 15;
      }
    });

    return Math.max(0, score);
  }

  private analyzeSecurity(): number {
    let score = 100;
    
    this.lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('eval(')) score -= 30;
      if (trimmedLine.includes('exec(')) score -= 30;
      if (trimmedLine.includes('input(') && !trimmedLine.includes('int(')) score -= 10;
      if (trimmedLine.includes('pickle.load')) score -= 20;
      if (trimmedLine.includes('subprocess.') && trimmedLine.includes('shell=True')) score -= 25;
      if (trimmedLine.includes('os.system(')) score -= 20;
    });

    return Math.max(0, score);
  }

  private generateSuggestions(): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const complexity = this.calculateComplexity();

    // Complexity suggestions
    if (complexity.cyclomaticComplexity > 10) {
      suggestions.push({
        line: 1,
        type: 'best-practice',
        priority: 'high',
        title: 'High Cyclomatic Complexity',
        description: 'Break down complex functions into smaller, focused functions.',
        example: 'def process_data():\n    validate_input()\n    transform_data()\n    save_results()'
      });
    }

    if (complexity.nestingDepth > 3) {
      suggestions.push({
        line: 1,
        type: 'readability',
        priority: 'medium',
        title: 'Deep Nesting',
        description: 'Reduce nesting with early returns or guard clauses.',
        example: 'if not condition:\n    return\n# Continue with main logic'
      });
    }

    // Performance suggestions
    this.lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('range(len(')) {
        suggestions.push({
          line: index + 1,
          type: 'performance',
          priority: 'medium',
          title: 'Use enumerate() instead of range(len())',
          description: 'enumerate() is more Pythonic and efficient.',
          example: 'for i, item in enumerate(items):'
        });
      }

      if (trimmedLine.includes('eval(') || trimmedLine.includes('exec(')) {
        suggestions.push({
          line: index + 1,
          type: 'security',
          priority: 'high',
          title: 'Avoid eval() and exec()',
          description: 'These functions can execute arbitrary code and pose security risks.',
          example: 'Use ast.literal_eval() for safe evaluation of literals'
        });
      }
    });

    return suggestions;
  }

  private generateExplanation(): string {
    const complexity = this.calculateComplexity();
    const issues = this.analyzeSyntax();
    const quality = this.analyzeQuality();

    let explanation = "## Python Code Analysis Summary\n\n";
    
    explanation += "### Code Structure and Organization\n";
    explanation += `This Python code consists of ${complexity.linesOfCode} lines with a cyclomatic complexity of ${complexity.cyclomaticComplexity}. `;
    
    if (complexity.cyclomaticComplexity <= 5) {
      explanation += "The code has low complexity and follows good structural practices. ";
    } else if (complexity.cyclomaticComplexity <= 10) {
      explanation += "The code has moderate complexity. Consider refactoring for better maintainability. ";
    } else {
      explanation += "The code has high complexity and would benefit from being broken into smaller functions. ";
    }

    explanation += "\n\n### PEP 8 Compliance\n";
    const pep8Issues = issues.filter(issue => issue.type === 'pep8');
    if (pep8Issues.length === 0) {
      explanation += "Excellent! The code follows PEP 8 style guidelines.\n";
    } else {
      explanation += `Found ${pep8Issues.length} PEP 8 style issue(s). Key areas for improvement:\n`;
      pep8Issues.slice(0, 3).forEach(issue => {
        explanation += `- Line ${issue.line}: ${issue.message}\n`;
      });
    }

    explanation += "\n### Performance Analysis\n";
    explanation += `**Performance Score**: ${quality.performance.toFixed(0)}/100 - `;
    if (quality.performance >= 80) {
      explanation += "Good performance characteristics with efficient algorithms.\n";
    } else if (quality.performance >= 60) {
      explanation += "Some performance optimizations possible.\n";
    } else {
      explanation += "Several performance issues identified that should be addressed.\n";
    }

    explanation += "\n### Security Assessment\n";
    explanation += `**Security Score**: ${quality.security.toFixed(0)}/100 - `;
    const securityIssues = issues.filter(issue => issue.type === 'security');
    if (securityIssues.length === 0) {
      explanation += "No obvious security vulnerabilities detected.\n";
    } else {
      explanation += `${securityIssues.length} potential security issue(s) found:\n`;
      securityIssues.forEach(issue => {
        explanation += `- Line ${issue.line}: ${issue.message}\n`;
      });
    }

    if (issues.length > 0) {
      explanation += `\n### Issues Summary\n`;
      explanation += `Total issues found: ${issues.length}\n`;
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      const infoCount = issues.filter(i => i.severity === 'info').length;
      
      if (errorCount > 0) explanation += `- Errors: ${errorCount}\n`;
      if (warningCount > 0) explanation += `- Warnings: ${warningCount}\n`;
      if (infoCount > 0) explanation += `- Info: ${infoCount}\n`;
    }

    explanation += "\n### Recommendations\n";
    const suggestions = this.generateSuggestions();
    if (suggestions.length > 0) {
      suggestions.slice(0, 3).forEach(suggestion => {
        explanation += `- **${suggestion.title}**: ${suggestion.description}\n`;
      });
    } else {
      explanation += "Great job! The code follows Python best practices.";
    }

    return explanation;
  }

  // Helper methods for Python-specific analysis
  private extractPythonCondition(line: string, keyword: string): string {
    const match = line.match(new RegExp(`${keyword}\\s+(.+?):`));
    return match ? match[1].trim() : '';
  }

  private isPythonAlwaysTrue(condition: string): boolean {
    return condition === 'True' || condition === '1' || /^\d+$/.test(condition);
  }

  private isPythonAlwaysFalse(condition: string): boolean {
    return condition === 'False' || condition === '0' || condition === 'None' || condition === '[]' || condition === '{}';
  }

  private findPythonEdgeCases(condition: string): string[] {
    const edgeCases: string[] = [];
    
    if (condition.includes('==') || condition.includes('!=')) {
      edgeCases.push('equality comparison');
    }
    if (condition.includes('and') || condition.includes('or')) {
      edgeCases.push('complex boolean logic');
    }
    if (condition.includes('len(')) {
      edgeCases.push('empty collection check');
    }
    if (condition.includes('in ')) {
      edgeCases.push('membership test');
    }
    
    return edgeCases;
  }

  private analyzePythonLoopIssues(condition: string, type: string): string[] {
    const issues: string[] = [];
    
    if (type === 'while' && (condition === 'True' || condition === '1')) {
      issues.push('potential infinite loop');
    }
    if (condition.includes('len(') && condition.includes('range(')) {
      issues.push('inefficient iteration pattern');
    }
    
    return issues;
  }
}
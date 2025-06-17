 /**
 * Python Code Analysis System
 * This module provides comprehensive analysis of Python code, including:
 * - Syntax checking and PEP 8 compliance
 * - Code quality metrics
 * - Control flow analysis
 * - Data flow analysis
 * - Performance optimization suggestions
 * - Security vulnerability detection
 */

import { AnalysisResult, SyntaxIssue, LogicalAnalysis, CodeQuality, Suggestion, ControlFlowAnalysis, DataFlowAnalysis, ComplexityMetrics, BranchInfo, LoopInfo, VariableLifetime, CodeLocation, CodeOutput } from '../types/analyzer';

/**
 * PythonAnalyzer class
 * Performs static analysis on Python source code to provide insights and recommendations
 */
export class PythonAnalyzer {
  private code: string;       // The complete Python source code to analyze
  private lines: string[];    // The code split into individual lines for line-by-line analysis

  /**
   * Creates a new PythonAnalyzer instance
   * @param code - The Python source code to analyze
   */
  constructor(code: string) {
    this.code = code;
    this.lines = code.split('\n');
  }

  /**
   * Main analysis method that coordinates all analysis tasks
   * @returns A complete analysis result containing all insights and recommendations
   * @throws Error if the provided code is not recognized as Python
   */
  analyze(): AnalysisResult {
    // Verify the code is Python before proceeding
    if (!this.isPythonCode()) {
      throw new Error("I can only analyze Python code.");
    }

    // Perform various analyses and collect results
    const syntaxIssues = this.analyzeSyntax();
    const logicalAnalysis = this.analyzeLogic();
    const codeQuality = this.analyzeQuality();
    const suggestions = this.generateSuggestions();
    const explanation = this.generateExplanation();
    const codeOutput = this.analyzeCodeOutput();

    return {
      syntaxIssues,
      logicalAnalysis,
      codeQuality,
      suggestions,
      explanation,
      codeOutput
    };
  }

  /**
   * Analyzes potential code output by simulating execution
   * Handles print statements, expressions, and potential runtime issues
   * @returns CodeOutput object containing predicted output and execution details
   */
  private analyzeCodeOutput(): CodeOutput {
    const startTime = performance.now();
    let output = '';
    let errors: string[] = [];
    let warnings: string[] = [];
    let canExecute = true;
    let hasOutput = false;

    try {
      // Check if code has syntax errors that would prevent execution
      const syntaxIssues = this.analyzeSyntax();
      const criticalErrors = syntaxIssues.filter(issue => issue.severity === 'error');
      
      if (criticalErrors.length > 0) {
        canExecute = false;
        errors = criticalErrors.map(error => `Line ${error.line}: ${error.message}`);
        return {
          hasOutput: false,
          output: '',
          errors,
          executionTime: 0,
          canExecute: false,
          warnings: []
        };
      }

      // Simulate code execution and predict output
      output = this.simulateCodeExecution();
      hasOutput = output.length > 0;

      // Add warnings for potentially problematic code
      if (this.code.includes('input(')) {
        warnings.push('Code contains input() calls - interactive input required');
      }
      if (this.code.includes('time.sleep(')) {
        warnings.push('Code contains sleep() calls - execution may be delayed');
      }
      if (this.code.includes('random.')) {
        warnings.push('Code uses random functions - output may vary between runs');
      }
      if (this.code.includes('open(')) {
        warnings.push('Code performs file operations - ensure files exist');
      }

    } catch (error) {
      canExecute = false;
      errors.push(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      hasOutput,
      output,
      errors,
      executionTime,
      canExecute,
      warnings
    };
  }

  /**
   * Simulates the execution of Python code to predict output
   * Focuses on print statements and expression evaluation
   * @returns Predicted output as a string
   */
  private simulateCodeExecution(): string {
    const outputLines: string[] = [];

    // Look for print statements and simulate their output
    this.lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle print statements
      if (trimmedLine.includes('print(')) {
        const printMatch = trimmedLine.match(/print\s*\(\s*(.+?)\s*\)/);
        if (printMatch) {
          const printContent = printMatch[1];
          const simulatedValue = this.simulatePrintOutput(printContent, index);
          if (simulatedValue !== null) {
            outputLines.push(simulatedValue);
          }
        }
      }
    });

    // Look for expressions that would produce output
    const lastLine = this.lines[this.lines.length - 1]?.trim();
    if (lastLine && !lastLine.startsWith('#') && !lastLine.includes('print(') && 
        !lastLine.includes('=') && !lastLine.startsWith('def ') && 
        !lastLine.startsWith('class ') && !lastLine.startsWith('if ') &&
        !lastLine.startsWith('for ') && !lastLine.startsWith('while ')) {
      
      // This might be an expression that would output a value
      const simulatedValue = this.simulateExpression(lastLine);
      if (simulatedValue !== null) {
        outputLines.push(simulatedValue);
      }
    }

    return outputLines.join('\n');
  }

  /**
   * Simulates the output of a print statement
   * @param content - The content inside print()
   * @param lineIndex - Line number of the print statement
   * @returns Simulated output or null if simulation not possible
   */
  private simulatePrintOutput(content: string, lineIndex: number): string | null {
    try {
      // Handle f-strings
      if (content.startsWith('f"') || content.startsWith("f'")) {
        return this.simulateFString(content);
      }

      // Handle simple string literals
      if ((content.startsWith('"') && content.endsWith('"')) || 
          (content.startsWith("'") && content.endsWith("'"))) {
        return content.slice(1, -1);
      }

      // Handle variables and expressions
      if (content.includes('+') || content.includes('*') || content.includes('/')) {
        return this.simulateExpression(content);
      }

      // Handle function calls
      if (content.includes('(') && content.includes(')')) {
        return this.simulateFunctionCall(content);
      }

      // Handle simple variables
      const variableValue = this.getVariableValue(content, lineIndex);
      if (variableValue !== null) {
        return variableValue;
      }

      return `<${content}>`;
    } catch {
      return `<${content}>`;
    }
  }

  /**
   * Processes and simulates f-string interpolation
   * @param fstring - The f-string to process
   * @returns Simulated interpolated string
   */
  private simulateFString(fstring: string): string {
    // Remove f" or f' prefix and ending quote
    let content = fstring.slice(2, -1);
    
    // Replace simple variable interpolations
    content = content.replace(/\{(\w+)\}/g, (_, varName) => {
      return `<${varName}>`;
    });

    // Replace method calls in f-strings
    content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
      if (expr.includes('.')) {
        return `<${expr}>`;
      }
      return match;
    });

    return content;
  }

  /**
   * Evaluates simple Python expressions
   * @param expr - The expression to evaluate
   * @returns Result of the expression or placeholder if can't evaluate
   */
  private simulateExpression(expr: string): string {
    // Handle simple arithmetic
    const numberPattern = /^\d+(\.\d+)?\s*[+\-*/]\s*\d+(\.\d+)?$/;
    if (numberPattern.test(expr.trim())) {
      try {
        // Simple arithmetic evaluation (safe)
        const result = Function(`"use strict"; return (${expr})`)();
        return result.toString();
      } catch {
        return `<${expr}>`;
      }
    }

    return `<${expr}>`;
  }

  /**
   * Simulates common Python function calls
   * @param call - The function call to simulate
   * @returns Expected output of the function call
   */
  private simulateFunctionCall(call: string): string {
    // Handle common function calls
    if (call.includes('len(')) {
      return '<length>';
    }
    if (call.includes('str(')) {
      return '<string>';
    }
    if (call.includes('int(')) {
      return '<integer>';
    }
    if (call.includes('range(')) {
      const rangeMatch = call.match(/range\((\d+)\)/);
      if (rangeMatch) {
        const num = parseInt(rangeMatch[1]);
        if (num <= 10) {
          return `range(0, ${num})`;
        }
      }
      return '<range object>';
    }

    return `<${call}>`;
  }

  /**
   * Attempts to determine a variable's value by looking at previous assignments
   * @param varName - The variable name to look up
   * @param currentLine - The current line number
   * @returns The variable's value or null if not found
   */
  private getVariableValue(varName: string, currentLine: number): string | null {
    // Look backwards for variable assignments
    for (let i = currentLine - 1; i >= 0; i--) {
      const line = this.lines[i].trim();
      const assignment = line.match(new RegExp(`^${varName}\\s*=\\s*(.+)`));
      if (assignment) {
        const value = assignment[1];
        
        // Handle string literals
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          return value.slice(1, -1);
        }
        
        // Handle numbers
        if (/^\d+(\.\d+)?$/.test(value)) {
          return value;
        }
        
        // Handle lists
        if (value.startsWith('[') && value.endsWith(']')) {
          return value;
        }
        
        // Handle dictionaries
        if (value.startsWith('{') && value.endsWith('}')) {
          return value;
        }
        
        return `<${value}>`;
      }
    }
    
    return null;
  }

  /**
   * Checks if the provided code appears to be Python
   * Looks for Python-specific keywords, patterns, and syntax
   * @returns true if code appears to be Python
   */
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

  /**
   * Performs detailed syntax analysis
   * Checks for:
   * - PEP 8 compliance
   * - Naming conventions
   * - Security issues
   * - Best practices
   * - Code style
   * @returns Array of syntax issues found
   */
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

  /**
   * Analyzes code logic including control flow and data flow
   * @returns Comprehensive logical analysis results
   */
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

  /**
   * Analyzes control flow including:
   * - Conditional branches
   * - Loops
   * - Unreachable code
   * - Potential infinite loops
   * @returns Control flow analysis results
   */
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

  /**
   * Analyzes data flow including:
   * - Variable initialization
   * - Variable usage
   * - Memory leaks
   * - Resource management
   * @returns Data flow analysis results
   */
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

  /**
   * Calculates complexity metrics including:
   * - Cyclomatic complexity
   * - Cognitive complexity
   * - Lines of code
   * - Maximum nesting depth
   * @returns Complexity metrics
   */
  private calculateComplexity(): ComplexityMetrics {
    let cyclomaticComplexity = 1;
    let cognitiveComplexity = 0;

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

  /**
   * Analyzes overall code quality
   * Combines multiple metrics to assess:
   * - Maintainability
   * - Readability
   * - Testability
   * - Performance
   * - Security
   * @returns Code quality metrics
   */
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

  /**
   * Analyzes code for performance issues
   * Looks for patterns that might impact performance
   * @returns Performance score (0-100)
   */
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

  /**
   * Analyzes code for security vulnerabilities
   * Checks for common security issues in Python code
   * @returns Security score (0-100)
   */
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

  /**
   * Generates actionable suggestions for code improvement
   * Based on all analysis results
   * @returns Array of suggestions with examples
   */
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
          type: "optimization",
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

  /**
   * Generates a detailed explanation of the analysis results
   * Includes summaries of:
   * - Code structure
   * - PEP 8 compliance
   * - Performance analysis
   * - Security assessment
   * - Issues and recommendations
   * @returns Formatted explanation string with markdown-style formatting
   */
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

  /**
   * Extracts condition from Python control statements
   */
  private extractPythonCondition(line: string, keyword: string): string {
    const match = line.match(new RegExp(`${keyword}\\s+(.+?):`));
    return match ? match[1].trim() : '';
  }

  /**
   * Checks if a Python condition is always true
   */
  private isPythonAlwaysTrue(condition: string): boolean {
    return condition === 'True' || condition === '1' || /^\d+$/.test(condition);
  }

  /**
   * Checks if a Python condition is always false
   */
  private isPythonAlwaysFalse(condition: string): boolean {
    return condition === 'False' || condition === '0' || condition === 'None' || condition === '[]' || condition === '{}';
  }

  /**
   * Identifies potential edge cases in conditional logic
   */
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

  /**
   * Analyzes loops for potential issues
   */
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
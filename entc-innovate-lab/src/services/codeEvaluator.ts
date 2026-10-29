import { TestCase } from '../types';

export interface EvaluationResult {
  allPassed: boolean;
  testCases: TestCase[];
  error?: string;
}

export function evaluateStudentCode(
  functionName: string,
  userCode: string,
  testCases: TestCase[]
): EvaluationResult {
  try {
    // 1. Basic security check: disallow dangerous browser APIs
    const blacklisted = [
      'window',
      'document',
      'localStorage',
      'sessionStorage',
      'fetch',
      'XMLHttpRequest',
      'eval',
      'Function',
      'importScripts',
      'indexedDB'
    ];

    for (const keyword of blacklisted) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(userCode)) {
        return {
          allPassed: false,
          testCases,
          error: `Security Alert: Access to '${keyword}' is strictly restricted in the challenge sandbox.`
        };
      }
    }

    // 2. Safe isolated execution scope
    // Wrap student function inside an isolated closure and extract the target function
    const wrappedFactory = new Function(`
      "use strict";
      ${userCode}
      if (typeof ${functionName} !== 'function') {
        throw new Error("Function '${functionName}' is not defined. Please check your function name.");
      }
      return ${functionName};
    `);

    const targetFn = wrappedFactory();

    // 3. Run each test case through targetFn
    const evaluatedCases: TestCase[] = testCases.map(tc => {
      try {
        const inputClone = JSON.parse(JSON.stringify(tc.input));
        const actual = targetFn(...inputClone);
        
        // Deep equality check
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);

        return {
          ...tc,
          actual,
          passed,
          log: passed ? 'Passed verification' : `Expected ${JSON.stringify(tc.expected)}, but received ${JSON.stringify(actual)}`
        };
      } catch (err: any) {
        return {
          ...tc,
          actual: 'Runtime Error',
          passed: false,
          log: err?.message || 'Error executing test case'
        };
      }
    });

    const allPassed = evaluatedCases.every(tc => tc.passed);

    return {
      allPassed,
      testCases: evaluatedCases
    };
  } catch (syntaxOrExecErr: any) {
    return {
      allPassed: false,
      testCases,
      error: syntaxOrExecErr?.message || 'Syntax Error in submitted code.'
    };
  }
}

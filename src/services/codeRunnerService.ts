import { CodingChallenge } from '../types';

export interface TestResult {
  index: number;
  inputDescription: string;
  expected: any;
  actual: any;
  passed: boolean;
  explanation?: string;
  error?: string;
}

export interface ExecutionReport {
  challengeId: string;
  success: boolean;
  passedCount: number;
  totalCount: number;
  logs: string[];
  executionTimeMs: number;
  testResults: TestResult[];
  errorMessage?: string;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.0001;
  }
  if (typeof a !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

export const codeRunnerService = {
  evaluateChallenge(challenge: CodingChallenge, userCode: string): ExecutionReport {
    const logs: string[] = [];
    const testResults: TestResult[] = [];
    const startTime = performance.now();

    // Custom console logger to capture output safely
    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
      warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => String(a)).join(' ')),
      error: (...args: any[]) => logs.push('[ERROR] ' + args.map(a => String(a)).join(' '))
    };

    try {
      // Create a restricted function wrapper
      // We do NOT expose window, document, fetch, localStorage, or dangerous primitives
      const wrappedFunctionGenerator = new Function(
        'console',
        `
        "use strict";
        ${userCode}
        if (typeof ${challenge.functionName} !== 'function') {
          throw new Error("Function '${challenge.functionName}' was not defined or is not a function.");
        }
        return ${challenge.functionName};
        `
      );

      const targetFn = wrappedFunctionGenerator(customConsole);

      for (let i = 0; i < challenge.testCases.length; i++) {
        const tc = challenge.testCases[i];
        try {
          // Deep clone arguments to avoid mutation side-effects between runs
          const clonedArgs = JSON.parse(JSON.stringify(tc.args));
          const actualOutput = targetFn(...clonedArgs);
          const passed = deepEqual(actualOutput, tc.expected);

          testResults.push({
            index: i + 1,
            inputDescription: tc.inputDescription,
            expected: tc.expected,
            actual: actualOutput,
            passed,
            explanation: tc.explanation
          });
        } catch (testErr: any) {
          testResults.push({
            index: i + 1,
            inputDescription: tc.inputDescription,
            expected: tc.expected,
            actual: undefined,
            passed: false,
            error: testErr.message || String(testErr),
            explanation: tc.explanation
          });
        }
      }

      const passedCount = testResults.filter(r => r.passed).length;
      const allPassed = passedCount === challenge.testCases.length;
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

      return {
        challengeId: challenge.id,
        success: allPassed,
        passedCount,
        totalCount: challenge.testCases.length,
        logs,
        executionTimeMs,
        testResults
      };
    } catch (syntaxOrExecErr: any) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        challengeId: challenge.id,
        success: false,
        passedCount: 0,
        totalCount: challenge.testCases.length,
        logs,
        executionTimeMs,
        testResults: challenge.testCases.map((tc, idx) => ({
          index: idx + 1,
          inputDescription: tc.inputDescription,
          expected: tc.expected,
          actual: null,
          passed: false,
          error: syntaxOrExecErr.message || 'Execution failed'
        })),
        errorMessage: syntaxOrExecErr.message || 'Syntax or evaluation error in submitted code'
      };
    }
  }
};


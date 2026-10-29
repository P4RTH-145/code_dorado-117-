export interface TestCaseResult {
  inputDescription: string;
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
}

export interface ExecutionResult {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  testResults: TestCaseResult[];
  logs: string[];
  executionTimeMs: number;
  compileError?: string;
}

export function executeCodeSafely(
  code: string,
  functionName: string,
  testCases: { inputDescription: string; args: any[]; expected: any }[]
): ExecutionResult {
  const startTime = performance.now();
  const logs: string[] = [];

  const originalConsoleLog = console.log;
  const customLog = (...args: any[]) => {
    logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };

  try {
    // Intercept console.log during evaluation
    const sandboxScope = {
      Math,
      Number,
      String,
      Boolean,
      Array,
      Object,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      console: { log: customLog, warn: customLog, info: customLog }
    };

    // Safely construct function from code
    const wrappedCode = `
      "use strict";
      ${code}
      if (typeof ${functionName} !== 'function') {
        throw new Error('Function "${functionName}" is not defined or is not a function.');
      }
      return ${functionName};
    `;

    // Execute within Function sandbox scope
    const evaluator = new Function(...Object.keys(sandboxScope), wrappedCode);
    const userFunction = evaluator(...Object.values(sandboxScope));

    const testResults: TestCaseResult[] = [];
    let passedCount = 0;

    for (const tc of testCases) {
      try {
        // Deep clone args to avoid side effects
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const actual = userFunction(...clonedArgs);

        const passed = deepEqual(actual, tc.expected);
        if (passed) passedCount++;

        testResults.push({
          inputDescription: tc.inputDescription,
          expected: tc.expected,
          actual,
          passed
        });
      } catch (runErr: any) {
        testResults.push({
          inputDescription: tc.inputDescription,
          expected: tc.expected,
          actual: undefined,
          passed: false,
          error: runErr?.message || String(runErr)
        });
      }
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      allPassed: passedCount === testCases.length,
      passedCount,
      totalCount: testCases.length,
      testResults,
      logs,
      executionTimeMs
    };
  } catch (compileErr: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      testResults: [],
      logs,
      executionTimeMs,
      compileError: compileErr?.message || String(compileErr)
    };
  } finally {
    console.log = originalConsoleLog;
  }
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.0001;
  }
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}

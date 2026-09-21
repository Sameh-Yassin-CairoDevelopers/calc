import { AngleMode } from '../types';

/**
 * Robust mathematical expression parser & evaluator.
 * Does not use eval(). Uses recursive descent with operator precedence.
 */

// Format numbers nicely avoiding floating point precision glitches like 0.1 + 0.2 = 0.30000000000000004
export function formatNumber(val: number): string {
  if (isNaN(val)) return 'Error';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  // If very large or very close to zero (and not zero), format using exponential
  const absVal = Math.abs(val);
  if ((absVal >= 1e12 || (absVal < 1e-7 && absVal > 0)) && !Number.isInteger(val)) {
    return parseFloat(val.toPrecision(8)).toExponential();
  }

  // Handle standard decimal rounding to 10 significant digits
  const rounded = Number(Math.round(Number(`${val}e10`)) + 'e-10');
  // Avoid negative zero
  if (Object.is(rounded, -0)) return '0';
  return rounded.toString();
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial input');
  if (n > 170) throw new Error('Overflow'); // 171! > Number.MAX_VALUE
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): number {
  // Normalize symbols
  let cleaned = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `${Math.PI}`)
    .replace(/\be\b/g, `${Math.E}`);

  // Implicit multiplication: e.g. 5(2) -> 5*(2), (2)(3) -> (2)*(3), 5sin(30) -> 5*sin(30)
  cleaned = cleaned.replace(/(\d)\s*\(/g, '$1*(');
  cleaned = cleaned.replace(/\)\s*(\d)/g, ')*$1');
  cleaned = cleaned.replace(/\)\s*\(/g, ')*(');
  cleaned = cleaned.replace(/(\d)\s*(sin|cos|tan|asin|acos|atan|ln|log|sqrt|cbrt|abs)/g, '$1*$2');

  let pos = 0;
  const len = cleaned.length;

  function peek(): string {
    while (pos < len && cleaned[pos] === ' ') pos++;
    return pos < len ? cleaned[pos] : '';
  }

  function get(): string {
    while (pos < len && cleaned[pos] === ' ') pos++;
    return pos < len ? cleaned[pos++] : '';
  }

  function parseExpression(): number {
    let result = parseTerm();
    while (true) {
      const nextChar = peek();
      if (nextChar === '+') {
        get();
        result += parseTerm();
      } else if (nextChar === '-') {
        get();
        result -= parseTerm();
      } else {
        break;
      }
    }
    return result;
  }

  function parseTerm(): number {
    let result = parseFactor();
    while (true) {
      const nextChar = peek();
      if (nextChar === '*') {
        get();
        result *= parseFactor();
      } else if (nextChar === '/') {
        get();
        const divisor = parseFactor();
        if (divisor === 0) throw new Error('Division by zero');
        result /= divisor;
      } else if (nextChar === '%') {
        get();
        result = result / 100;
      } else {
        break;
      }
    }
    return result;
  }

  function parseFactor(): number {
    let base = parsePrimary();
    while (peek() === '^') {
      get();
      const exponent = parsePrimary();
      base = Math.pow(base, exponent);
    }
    return base;
  }

  function parsePrimary(): number {
    const nextChar = peek();

    // Unary plus or minus
    if (nextChar === '-') {
      get();
      return -parsePrimary();
    }
    if (nextChar === '+') {
      get();
      return parsePrimary();
    }

    // Parentheses
    if (nextChar === '(') {
      get();
      const val = parseExpression();
      if (get() !== ')') {
        throw new Error('Mismatched parentheses');
      }
      // Check for postfix factorial, e.g. (3+2)!
      if (peek() === '!') {
        get();
        return factorial(val);
      }
      return val;
    }

    // Functions or Numbers
    if (/[a-zA-Z]/.test(nextChar)) {
      let funcName = '';
      while (pos < len && /[a-zA-Z0-9]/.test(cleaned[pos])) {
        funcName += cleaned[pos++];
      }
      if (peek() !== '(') {
        throw new Error(`Expected ( after ${funcName}`);
      }
      get(); // consume '('
      const arg = parseExpression();
      if (get() !== ')') {
        throw new Error(`Expected ) for ${funcName}`);
      }

      let res: number;
      switch (funcName.toLowerCase()) {
        case 'sin': {
          const rad = angleMode === 'DEG' ? (arg * Math.PI) / 180 : arg;
          res = Math.sin(rad);
          break;
        }
        case 'cos': {
          const rad = angleMode === 'DEG' ? (arg * Math.PI) / 180 : arg;
          res = Math.cos(rad);
          break;
        }
        case 'tan': {
          const rad = angleMode === 'DEG' ? (arg * Math.PI) / 180 : arg;
          // Check for asymptote (cos = 0)
          if (Math.abs(Math.cos(rad)) < 1e-12) throw new Error('Undefined (asymptote)');
          res = Math.tan(rad);
          break;
        }
        case 'asin': {
          if (arg < -1 || arg > 1) throw new Error('Invalid domain for asin');
          const rad = Math.asin(arg);
          res = angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
          break;
        }
        case 'acos': {
          if (arg < -1 || arg > 1) throw new Error('Invalid domain for acos');
          const rad = Math.acos(arg);
          res = angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
          break;
        }
        case 'atan': {
          const rad = Math.atan(arg);
          res = angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
          break;
        }
        case 'ln':
          if (arg <= 0) throw new Error('Invalid domain for ln');
          res = Math.log(arg);
          break;
        case 'log':
          if (arg <= 0) throw new Error('Invalid domain for log');
          res = Math.log10(arg);
          break;
        case 'sqrt':
          if (arg < 0) throw new Error('Invalid domain for sqrt');
          res = Math.sqrt(arg);
          break;
        case 'cbrt':
          res = Math.cbrt(arg);
          break;
        case 'abs':
          res = Math.abs(arg);
          break;
        case 'exp':
          res = Math.exp(arg);
          break;
        default:
          throw new Error(`Unknown function: ${funcName}`);
      }

      if (peek() === '!') {
        get();
        return factorial(res);
      }
      return res;
    }

    // Number literal
    let numStr = '';
    while (pos < len && (/[0-9.]/.test(cleaned[pos]))) {
      numStr += cleaned[pos++];
    }

    if (numStr === '') {
      throw new Error('Unexpected character');
    }

    let val = parseFloat(numStr);
    if (isNaN(val)) throw new Error('Invalid number');

    // Postfix factorial, e.g. 5!
    if (peek() === '!') {
      get();
      val = factorial(val);
    }

    return val;
  }

  const ans = parseExpression();
  if (pos < len) {
    throw new Error('Unexpected tokens at end of expression');
  }

  return ans;
}

export function safeEvaluate(expr: string, angleMode: AngleMode = 'DEG'): { result: string | null; error: string | null } {
  if (!expr.trim()) {
    return { result: null, error: null };
  }
  try {
    const numericResult = evaluateExpression(expr, angleMode);
    return { result: formatNumber(numericResult), error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return { result: null, error: msg };
  }
}

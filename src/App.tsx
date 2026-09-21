/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  History,
  Keyboard,
  Sun,
  Moon,
  Calculator as CalcIcon,
} from 'lucide-react';
import { AngleMode, CalculatorMode, HistoryItem } from './types';
import { safeEvaluate } from './utils/calculatorEngine';
import { playClickSound } from './utils/sound';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryPanel } from './components/HistoryPanel';
import { ShortcutsModal } from './components/ShortcutsModal';

const HISTORY_STORAGE_KEY = 'calculator_history_v1';
const SOUND_STORAGE_KEY = 'calculator_sound_v1';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [evaluatedResult, setEvaluatedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [memoryValue, setMemoryValue] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Load history & preferences from localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const soundPref = localStorage.getItem(SOUND_STORAGE_KEY);
      if (soundPref !== null) {
        setSoundEnabled(soundPref === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save history updates
  const saveHistory = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const triggerSound = useCallback(
    (type: 'number' | 'operator' | 'function' | 'equals' | 'action') => {
      if (soundEnabled) {
        playClickSound(type);
      }
    },
    [soundEnabled]
  );

  // Live preview evaluation as the expression changes
  useEffect(() => {
    if (!expression.trim()) {
      setEvaluatedResult(null);
      setError(null);
      return;
    }

    if (hasCalculated) return;

    // Check if expression looks complete enough to preview
    const trimmed = expression.trim();
    const lastChar = trimmed[trimmed.length - 1];
    if (['+', '−', '×', '÷', '*', '/', '^', '('].includes(lastChar)) {
      return;
    }

    const preview = safeEvaluate(expression, angleMode);
    if (preview.result && !preview.error) {
      setEvaluatedResult(preview.result);
      setError(null);
    }
  }, [expression, angleMode, hasCalculated]);

  // Input Handlers
  const handleNumber = useCallback(
    (num: string) => {
      triggerSound('number');
      setError(null);

      if (hasCalculated) {
        setExpression(num === '.' ? '0.' : num);
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => {
        if (num === '.') {
          // Check last number segment to prevent duplicate dots
          const segments = prev.split(/[\+\−\×\÷\*\/\^\(\)]/);
          const currentSeg = segments[segments.length - 1] || '';
          if (currentSeg.includes('.')) return prev;
          if (currentSeg === '' || prev === '') return prev + '0.';
        }
        return prev + num;
      });
    },
    [hasCalculated, triggerSound]
  );

  const handleOperator = useCallback(
    (op: string) => {
      triggerSound('operator');
      setError(null);

      if (hasCalculated && evaluatedResult) {
        setExpression(evaluatedResult + ' ' + op + ' ');
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => {
        const trimmed = prev.trim();
        if (!trimmed) {
          if (op === '−') return '−';
          return prev;
        }

        // If ends with an operator, replace it
        if (/[\+\−\×\÷\^\%]$/.test(trimmed)) {
          return trimmed.slice(0, -1).trim() + ' ' + op + ' ';
        }

        return trimmed + ' ' + op + ' ';
      });
    },
    [hasCalculated, evaluatedResult, triggerSound]
  );

  const handleFunction = useCallback(
    (func: string) => {
      triggerSound('function');
      setError(null);

      if (hasCalculated && evaluatedResult) {
        setExpression(`${func}(${evaluatedResult})`);
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => prev + `${func}(`);
    },
    [hasCalculated, evaluatedResult, triggerSound]
  );

  const handleConstant = useCallback(
    (c: string) => {
      triggerSound('number');
      setError(null);

      if (hasCalculated) {
        setExpression(c);
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => prev + c);
    },
    [hasCalculated, triggerSound]
  );

  const handleParenthesis = useCallback(
    (p: string) => {
      triggerSound('operator');
      setError(null);

      if (hasCalculated) {
        setExpression(p);
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => prev + p);
    },
    [hasCalculated, triggerSound]
  );

  const handlePercentage = useCallback(() => {
    triggerSound('operator');
    setError(null);
    setExpression((prev) => (prev ? prev + '%' : prev));
  }, [triggerSound]);

  const handleToggleSign = useCallback(() => {
    triggerSound('operator');
    setError(null);

    if (hasCalculated && evaluatedResult) {
      const num = parseFloat(evaluatedResult);
      if (!isNaN(num)) {
        const toggled = (-num).toString();
        setExpression(toggled);
        setEvaluatedResult(toggled);
        return;
      }
    }

    setExpression((prev) => {
      if (!prev) return '−';
      if (prev.startsWith('−')) return prev.slice(1);
      return '−' + prev;
    });
  }, [hasCalculated, evaluatedResult, triggerSound]);

  const handleClear = useCallback(() => {
    triggerSound('action');
    setExpression('');
    setEvaluatedResult(null);
    setError(null);
    setHasCalculated(false);
  }, [triggerSound]);

  const handleBackspace = useCallback(() => {
    triggerSound('action');
    setError(null);

    if (hasCalculated) {
      handleClear();
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      // Check if ending with a function like 'sin('
      const funcMatch = prev.match(/(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs)\($/);
      if (funcMatch) {
        return prev.slice(0, -funcMatch[0].length);
      }
      // Check if ending with a spaced operator ' + '
      if (/\s[\+\−\×\÷\^]\s$/.test(prev)) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1);
    });
  }, [hasCalculated, handleClear, triggerSound]);

  const handleEquals = useCallback(() => {
    triggerSound('equals');
    if (!expression.trim()) return;

    const evaluation = safeEvaluate(expression, angleMode);
    if (evaluation.error) {
      setError(evaluation.error);
      return;
    }

    if (evaluation.result !== null) {
      setEvaluatedResult(evaluation.result);
      setHasCalculated(true);
      setError(null);

      // Add to history tape
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression: expression.trim(),
        result: evaluation.result,
        timestamp: Date.now(),
      };
      saveHistory([newItem, ...history]);
    }
  }, [expression, angleMode, history, saveHistory, triggerSound]);

  // Memory Functions
  const handleMemoryClear = useCallback(() => {
    triggerSound('action');
    setMemoryValue(null);
  }, [triggerSound]);

  const handleMemoryRecall = useCallback(() => {
    triggerSound('number');
    if (memoryValue !== null) {
      const valStr = memoryValue.toString();
      if (hasCalculated) {
        setExpression(valStr);
        setHasCalculated(false);
      } else {
        setExpression((prev) => prev + valStr);
      }
    }
  }, [memoryValue, hasCalculated, triggerSound]);

  const handleMemoryAdd = useCallback(() => {
    triggerSound('action');
    const target = evaluatedResult || expression;
    const evaluated = safeEvaluate(target, angleMode);
    if (evaluated.result) {
      const num = parseFloat(evaluated.result);
      if (!isNaN(num)) {
        setMemoryValue((prev) => (prev !== null ? prev + num : num));
      }
    }
  }, [evaluatedResult, expression, angleMode, triggerSound]);

  const handleMemorySubtract = useCallback(() => {
    triggerSound('action');
    const target = evaluatedResult || expression;
    const evaluated = safeEvaluate(target, angleMode);
    if (evaluated.result) {
      const num = parseFloat(evaluated.result);
      if (!isNaN(num)) {
        setMemoryValue((prev) => (prev !== null ? prev - num : -num));
      }
    }
  }, [evaluatedResult, expression, angleMode, triggerSound]);

  // Copy Result to Clipboard
  const handleCopy = useCallback(() => {
    const textToCopy = evaluatedResult || expression || '0';
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [evaluatedResult, expression]);

  // Toggle Sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumber(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleNumber('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('−');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleFunction('sin');
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleFunction('tan');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleConstant('π');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleOperator,
    handleFunction,
    handleConstant,
    handleParenthesis,
    handlePercentage,
    handleEquals,
    handleBackspace,
    handleClear,
  ]);

  return (
    <div
      id="calculator-root"
      className={`min-h-screen w-full flex items-center justify-center p-3 sm:p-6 transition-colors ${
        isLightMode ? 'bg-stone-100 text-stone-900' : 'bg-stone-950 text-stone-100'
      }`}
    >
      <main
        id="calculator-card"
        className={`relative w-full max-w-md md:max-w-lg rounded-3xl p-4 sm:p-6 shadow-2xl border transition-all ${
          isLightMode
            ? 'bg-white border-stone-200 shadow-stone-300/40'
            : 'bg-stone-925 bg-stone-900/90 border-stone-800/80 shadow-black/60 backdrop-blur-xl'
        }`}
      >
        {/* Top Control Bar */}
        <header className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalcIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">Calculator</h1>
              <p className="text-[11px] text-stone-400">Standard & Scientific</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode Switcher (Standard / Scientific) */}
            <div className="flex bg-stone-800/90 p-1 rounded-xl border border-stone-700/60 text-xs font-medium mr-1">
              <button
                type="button"
                id="mode-toggle-standard"
                onClick={() => setMode('standard')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  mode === 'standard'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Basic
              </button>
              <button
                type="button"
                id="mode-toggle-scientific"
                onClick={() => setMode('scientific')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  mode === 'scientific'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Sci
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              id="sound-toggle"
              onClick={toggleSound}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors"
              title={soundEnabled ? 'Mute click sounds' : 'Enable click sounds'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* History Toggle */}
            <button
              type="button"
              id="history-toggle"
              onClick={() => setHistoryOpen(true)}
              className="relative p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors"
              title="View calculation history"
              aria-label="History"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Shortcuts Guide */}
            <button
              type="button"
              id="shortcuts-toggle"
              onClick={() => setShortcutsOpen(true)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors hidden sm:inline-flex"
              title="View keyboard shortcuts"
              aria-label="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              id="theme-toggle"
              onClick={() => setIsLightMode((prev) => !prev)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors"
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Display Output */}
        <Display
          expression={expression}
          evaluatedResult={evaluatedResult}
          error={error}
          hasCalculated={hasCalculated}
          angleMode={angleMode}
          onToggleAngleMode={() =>
            setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))
          }
          memoryValue={memoryValue}
          onBackspace={handleBackspace}
          onCopy={handleCopy}
          copied={copied}
        />

        {/* Keypad */}
        <Keypad
          mode={mode}
          onNumber={handleNumber}
          onOperator={handleOperator}
          onFunction={handleFunction}
          onConstant={handleConstant}
          onParenthesis={handleParenthesis}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onEquals={handleEquals}
          onToggleSign={handleToggleSign}
          onMemoryClear={handleMemoryClear}
          onMemoryRecall={handleMemoryRecall}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
          onPercentage={handlePercentage}
        />

        {/* Calculation History Drawer */}
        <HistoryPanel
          isOpen={historyOpen}
          history={history}
          onClose={() => setHistoryOpen(false)}
          onClearHistory={() => saveHistory([])}
          onSelectHistoryItem={(item) => {
            setExpression(item.expression);
            setEvaluatedResult(item.result);
            setHasCalculated(true);
            setHistoryOpen(false);
          }}
        />

        {/* Keyboard Shortcuts Dialog */}
        <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      </main>
    </div>
  );
}

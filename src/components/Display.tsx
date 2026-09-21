import React, { useRef, useEffect } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { AngleMode } from '../types';

interface DisplayProps {
  expression: string;
  evaluatedResult: string | null;
  error: string | null;
  hasCalculated: boolean;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  memoryValue: number | null;
  onBackspace: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  evaluatedResult,
  error,
  hasCalculated,
  angleMode,
  onToggleAngleMode,
  memoryValue,
  onBackspace,
  onCopy,
  copied,
}) => {
  const expressionEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression into view when typing
  useEffect(() => {
    if (expressionEndRef.current) {
      expressionEndRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }
  }, [expression]);

  return (
    <div
      id="calculator-display-container"
      className="relative flex flex-col justify-end p-5 rounded-2xl bg-stone-900/90 text-stone-100 border border-stone-800 shadow-inner overflow-hidden min-h-[160px] select-text"
    >
      {/* Top Header Indicators */}
      <div className="flex items-center justify-between text-xs text-stone-400 mb-2 border-b border-stone-800/80 pb-2">
        <div className="flex items-center gap-2">
          {/* Angle Mode Switcher Badge */}
          <button
            id="angle-mode-toggle"
            type="button"
            onClick={onToggleAngleMode}
            className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold tracking-wider transition-colors"
            title="Toggle between Degrees and Radians"
          >
            {angleMode}
          </button>

          {/* Memory Indicator */}
          {memoryValue !== null && (
            <span
              id="memory-indicator"
              className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30"
              title={`Memory Stored: ${memoryValue}`}
            >
              M ({memoryValue})
            </span>
          )}
        </div>

        {/* Quick Action Tools: Copy & Backspace */}
        <div className="flex items-center gap-1">
          <button
            id="copy-result-button"
            type="button"
            onClick={onCopy}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors flex items-center gap-1"
            title="Copy result to clipboard"
            aria-label="Copy result to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">Copied</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            id="backspace-button"
            type="button"
            onClick={onBackspace}
            disabled={!expression}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Backspace (Delete last character)"
            aria-label="Backspace"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Expression View (Scrollable horizontally) */}
      <div className="w-full overflow-x-auto scrollbar-none py-1 text-right">
        <div className="inline-block min-w-full text-stone-400 text-lg md:text-xl font-mono tracking-wide whitespace-nowrap">
          {expression || <span className="opacity-40">0</span>}
          <div ref={expressionEndRef} className="inline-block w-1" />
        </div>
      </div>

      {/* Evaluated Value / Primary Output View */}
      <div className="text-right mt-1 w-full overflow-x-auto scrollbar-none">
        {error ? (
          <span className="text-rose-400 text-xl font-medium tracking-wide font-mono animate-pulse">
            {error}
          </span>
        ) : hasCalculated ? (
          <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight font-mono">
            {evaluatedResult || '0'}
          </span>
        ) : (
          <div className="flex items-baseline justify-end gap-1.5">
            {evaluatedResult && evaluatedResult !== expression && (
              <>
                <span className="text-stone-500 text-xl font-mono">=</span>
                <span className="text-stone-400 text-2xl md:text-3xl font-mono font-medium">
                  {evaluatedResult}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { CalculatorMode } from '../types';

interface KeypadProps {
  mode: CalculatorMode;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onFunction: (func: string) => void;
  onConstant: (c: string) => void;
  onParenthesis: (p: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleSign: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onPercentage: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  onNumber,
  onOperator,
  onFunction,
  onConstant,
  onParenthesis,
  onClear,
  onBackspace,
  onEquals,
  onToggleSign,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onPercentage,
}) => {
  const isScientific = mode === 'scientific';

  const numBtnClass =
    'h-12 md:h-14 rounded-xl font-medium text-lg md:text-xl text-stone-100 bg-stone-800/90 hover:bg-stone-700 active:bg-stone-600 transition-colors shadow-sm flex items-center justify-center select-none';

  const opBtnClass =
    'h-12 md:h-14 rounded-xl font-semibold text-lg md:text-xl text-amber-300 bg-amber-950/40 border border-amber-500/20 hover:bg-amber-900/50 active:bg-amber-900/70 transition-colors shadow-sm flex items-center justify-center select-none';

  const sciBtnClass =
    'h-11 md:h-12 rounded-xl font-medium text-sm md:text-base text-cyan-300 bg-stone-800/60 border border-cyan-500/20 hover:bg-stone-700/80 active:bg-stone-700 transition-colors shadow-sm flex items-center justify-center select-none';

  const memBtnClass =
    'h-9 md:h-10 rounded-lg font-medium text-xs md:text-sm text-stone-300 bg-stone-800/50 hover:bg-stone-750 active:bg-stone-700 transition-colors flex items-center justify-center select-none';

  return (
    <div id="calculator-keypad" className="flex flex-col gap-2.5 mt-3 select-none">
      {/* Memory Bar */}
      <div className="grid grid-cols-4 gap-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-mc"
          onClick={onMemoryClear}
          className={memBtnClass}
        >
          MC
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-mr"
          onClick={onMemoryRecall}
          className={memBtnClass}
        >
          MR
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-m-plus"
          onClick={onMemoryAdd}
          className={memBtnClass}
        >
          M+
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-m-minus"
          onClick={onMemorySubtract}
          className={memBtnClass}
        >
          M-
        </motion.button>
      </div>

      {/* Scientific Function Panel (Displayed when Scientific mode is active) */}
      {isScientific && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-4 md:grid-cols-5 gap-2 pt-1 pb-1 border-t border-b border-stone-800/70"
        >
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-sin" onClick={() => onFunction('sin')} className={sciBtnClass}>
            sin
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-cos" onClick={() => onFunction('cos')} className={sciBtnClass}>
            cos
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-tan" onClick={() => onFunction('tan')} className={sciBtnClass}>
            tan
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-ln" onClick={() => onFunction('ln')} className={sciBtnClass}>
            ln
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-log" onClick={() => onFunction('log')} className={`${sciBtnClass} max-md:hidden`}>
            log
          </motion.button>

          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-pi" onClick={() => onConstant('π')} className={sciBtnClass}>
            π
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-e" onClick={() => onConstant('e')} className={sciBtnClass}>
            e
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-power" onClick={() => onOperator('^')} className={sciBtnClass}>
            xʸ
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-sqrt" onClick={() => onFunction('sqrt')} className={sciBtnClass}>
            √x
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-fact" onClick={() => onOperator('!')} className={`${sciBtnClass} max-md:hidden`}>
            x!
          </motion.button>

          {/* Secondary functions on mobile for row 3 */}
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-log-mobile" onClick={() => onFunction('log')} className={`${sciBtnClass} md:hidden`}>
            log
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-fact-mobile" onClick={() => onOperator('!')} className={`${sciBtnClass} md:hidden`}>
            x!
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-abs" onClick={() => onFunction('abs')} className={`${sciBtnClass} md:hidden`}>
            |x|
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-cbrt" onClick={() => onFunction('cbrt')} className={`${sciBtnClass} md:hidden`}>
            ³√x
          </motion.button>
        </motion.div>
      )}

      {/* Primary Keypad Grid (Standard 4 Columns) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-clear"
          onClick={onClear}
          className="h-12 md:h-14 rounded-xl font-semibold text-lg md:text-xl text-rose-300 bg-rose-950/30 border border-rose-500/20 hover:bg-rose-900/40 active:bg-rose-900/60 transition-colors shadow-sm flex items-center justify-center select-none"
        >
          AC
        </motion.button>

        <div className="grid grid-cols-2 gap-1">
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            id="btn-paren-open"
            onClick={() => onParenthesis('(')}
            className="h-12 md:h-14 rounded-xl font-medium text-base md:text-lg text-stone-300 bg-stone-800/80 hover:bg-stone-700 active:bg-stone-600 transition-colors shadow-sm flex items-center justify-center select-none"
          >
            (
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            id="btn-paren-close"
            onClick={() => onParenthesis(')')}
            className="h-12 md:h-14 rounded-xl font-medium text-base md:text-lg text-stone-300 bg-stone-800/80 hover:bg-stone-700 active:bg-stone-600 transition-colors shadow-sm flex items-center justify-center select-none"
          >
            )
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-percent"
          onClick={onPercentage}
          className="h-12 md:h-14 rounded-xl font-medium text-lg md:text-xl text-stone-300 bg-stone-800/80 hover:bg-stone-700 active:bg-stone-600 transition-colors shadow-sm flex items-center justify-center select-none"
        >
          %
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-divide"
          onClick={() => onOperator('÷')}
          className={opBtnClass}
        >
          ÷
        </motion.button>

        {/* Row 2: 7, 8, 9, × */}
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-7" onClick={() => onNumber('7')} className={numBtnClass}>
          7
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-8" onClick={() => onNumber('8')} className={numBtnClass}>
          8
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-9" onClick={() => onNumber('9')} className={numBtnClass}>
          9
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-multiply" onClick={() => onOperator('×')} className={opBtnClass}>
          ×
        </motion.button>

        {/* Row 3: 4, 5, 6, − */}
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-4" onClick={() => onNumber('4')} className={numBtnClass}>
          4
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-5" onClick={() => onNumber('5')} className={numBtnClass}>
          5
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-6" onClick={() => onNumber('6')} className={numBtnClass}>
          6
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-subtract" onClick={() => onOperator('−')} className={opBtnClass}>
          −
        </motion.button>

        {/* Row 4: 1, 2, 3, + */}
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-1" onClick={() => onNumber('1')} className={numBtnClass}>
          1
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-2" onClick={() => onNumber('2')} className={numBtnClass}>
          2
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-3" onClick={() => onNumber('3')} className={numBtnClass}>
          3
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-add" onClick={() => onOperator('+')} className={opBtnClass}>
          +
        </motion.button>

        {/* Row 5: ±, 0, ., = */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-sign"
          onClick={onToggleSign}
          className="h-12 md:h-14 rounded-xl font-medium text-lg md:text-xl text-stone-300 bg-stone-800/80 hover:bg-stone-700 active:bg-stone-600 transition-colors shadow-sm flex items-center justify-center select-none"
        >
          ±
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-0" onClick={() => onNumber('0')} className={numBtnClass}>
          0
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} type="button" id="btn-decimal" onClick={() => onNumber('.')} className={numBtnClass}>
          .
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          id="btn-equals"
          onClick={onEquals}
          className="h-12 md:h-14 rounded-xl font-bold text-xl md:text-2xl text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 shadow-lg shadow-amber-950/40 transition-colors flex items-center justify-center select-none"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};

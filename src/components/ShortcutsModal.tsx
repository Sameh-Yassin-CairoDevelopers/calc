import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Input digits' },
    { key: '+  -  *  /', desc: 'Arithmetic operators' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Esc or c', desc: 'Clear all (AC)' },
    { key: '%', desc: 'Percentage' },
    { key: '( and )', desc: 'Parentheses' },
    { key: '^', desc: 'Exponentiation (power)' },
    { key: 's / c / t', desc: 'sin( / cos( / tan(' },
    { key: 'p / e', desc: 'π / Euler constant e' },
  ];

  return (
    <div
      id="shortcuts-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="shortcuts-modal-card"
        className="w-full max-w-sm rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-2xl text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold tracking-wide">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between py-1 border-b border-stone-800/40">
              <kbd className="px-2 py-1 rounded bg-stone-800 border border-stone-700 font-mono text-amber-300 font-semibold text-xs">
                {sc.key}
              </kbd>
              <span className="text-stone-400">{sc.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

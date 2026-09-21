import React from 'react';
import { Trash2, X, Clock, ArrowUpLeft } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  history,
  onClose,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-panel-overlay"
      className="absolute inset-0 z-30 bg-stone-950/95 backdrop-blur-md rounded-3xl p-5 flex flex-col border border-stone-800 transition-all shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-200">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase">Calculation History (السجل)</h2>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              id="btn-clear-history"
              type="button"
              onClick={onClearHistory}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800/80 transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            id="btn-close-history"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors"
            title="Close history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-thin">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-500 text-sm gap-2">
            <Clock className="w-8 h-8 opacity-40" />
            <p>No calculations yet</p>
            <p className="text-xs text-stone-600">Calculated expressions will appear here</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHistoryItem(item)}
              className="w-full text-right p-3 rounded-xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800/80 transition-all group flex flex-col items-end gap-1"
            >
              <div className="w-full flex items-center justify-between text-xs text-stone-500 font-mono">
                <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity">
                  <ArrowUpLeft className="w-3 h-3" />
                  Use
                </span>
                <span>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <div className="text-stone-400 text-sm font-mono tracking-wide truncate max-w-full">
                {item.expression} =
              </div>
              <div className="text-stone-100 text-xl font-semibold font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                {item.result}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

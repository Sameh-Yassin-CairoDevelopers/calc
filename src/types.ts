export type AngleMode = 'DEG' | 'RAD';

export type CalculatorMode = 'standard' | 'scientific';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type KeyType = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'constant' 
  | 'action' 
  | 'memory' 
  | 'equals';

export interface KeyConfig {
  id: string;
  label: string;
  displayLabel?: string;
  value: string;
  type: KeyType;
  subLabel?: string;
  ariaLabel?: string;
  scientificOnly?: boolean;
  className?: string;
}

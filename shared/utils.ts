import { CURRENCY } from './constants';

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: CURRENCY }).format(amount);
} 
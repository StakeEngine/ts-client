import type { Balance } from './types.js';
/**
 * parseBalance is a helper to parse a balance from the request to a typed balance object.
 */
declare const parseBalance: (balance: {
    amount: number;
    currency: string;
}) => Balance;
/**
 * ParseAmount converts an RGS amount to a regular decimal number.
 * eg 1_000_000 to a regular decimal number 1.00
 */
declare const ParseAmount: (val: number) => number;
/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances or amounts and there are configurations to remove symbols and to change the number of decimals displayed.
 */
declare const DisplayAmount: (balance: Balance, options?: {
    removeSymbol?: boolean;
    decimals?: number;
    trimDecimalForIntegers?: boolean;
}) => string;
declare const API_MULTIPLIER = 1000000;
export { API_MULTIPLIER, DisplayAmount, ParseAmount, parseBalance };
//# sourceMappingURL=helpers.d.ts.map
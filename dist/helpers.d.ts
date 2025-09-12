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
 * Displays a formatted amount from the RGS (eg 1_000_000) to a regular decimal number (eg 1.00).
 * The function is intended to be used for displaying amounts.
 */
declare const DisplayAmount: (val: number) => string;
/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances.
 */
declare const DisplayBalance: (balance: Balance) => string;
declare const API_MULTIPLIER = 1000000;
export { API_MULTIPLIER, DisplayAmount, DisplayBalance, ParseAmount, parseBalance, };
//# sourceMappingURL=helpers.d.ts.map
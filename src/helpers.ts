import type { Balance, Currency } from './types.js';

/**
 * parseBalance is a helper to parse a balance from the request to a typed balance object.
 */
const parseBalance = (balance: {
  amount: number;
  currency: string;
}): Balance => {
  return {
    amount: balance.amount,
    currency: balance.currency as Currency,
  };
};

/**
 * ParseAmount converts an RGS amount to a regular decimal number.
 * eg 1_000_000 to a regular decimal number 1.00
 */
const ParseAmount = (val: number): number => {
  return val / API_MULTIPLIER;
};

/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances or amounts and there are configurations to remove symbols and to change the number of decimals displayed.
 */
const DisplayAmount = (
  balance: Balance,
  options?: {
    removeSymbol?: boolean;
    decimals?: number;
    trimDecimalForIntegers?: boolean;
  },
): string => {
  const meta = CurrencyMeta[balance.currency] ?? {
    symbol: balance.currency,
    decimals: 2,
    symbolAfter: true,
  };

  const browserLocale = navigator.language || 'en-US';

  const amount = ParseAmount(balance.amount);

  // If the amount is a whole number, show no decimals by default
  let decimals = options?.decimals ?? meta.decimals;
  if (options?.trimDecimalForIntegers && amount % 1 === 0) {
    decimals = 0;
  }

  const formattedAmount = new Intl.NumberFormat(browserLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  const removeSymbol = options?.removeSymbol ?? false;

  if (meta.symbolAfter) {
    return `${formattedAmount}${!removeSymbol ? ' ' + meta.symbol : ''}`;
  } else {
    return `${!removeSymbol ? meta.symbol : ''}${formattedAmount}`;
  }
};

// Currency metadata: symbol, default decimals, symbol placement
const CurrencyMeta: Record<
  Currency,
  { symbol: string; decimals: number; symbolAfter?: boolean }
> = {
  USD: { symbol: '$', decimals: 2 },
  CAD: { symbol: 'CA$', decimals: 2 },
  JPY: { symbol: '¥', decimals: 0 },
  EUR: { symbol: '€', decimals: 2 },
  RUB: { symbol: '₽', decimals: 2 },
  CNY: { symbol: 'CN¥', decimals: 2 },
  PHP: { symbol: '₱', decimals: 2 },
  INR: { symbol: '₹', decimals: 2 },
  IDR: { symbol: 'Rp', decimals: 0 },
  KRW: { symbol: '₩', decimals: 0 },
  BRL: { symbol: 'R$', decimals: 2 },
  MXN: { symbol: 'MX$', decimals: 2 },
  DKK: { symbol: 'KR', decimals: 2, symbolAfter: true },
  PLN: { symbol: 'zł', decimals: 2, symbolAfter: true },
  VND: { symbol: '₫', decimals: 0, symbolAfter: true },
  TRY: { symbol: '₺', decimals: 2 },
  CLP: { symbol: 'CLP', decimals: 0, symbolAfter: true },
  ARS: { symbol: 'ARS', decimals: 2, symbolAfter: true },
  PEN: { symbol: 'S/', decimals: 2, symbolAfter: true },
  XGC: { symbol: 'GC', decimals: 0, symbolAfter: true },
  XSC: { symbol: 'SC', decimals: 2, symbolAfter: true },
};

const API_MULTIPLIER = 1_000_000;

export { API_MULTIPLIER, DisplayAmount, ParseAmount, parseBalance };

/**
 * parseBalance is a helper to parse a balance from the request to a typed balance object.
 */
const parseBalance = (balance) => {
    return {
        amount: balance.amount,
        currency: balance.currency,
    };
};
/**
 * ParseAmount converts an RGS amount to a regular decimal number.
 * eg 1_000_000 to a regular decimal number 1.00
 */
const ParseAmount = (val) => {
    return val / API_MULTIPLIER;
};
/**
 * Displays a formatted amount from the RGS (eg 1_000_000) to a regular decimal number (eg 1.00).
 * The function is intended to be used for displaying amounts.
 */
const DisplayAmount = (val) => {
    return ParseAmount(val).toFixed(2);
};
/**
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances.
 */
const DisplayBalance = (balance) => {
    const meta = CurrencyMeta[balance.currency] ?? {
        symbol: balance.currency,
        amount: ParseAmount(balance.amount),
        symbolAfter: true,
    };
    const useDecimals = meta.decimals;
    const formattedAmount = balance.amount.toFixed(useDecimals);
    if (meta.symbolAfter) {
        return `${formattedAmount} ${meta.symbol}`;
    }
    else {
        return `${meta.symbol}${formattedAmount}`;
    }
};
// Currency metadata: symbol, default decimals, symbol placement
const CurrencyMeta = {
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
    XGC: { symbol: 'GC', decimals: 2 },
    XSC: { symbol: 'SC', decimals: 2 },
};
const API_MULTIPLIER = 1_000_000;
export { API_MULTIPLIER, DisplayAmount, DisplayBalance, ParseAmount, parseBalance, };
//# sourceMappingURL=helpers.js.map
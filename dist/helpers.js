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
 * Formats a number with its currency symbol, respecting default decimals and symbol placement.
 * The function is intended to be used for displaying balances or amounts and there are configurations to remove symbols and to change the number of decimals displayed.
 */
const DisplayAmount = (balance, options) => {
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
    }
    else {
        return `${!removeSymbol ? meta.symbol : ''}${formattedAmount}`;
    }
};
// Supported Currencies
// | Currency                     | Abbreviation | Display  | Example  |
// | ---------------------------- | ------------ | -------- | -------- |
// | United States Dollar         | USD          | $        | $10.00   |
// | Canadian Dollar              | CAD          | CA$      | CA$10.00 |
// | Japanese Yen                 | JPY          | ¥        | ¥10      |
// | Euro                         | EUR          | €        | €10.00   |
// | Russian Ruble                | RUB          | ₽        | ₽10.00   |
// | Chinese Yuan                 | CNY          | CN¥      | CN¥10.00 |
// | Philippine Peso              | PHP          | ₱        | ₱10.00   |
// | Indian Rupee                 | INR          | ₹        | ₹10.00   |
// | Indonesian Rupiah            | IDR          | Rp       | Rp10     |
// | South Korean Won             | KRW          | ₩        | ₩10      |
// | Brazilian Real               | BRL          | R$       | R$10.00  |
// | Mexican Peso                 | MXN          | MX$      | MX$10.00 |
// | Danish Krone                 | DKK          | KR       | 10.00 KR |
// | Polish Złoty                 | PLN          | zł       | 10.00 zł |
// | Vietnamese Đồng              | VND          | ₫        | 10 ₫     |
// | Turkish Lira                 | TRY          | ₺        | ₺10.00   |
// | Chilean Peso                 | CLP          | CLP      | 10 CLP   |
// | Argentine Peso               | ARS          | ARS      | 10.00 ARS|
// | Peruvian Sol                 | PEN          | S/       | S/10.00  |
// | Nigerian Naira               | NGN          | ₦        | ₦10.00   |
// | Saudi Arabia Riyal           | SAR          | SAR      | 10.00 SAR|
// | Israel Shekel                | ILS          | ILS      | 10.00 ILS|
// | United Arab Emirates Dirham  | AED          | AED      | 10.00 AED|
// | Taiwan New Dollar            | TWD          | NT$      | NT$10.00 |
// | Norway Krone                 | NOK          | kr       | kr10.00  |
// | Kuwaiti Dinar                | KWD          | KD       | KD10.00  |
// | Jordanian Dinar              | JOD          | JD       | JD10.00  |
// | Costa Rica Colon             | CRC          | ₡        | ₡10.00   |
// | Tunisian Dinar               | TND          | TND      | 10.00 TND|
// | Singapore Dollar             | SGD          | SG$      | SG$10.00 |
// | Malaysia Ringgit             | MYR          | RM       | RM10.00  |
// | Oman Rial                    | OMR          | OMR      | 10.00 OMR|
// | Qatar Riyal                  | QAR          | QAR      | 10.00 QAR|
// | Bahraini Dinar               | BHD          | BD       | BD10.00  |
// | Stake Gold Coin              | XGC          | GC       | 10.00 GC |
// | Stake Cash                   | XSC          | SC       | 10.00 SC |
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
    NGN: { symbol: '₦', decimals: 0 },
    SAR: { symbol: 'SAR', decimals: 2, symbolAfter: true },
    ILS: { symbol: 'ILS', decimals: 2, symbolAfter: true },
    AED: { symbol: 'AED', decimals: 2, symbolAfter: true },
    TWD: { symbol: 'NT$', decimals: 2 },
    NOK: { symbol: 'kr', decimals: 2 },
    KWD: { symbol: 'KD', decimals: 2 },
    JOD: { symbol: 'JD', decimals: 2 },
    CRC: { symbol: '₡', decimals: 2 },
    TND: { symbol: 'TND', decimals: 2, symbolAfter: true },
    SGD: { symbol: 'SG$', decimals: 2 },
    MYR: { symbol: 'RM', decimals: 2 },
    OMR: { symbol: 'OMR', decimals: 2, symbolAfter: true },
    QAR: { symbol: 'QAR', decimals: 2, symbolAfter: true },
    BHD: { symbol: 'BD', decimals: 2 },
    XGC: { symbol: 'GC', decimals: 0, symbolAfter: true },
    XSC: { symbol: 'SC', decimals: 2, symbolAfter: true },
};
const API_MULTIPLIER = 1_000_000;
export { API_MULTIPLIER, DisplayAmount, ParseAmount, parseBalance };
//# sourceMappingURL=helpers.js.map
/**
 * Currency utilities for worldwide support
 */
export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
}
/**
 * Get currency info for a country
 */
export declare function getCurrencyForCountry(country: string): CurrencyInfo;
/**
 * Detect currency from Mapbox place data
 */
export declare function detectCurrencyFromPlace(placeData: any): CurrencyInfo;
/**
 * Format price with currency
 */
export declare function formatPrice(amount: number, currency: CurrencyInfo): string;
/**
 * Get all supported currencies
 */
export declare function getAllCurrencies(): CurrencyInfo[];
//# sourceMappingURL=currency.d.ts.map
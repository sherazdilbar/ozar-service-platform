export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
}
export declare function getCurrencyForCountry(country: string): CurrencyInfo;
export declare function detectCurrencyFromPlace(placeData: any): CurrencyInfo;
export declare function formatPrice(amount: number, currency: CurrencyInfo): string;
export declare function getAllCurrencies(): CurrencyInfo[];

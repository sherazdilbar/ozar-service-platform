"use strict";
/**
 * Currency utilities for worldwide support
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyForCountry = getCurrencyForCountry;
exports.detectCurrencyFromPlace = detectCurrencyFromPlace;
exports.formatPrice = formatPrice;
exports.getAllCurrencies = getAllCurrencies;
// Map of countries to their currencies
const COUNTRY_CURRENCIES = {
    // Middle East
    'Saudi Arabia': { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
    'United Arab Emirates': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    'Kuwait': { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    'Qatar': { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },
    'Bahrain': { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar' },
    'Oman': { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial' },
    'Jordan': { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar' },
    'Lebanon': { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound' },
    'Egypt': { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound' },
    // Europe
    'United Kingdom': { code: 'GBP', symbol: '£', name: 'British Pound' },
    'Switzerland': { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    'Norway': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    'Sweden': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    'Denmark': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    'Poland': { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    'Czech Republic': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    'Hungary': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    'Romania': { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
    'Bulgaria': { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
    'Croatia': { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
    'Turkey': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    'Russia': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    // Americas
    'United States': { code: 'USD', symbol: '$', name: 'US Dollar' },
    'Canada': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    'Mexico': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    'Brazil': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    'Argentina': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    'Chile': { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    'Colombia': { code: 'COP', symbol: '$', name: 'Colombian Peso' },
    'Peru': { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
    // Asia Pacific
    'Japan': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    'China': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    'South Korea': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    'India': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    'Pakistan': { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    'Bangladesh': { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    'Indonesia': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    'Malaysia': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    'Singapore': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    'Thailand': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    'Vietnam': { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    'Philippines': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    'Australia': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    'New Zealand': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    // Africa
    'South Africa': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    'Nigeria': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    'Kenya': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    'Ghana': { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
    'Morocco': { code: 'MAD', symbol: 'د.م', name: 'Moroccan Dirham' },
    'Tunisia': { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
    'Algeria': { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
};
// Eurozone countries
const EUROZONE_COUNTRIES = [
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
    'Austria', 'Portugal', 'Greece', 'Ireland', 'Finland', 'Slovakia',
    'Slovenia', 'Luxembourg', 'Latvia', 'Lithuania', 'Estonia', 'Cyprus', 'Malta'
];
const EURO = { code: 'EUR', symbol: '€', name: 'Euro' };
const DEFAULT_CURRENCY = { code: 'USD', symbol: '$', name: 'US Dollar' };
/**
 * Get currency info for a country
 */
function getCurrencyForCountry(country) {
    // Check if it's a Eurozone country
    if (EUROZONE_COUNTRIES.includes(country)) {
        return EURO;
    }
    // Check direct mapping
    if (COUNTRY_CURRENCIES[country]) {
        return COUNTRY_CURRENCIES[country];
    }
    // Default to USD
    return DEFAULT_CURRENCY;
}
/**
 * Detect currency from Mapbox place data
 */
function detectCurrencyFromPlace(placeData) {
    if (!placeData || !placeData.context) {
        return DEFAULT_CURRENCY;
    }
    // Find country in context
    const countryContext = placeData.context.find((ctx) => ctx.id.startsWith('country.'));
    if (countryContext) {
        const country = countryContext.text;
        return getCurrencyForCountry(country);
    }
    return DEFAULT_CURRENCY;
}
/**
 * Format price with currency
 */
function formatPrice(amount, currency) {
    return `${currency.symbol}${amount.toLocaleString()}`;
}
/**
 * Get all supported currencies
 */
function getAllCurrencies() {
    const currencies = new Map();
    // Add Euro
    currencies.set(EURO.code, EURO);
    // Add all other currencies
    Object.values(COUNTRY_CURRENCIES).forEach(currency => {
        currencies.set(currency.code, currency);
    });
    return Array.from(currencies.values()).sort((a, b) => a.name.localeCompare(b.name));
}
//# sourceMappingURL=currency.js.map
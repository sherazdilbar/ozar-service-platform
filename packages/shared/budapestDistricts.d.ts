export declare const BUDAPEST_DISTRICTS: {
    readonly I: {
        readonly name: "Várnegyed";
        readonly nameEn: "Castle District";
        readonly zone: "central";
    };
    readonly II: {
        readonly name: "Rózsadomb";
        readonly nameEn: "Rose Hill";
        readonly zone: "buda-hills";
    };
    readonly III: {
        readonly name: "Óbuda-Békásmegyer";
        readonly nameEn: "Old Buda";
        readonly zone: "north-buda";
    };
    readonly IV: {
        readonly name: "Újpest";
        readonly nameEn: "New Pest";
        readonly zone: "north-pest";
    };
    readonly V: {
        readonly name: "Belváros-Lipótváros";
        readonly nameEn: "Inner City";
        readonly zone: "central";
    };
    readonly VI: {
        readonly name: "Terézváros";
        readonly nameEn: "Theresa Town";
        readonly zone: "central";
    };
    readonly VII: {
        readonly name: "Erzsébetváros";
        readonly nameEn: "Elizabeth Town";
        readonly zone: "central";
    };
    readonly VIII: {
        readonly name: "Józsefváros";
        readonly nameEn: "Joseph Town";
        readonly zone: "mid-pest";
    };
    readonly IX: {
        readonly name: "Ferencváros";
        readonly nameEn: "Francis Town";
        readonly zone: "mid-pest";
    };
    readonly X: {
        readonly name: "Kőbánya";
        readonly nameEn: "Stone Quarry";
        readonly zone: "outer-pest";
    };
    readonly XI: {
        readonly name: "Újbuda";
        readonly nameEn: "New Buda";
        readonly zone: "south-buda";
    };
    readonly XII: {
        readonly name: "Hegyvidék";
        readonly nameEn: "Mountain District";
        readonly zone: "buda-hills";
    };
    readonly XIII: {
        readonly name: "Újlipótváros";
        readonly nameEn: "New Leopold Town";
        readonly zone: "central";
    };
    readonly XIV: {
        readonly name: "Zugló";
        readonly nameEn: "Zugló";
        readonly zone: "outer-pest";
    };
    readonly XV: {
        readonly name: "Rákospalota";
        readonly nameEn: "Rákospalota";
        readonly zone: "outer-pest";
    };
    readonly XVI: {
        readonly name: "Mátyásföld";
        readonly nameEn: "Mátyásföld";
        readonly zone: "outer-pest";
    };
    readonly XVII: {
        readonly name: "Rákosmente";
        readonly nameEn: "Rákosmente";
        readonly zone: "outer-pest";
    };
    readonly XVIII: {
        readonly name: "Pestszentlőrinc";
        readonly nameEn: "Pestszentlőrinc";
        readonly zone: "outer-pest";
    };
    readonly XIX: {
        readonly name: "Kispest";
        readonly nameEn: "Kispest";
        readonly zone: "outer-pest";
    };
    readonly XX: {
        readonly name: "Pesterzsébet";
        readonly nameEn: "Pesterzsébet";
        readonly zone: "outer-pest";
    };
    readonly XXI: {
        readonly name: "Csepel";
        readonly nameEn: "Csepel";
        readonly zone: "south-pest";
    };
    readonly XXII: {
        readonly name: "Budafok-Tétény";
        readonly nameEn: "Budafok";
        readonly zone: "south-buda";
    };
    readonly XXIII: {
        readonly name: "Soroksár";
        readonly nameEn: "Soroksár";
        readonly zone: "south-pest";
    };
};
export declare const DISTRICT_ZONES: {
    readonly central: {
        readonly name: "Central Budapest";
        readonly nameHu: "Központi Budapest";
        readonly districts: readonly ["I", "V", "VI", "VII", "XIII"];
        readonly description: "City center, business district, premium areas";
    };
    readonly 'buda-hills': {
        readonly name: "Buda Hills";
        readonly nameHu: "Budai hegyek";
        readonly districts: readonly ["II", "XII"];
        readonly description: "Hills, wealthy residential areas, green spaces";
    };
    readonly 'north-buda': {
        readonly name: "North Buda";
        readonly nameHu: "Észak-Buda";
        readonly districts: readonly ["III"];
        readonly description: "Old Buda, residential areas";
    };
    readonly 'north-pest': {
        readonly name: "North Pest";
        readonly nameHu: "Észak-Pest";
        readonly districts: readonly ["IV"];
        readonly description: "Northern Pest side";
    };
    readonly 'mid-pest': {
        readonly name: "Mid Pest";
        readonly nameHu: "Közép-Pest";
        readonly districts: readonly ["VIII", "IX"];
        readonly description: "Central Pest, mixed residential and commercial";
    };
    readonly 'south-buda': {
        readonly name: "South Buda";
        readonly nameHu: "Dél-Buda";
        readonly districts: readonly ["XI", "XXII"];
        readonly description: "Southern Buda side, growing areas";
    };
    readonly 'south-pest': {
        readonly name: "South Pest";
        readonly nameHu: "Dél-Pest";
        readonly districts: readonly ["XXI", "XXIII"];
        readonly description: "Southern Pest side, suburban";
    };
    readonly 'outer-pest': {
        readonly name: "Outer Pest";
        readonly nameHu: "Külső-Pest";
        readonly districts: readonly ["X", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
        readonly description: "Outer districts, more affordable, suburban feel";
    };
};
export type BudapestDistrict = keyof typeof BUDAPEST_DISTRICTS;
export type DistrictZone = keyof typeof DISTRICT_ZONES;
export declare function getDistrictDisplayName(district: BudapestDistrict, language?: 'en' | 'hu'): string;
export declare function getDistrictsInZone(zone: DistrictZone): BudapestDistrict[];
export declare function isBudapest(city: string): boolean;
export declare function getZoneForDistrict(district: BudapestDistrict): DistrictZone;
//# sourceMappingURL=budapestDistricts.d.ts.map
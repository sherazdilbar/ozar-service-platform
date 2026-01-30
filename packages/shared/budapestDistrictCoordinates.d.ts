export declare const BUDAPEST_DISTRICT_COORDINATES: {
    readonly I: {
        readonly lat: 47.4979;
        readonly lng: 19.0402;
        readonly name: "Várnegyed";
    };
    readonly II: {
        readonly lat: 47.5167;
        readonly lng: 19.0247;
        readonly name: "Rózsadomb";
    };
    readonly III: {
        readonly lat: 47.5429;
        readonly lng: 19.0521;
        readonly name: "Óbuda-Békásmegyer";
    };
    readonly IV: {
        readonly lat: 47.5615;
        readonly lng: 19.0885;
        readonly name: "Újpest";
    };
    readonly V: {
        readonly lat: 47.4969;
        readonly lng: 19.0531;
        readonly name: "Belváros-Lipótváros";
    };
    readonly VI: {
        readonly lat: 47.5069;
        readonly lng: 19.0625;
        readonly name: "Terézváros";
    };
    readonly VII: {
        readonly lat: 47.4969;
        readonly lng: 19.0708;
        readonly name: "Erzsébetváros";
    };
    readonly VIII: {
        readonly lat: 47.4869;
        readonly lng: 19.0708;
        readonly name: "Józsefváros";
    };
    readonly IX: {
        readonly lat: 47.4769;
        readonly lng: 19.0625;
        readonly name: "Ferencváros";
    };
    readonly X: {
        readonly lat: 47.4769;
        readonly lng: 19.1458;
        readonly name: "Kőbánya";
    };
    readonly XI: {
        readonly lat: 47.4669;
        readonly lng: 19.0458;
        readonly name: "Újbuda";
    };
    readonly XII: {
        readonly lat: 47.5069;
        readonly lng: 18.9958;
        readonly name: "Hegyvidék";
    };
    readonly XIII: {
        readonly lat: 47.5169;
        readonly lng: 19.0625;
        readonly name: "Újlipótváros";
    };
    readonly XIV: {
        readonly lat: 47.5169;
        readonly lng: 19.1042;
        readonly name: "Zugló";
    };
    readonly XV: {
        readonly lat: 47.5569;
        readonly lng: 19.1208;
        readonly name: "Rákospalota";
    };
    readonly XVI: {
        readonly lat: 47.5169;
        readonly lng: 19.1625;
        readonly name: "Mátyásföld";
    };
    readonly XVII: {
        readonly lat: 47.4769;
        readonly lng: 19.2542;
        readonly name: "Rákosmente";
    };
    readonly XVIII: {
        readonly lat: 47.4369;
        readonly lng: 19.1792;
        readonly name: "Pestszentlőrinc";
    };
    readonly XIX: {
        readonly lat: 47.4369;
        readonly lng: 19.1458;
        readonly name: "Kispest";
    };
    readonly XX: {
        readonly lat: 47.4369;
        readonly lng: 19.1042;
        readonly name: "Pesterzsébet";
    };
    readonly XXI: {
        readonly lat: 47.4269;
        readonly lng: 19.0708;
        readonly name: "Csepel";
    };
    readonly XXII: {
        readonly lat: 47.4169;
        readonly lng: 18.9625;
        readonly name: "Budafok-Tétény";
    };
    readonly XXIII: {
        readonly lat: 47.4069;
        readonly lng: 19.1458;
        readonly name: "Soroksár";
    };
};
export declare function getDistrictCoordinates(district: string): {
    lat: number;
    lng: number;
} | null;
export declare function findNearestDistrict(lat: number, lng: number): string | null;
export declare function isWithinBudapest(lat: number, lng: number): boolean;
export declare function getDistrictsWithinRadius(lat: number, lng: number, radiusKm: number): string[];
export declare const BUDAPEST_CENTER: {
    lat: number;
    lng: number;
};
//# sourceMappingURL=budapestDistrictCoordinates.d.ts.map
import { ServiceCategory } from './types';
export interface CategoryGroup {
    id: string;
    label: string;
    icon: string;
    description: string;
    subcategories: ServiceCategory[];
}
export declare const CATEGORY_GROUPS: CategoryGroup[];
export declare function getCategoryGroup(category: ServiceCategory): CategoryGroup | undefined;
export declare function getAllCategories(): ServiceCategory[];
//# sourceMappingURL=categoryStructure.d.ts.map
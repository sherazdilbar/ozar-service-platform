import { Injectable } from '@nestjs/common';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_GROUPS } from '@ozar/shared';
import { ServiceCategory } from '@prisma/client';

@Injectable()
export class CategoriesService {
  getAll() {
    return Object.values(ServiceCategory).map(category => ({
      id: category,
      label: CATEGORY_LABELS[category],
      icon: CATEGORY_ICONS[category],
    }));
  }

  getGrouped() {
    return CATEGORY_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      icon: group.icon,
      description: group.description,
      subcategories: group.subcategories.map(cat => ({
        id: cat,
        label: CATEGORY_LABELS[cat],
        icon: CATEGORY_ICONS[cat],
      })),
    }));
  }
}

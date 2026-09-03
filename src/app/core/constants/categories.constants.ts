export interface CategoryOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'courses',   label: 'Courses',   icon: 'basket-outline',          color: '#22C55E' },
  { id: 'transport', label: 'Transport', icon: 'car-outline',             color: '#3B82F6' },
  { id: 'shopping',  label: 'Shopping',  icon: 'bag-outline',             color: '#EC4899' },
  { id: 'loisirs',   label: 'Loisirs',   icon: 'game-controller-outline', color: '#8B5CF6' },
  { id: 'voyage',    label: 'Voyage',    icon: 'airplane-outline',        color: '#F97316' },
  { id: 'sante',     label: 'Santé',     icon: 'heart-outline',           color: '#EF4444' },
  { id: 'education', label: 'Éducation', icon: 'school-outline',          color: '#0EA5E9' },
  { id: 'maison',    label: 'Maison',    icon: 'home-outline',            color: '#EAB308' },
  { id: 'restaurant',label: 'Restaurant',icon: 'restaurant-outline',      color: '#F59E0B' }
];
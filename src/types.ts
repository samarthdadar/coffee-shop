export type ScreenId = 'menu' | 'custom' | 'cart' | 'kitchen' | 'manage';

export type MenuCategory = 'reserve-coffee' | 'artisan-brunch' | 'warm-bakery' | 'cold-bar';

export interface MenuItem {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  shortDescription: string;
  price: number;
  cogs?: number;
  category: MenuCategory;
  manageCategory: 'Beverage Bar' | 'Hot Kitchen' | 'Bakery';
  station: string;
  prepTime: string;
  prepMinutes: number;
  imageLight: string;
  imageDark: string;
  imageCart: string;
  imageManage: string;
  imageCustomHero?: string;
  badgeText?: string;
  badgeColor?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  freshnessNote?: string;
  originNote?: string;
  tags?: string[];
  inStock: boolean;
  stockCount?: number;
  isFeaturedHero?: boolean;
  allergens?: string;
  dietaryBadges?: string[];
  availableOnTablets?: boolean;
}

export interface CustomSpec {
  vessel: '6oz' | '8oz' | '12oz';
  vesselLabel: string;
  vesselPrice: number;
  milk: 'guernsey' | 'oat' | 'almond' | 'macadamia';
  milkLabel: string;
  milkPrice: number;
  sweetener: 'smoked-vanilla' | 'demerara' | 'monkfruit' | 'unsweetened';
  sweetenerLabel: string;
  pumps: number;
  temp: '65' | 'ice' | '75';
  tempLabel: string;
  notes: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  stationBadge: string;
  stationColor: 'secondary' | 'primary' | 'tertiary';
  prepBadge: string;
  isReadyNow?: boolean;
  customSpec?: CustomSpec;
}

export type KitchenItemStatus = 'extracting' | 'cooking' | 'ready' | 'urgent';

export interface KitchenTicketItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: string;
  image: string;
  station: 'Espresso Bar' | 'Warm Kitchen' | 'Pastry Atelier';
  status: KitchenItemStatus;
}

export interface KitchenTicket {
  id: string;
  tableNumber: string;
  zone: string;
  guests: number;
  elapsedSeconds: number;
  targetMinutes: number;
  isUrgent?: boolean;
  status: 'active' | 'completed';
  items: KitchenTicketItem[];
}

export interface TableSession {
  id: string;
  tableName: string;
  zone: string;
  solariumZone: string;
  guests: number;
}

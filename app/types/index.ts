export type Condition = 'new' | 'used' | 'refurbished';

export interface Part {
  id: string;
  name: string;
  oem: string;
  brand: string;
  condition: Condition;
  price: number;
  inStock: boolean;
  category: string;
  image: string;
  colors?: string[];
}

export interface QuoteItem {
  part: Part;
  quantity: number;
  color?: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

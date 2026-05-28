export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface OptionItem {
  id: string;
  name: string;
  extraPrice: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  items: OptionItem[];
}

export interface Menu {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  isAvailable: boolean;
  optionGroups?: OptionGroup[];
}

export interface CartOptionItem {
  optionGroupId: string;
  optionGroupName: string;
  optionItemId: string;
  optionItemName: string;
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string;
  menuId: string;
  menuName: string;
  price: number;
  quantity: number;
  selectedOptions: CartOptionItem[];
  subtotal: number;
}

export type OrderType = 'PICKUP' | 'DELIVERY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED';

export interface OrderPayload {
  type: OrderType;
  phone: string;
  address?: string;
  items: {
    menuId: string;
    quantity: number;
    selectedOptionIds: string[];
  }[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  type: OrderType;
  totalPrice: number;
  estimatedMinutes?: number;
  createdAt: string;
}

export interface StorefrontProduct {
  id: number;
  code: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  availableStock: number;
  thumbnailUrl?: string;
  imageUrls?: string[];
  productTypeName?: string;
  hasVariants: boolean;
  variants?: StorefrontVariant[];
}

export interface StorefrontVariant {
  id: number;
  name: string;
  code: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  availableStock: number;
  thumbnailUrl?: string;
  imageUrls?: string[];
  typeValue?: string;
  productId: number;
  productName: string;
  productSlug: string;
  productTypeName?: string;
}

export interface StorefrontVariantDetail {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  availableStock: number;
  typeValue?: string;
  thumbnailUrl?: string;
  imageUrls: string[];
  productId: number;
  productName: string;
  productSlug: string;
}

export interface CartItem {
  id: number;
  productId?: number;
  variantId?: number;
  productName: string;
  productCode: string;
  originalUnitPrice: number;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  thumbnailUrl?: string;
  availableStock: number;
}

export interface Cart {
  id: number;
  expiresAt: string;
  items: CartItem[];
  discountPercent: number;
  total: number;
}

export interface CheckoutRequest {
  shippingAddressId?: number;
  billingAddressId?: number;
  notes?: string;
}

export interface CheckoutResponse {
  clientSecret: string;
  amount: number;
  shippingCost: number;
  currency: string;
}

export interface CustomerAddress {
  id: number;
  alias: string;
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  province?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface StorefrontProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  taxId?: string;
  customerGroupName?: string;
  addresses: CustomerAddress[];
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: number;
  type: string;
  alias: string;
  lastFourDigits?: string;
  isDefault: boolean;
}

export interface StorefrontOrder {
  id: number;
  status: string;
  total: number;
  createdAt: string;
}

export interface StorefrontOrderDetail {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  notes?: string;
  shippingAddress?: AddressSummary;
  billingAddress?: AddressSummary;
  lines: OrderLine[];
}

export interface AddressSummary {
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderLine {
  productName: string;
  productCode: string;
  unitPrice: number;
  discountPercent: number;
  quantity: number;
  subtotal: number;
}

export interface StorefrontMenuItem {
  id: number;
  name: string;
  slug: string;
  type: string;
  externalUrl?: string;
  imageUrl?: string;
  order: number;
  children: StorefrontMenuItem[];
}

export interface StorefrontPageItem {
  variantId: number;
  productId: number;
  name: string;
  code: string;
  variantSlug: string;
  productSlug: string;
  price: number;
  originalPrice: number;
  availableStock: number;
  thumbnailUrl?: string;
  typeValue?: string;
  order: number;
}

export interface StorefrontPageDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  externalUrl?: string;
  imageUrl?: string;
  items: StorefrontPageItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AuthResponse {
  token: string;
  customerId: number;
  name: string;
  email: string;
}

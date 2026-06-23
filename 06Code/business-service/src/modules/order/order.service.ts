import crudClient from '../../shared/http/crud.client';
import {
  InsufficientStockError,
  InvalidOrderStatusTransitionError,
  BusinessError,
} from '../../shared/errors/business.errors';

export type OrderItem = {
  productId: number;
  quantity: number;
  customizationDetails?: string;
};

export type PlaceOrderInput = {
  userId?: number;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  items: OrderItem[];
};

// Valid status flow for order lifecycle
const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${randomSuffix}`;
}

async function fetchProductById(productId: number) {
  const response = await crudClient.get(`/api/product/${productId}`);
  return response.data.data;
}

async function fetchShippingCost(destinationProvince: string): Promise<number> {
  try {
    const response = await crudClient.get('/api/shipping-config/lookup', {
      params: { baseProvince: 'Main', destinationProvince },
    });
    return response.data.data.additionalCost;
  } catch {
    return 0;
  }
}

async function validateAndFetchItems(items: OrderItem[]) {
  return Promise.all(
    items.map(async (item) => {
      const product = await fetchProductById(item.productId);

      if (product.stock < item.quantity) {
        throw new InsufficientStockError(item.productId, product.stock, item.quantity);
      }

      return { product, item };
    })
  );
}

function calculateOrderTotal(
  validatedItems: { product: { price: number }; item: { quantity: number } }[],
  shippingCost: number
): number {
  const subtotal = validatedItems.reduce(
    (sum, { product, item }) => sum + product.price * item.quantity,
    0
  );
  return Number((subtotal + shippingCost).toFixed(2));
}

async function decrementStockForItems(
  validatedItems: { product: { id: number; stock: number }; item: { quantity: number } }[]
): Promise<void> {
  await Promise.all(
    validatedItems.map(({ product, item }) =>
      crudClient.patch(`/api/product/${product.id}/stock`, {
        stock: product.stock - item.quantity,
      })
    )
  );
}

async function recordStatusHistory(orderId: number, status: string): Promise<void> {
  await crudClient.post('/api/order-status-history', { orderId, status });
}

export const orderService = {
  placeOrder: async (input: PlaceOrderInput) => {
    const validatedItems = await validateAndFetchItems(input.items);
    const shippingCost = await fetchShippingCost(input.province);
    const total = calculateOrderTotal(validatedItems, shippingCost);
    const referenceNumber = generateReferenceNumber();
    const isCustomized = input.items.some((item) => item.customizationDetails);

    const orderResponse = await crudClient.post('/api/order', {
      referenceNumber,
      userId: input.userId,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      province: input.province,
      shippingCost,
      total,
      status: 'pending',
      isCustomized,
    });

    const order = orderResponse.data.data;

    await crudClient.post('/api/order-detail/bulk', {
      items: validatedItems.map(({ product, item }) => ({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        customizationDetails: item.customizationDetails,
      })),
    });

    await recordStatusHistory(order.id, 'pending');
    await decrementStockForItems(validatedItems);

    return order;
  },

  changeOrderStatus: async (orderId: number, newStatus: string) => {
    const orderResponse = await crudClient.get(`/api/order/${orderId}`);
    const order = orderResponse.data.data;
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[order.status] ?? [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new InvalidOrderStatusTransitionError(order.status, newStatus);
    }

    await crudClient.patch(`/api/order/${orderId}/status`, { status: newStatus });
    await recordStatusHistory(orderId, newStatus);

    return { ...order, status: newStatus };
  },

  approveCustomizedOrder: async (orderId: number) => {
    const orderResponse = await crudClient.get(`/api/order/${orderId}`);
    const order = orderResponse.data.data;

    if (!order.isCustomized) {
      throw new BusinessError(422, 'This order is not a customized order');
    }

    if (order.status !== 'pending') {
      throw new BusinessError(422, 'Only pending customized orders can be approved');
    }

    return orderService.changeOrderStatus(orderId, 'processing');
  },

  getOrderByReference: async (referenceNumber: string) => {
    const response = await crudClient.get(`/api/order/reference/${referenceNumber}`);
    return response.data.data;
  },

  getOrdersByUser: async (userId: number) => {
    const response = await crudClient.get(`/api/order/user/${userId}`);
    return response.data.data;
  },

  getAllOrders: async () => {
    const response = await crudClient.get('/api/order');
    return response.data.data;
  },
};

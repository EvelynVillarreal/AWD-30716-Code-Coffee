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
export declare const orderService: {
    placeOrder: (input: PlaceOrderInput) => Promise<any>;
    changeOrderStatus: (orderId: number, newStatus: string) => Promise<any>;
    approveCustomizedOrder: (orderId: number) => Promise<any>;
    getOrderByReference: (referenceNumber: string) => Promise<any>;
    getOrdersByUser: (userId: number) => Promise<any>;
    getAllOrders: () => Promise<any>;
};

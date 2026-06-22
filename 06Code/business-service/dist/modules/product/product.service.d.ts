export declare const productService: {
    getAllProducts: (categoryId?: number) => Promise<any>;
    getProductById: (id: number) => Promise<any>;
    createProduct: (data: unknown) => Promise<any>;
    updateProduct: (id: number, data: unknown) => Promise<any>;
    updateStock: (id: number, stock: number) => Promise<any>;
    deleteProduct: (id: number) => Promise<void>;
    getAllCategories: () => Promise<any>;
};

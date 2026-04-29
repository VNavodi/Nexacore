// API Base URL - adjust based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface ProductRequest {
  sku: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  taxType: string;
  openingStock: number;
  reorderLevel: number;
  warehouse: string;
  unitOfMeasure: string;
  customAttributes: Record<string, string>;
}

export interface ProductResponse {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  taxType: string;
  openingStock: number;
  reorderLevel: number;
  warehouse: string;
  unitOfMeasure: string;
  stockQuantity: number;
  customAttributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export class ProductAPI {
  /**
   * Create a new product
   */
  static async createProduct(data: ProductRequest): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  }

  /**
   * Update an existing product
   */
  static async updateProduct(
    id: number,
    data: ProductRequest
  ): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  }

  /**
   * Get all products
   */
  static async getAllProducts(): Promise<ProductResponse[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return response.json();
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(
    category: string
  ): Promise<ProductResponse[]> {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }

    return response.json();
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(): Promise<ProductResponse[]> {
    const response = await fetch(`${API_BASE_URL}/products/low-stock`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch low stock products");
    }

    return response.json();
  }
}

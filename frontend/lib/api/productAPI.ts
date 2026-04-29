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
  private static getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }
    return headers
  }

  private static async getErrorMessage(response: Response, fallback: string): Promise<string> {
    const text = await response.text()
    if (!text) return fallback

    try {
      const parsed = JSON.parse(text)
      if (typeof parsed?.message === "string" && parsed.message.trim()) {
        return parsed.message
      }
      return text
    } catch {
      return text
    }
  }

  /**
   * Create a new product
   */
  static async createProduct(data: ProductRequest): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return response.json()
    }

    // Backward compatibility for older backend contract
    if (response.status === 400 || response.status === 403) {
      const legacyPayload = {
        sku: data.sku,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.sellingPrice,
        stockQuantity: data.openingStock,
      }

      const retryResponse = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(legacyPayload),
      })

      if (retryResponse.ok) {
        return retryResponse.json()
      }

      const retryMessage = await this.getErrorMessage(retryResponse, "Failed to create product")
      throw new Error(retryMessage)
    }

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to create product")
      throw new Error(message)
    }

    return response.json()
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
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to update product")
      throw new Error(message)
    }

    return response.json()
  }

  /**
   * Get all products
   */
  static async getAllProducts(): Promise<ProductResponse[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to fetch products")
      throw new Error(message)
    }

    return response.json()
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Product not found")
      throw new Error(message)
    }

    return response.json()
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to delete product")
      throw new Error(message)
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
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to fetch products by category")
      throw new Error(message)
    }

    return response.json()
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(): Promise<ProductResponse[]> {
    const response = await fetch(`${API_BASE_URL}/products/low-stock`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const message = await this.getErrorMessage(response, "Failed to fetch low stock products")
      throw new Error(message)
    }

    return response.json()
  }
}

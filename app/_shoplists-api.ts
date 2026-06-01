import { apiClient } from "./_api";

export interface ShoppingListResponse {
  id: number;
  title: string;
  description?: string | null;
  owner_id: number;
  is_archived: boolean;
  created_at: string;
  updated_at?: string | null;
  items?: ListItemResponse[] | null;
}

export interface ListItemResponse {
  id: number;
  list_id: number;
  name: string;
  quantity: number;
  unit?: string | null;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface ShoppingListCreate {
  title: string;
  description?: string | null;
}

export interface ShoppingListUpdate {
  title?: string | null;
  description?: string | null;
  is_archived?: boolean | null;
}

export interface ListItemCreate {
  name: string;
  quantity?: number;
  unit?: string | null;
  is_completed?: boolean;
  position?: number;
}

export interface ListItemUpdate {
  name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  is_completed?: boolean | null;
  position?: number | null;
}

export interface PurchaseHistoryResponse {
  id: number;
  product_name: string;
  purchased_at: string;
}

export const shoplistsApi = {
  getAll() {
    return apiClient
      .get<ShoppingListResponse[]>("/lists/")
      .then((r) => r.data);
  },

  getById(id: number) {
    return apiClient
      .get<ShoppingListResponse>(`/lists/${id}`)
      .then((r) => r.data);
  },

  create(data: ShoppingListCreate) {
    return apiClient
      .post<ShoppingListResponse>("/lists/", data)
      .then((r) => r.data);
  },

  update(id: number, data: ShoppingListUpdate) {
    return apiClient
      .put<ShoppingListResponse>(`/lists/${id}`, data)
      .then((r) => r.data);
  },

  delete(id: number) {
    return apiClient.delete(`/lists/${id}`);
  },

  addItem(listId: number, data: ListItemCreate) {
    return apiClient
      .post<ListItemResponse>(`/lists/${listId}/items`, data)
      .then((r) => r.data);
  },

  updateItem(itemId: number, data: ListItemUpdate) {
    return apiClient
      .put<ListItemResponse>(`/lists/items/${itemId}`, data)
      .then((r) => r.data);
  },

  deleteItem(itemId: number) {
    return apiClient.delete(`/lists/items/${itemId}`);
  },

  async getRecommendations(listId: number): Promise<string[]> {
    const data = await apiClient
      .get<{ recommendations: string[] }>(`/recommendations/list/${listId}`)
      .then((r) => r.data);
    return data.recommendations;
  },

  async getSuggestions(q: string, limit = 5): Promise<string[]> {
    const data = await apiClient
      .get<{ suggestions: string[] }>("/search/suggestions", { params: { q, limit } })
      .then((r) => r.data);
    return data.suggestions;
  },

  getPurchaseHistory(skip = 0, limit = 50) {
    return apiClient
      .get<PurchaseHistoryResponse[]>("/purchase-history/", { params: { skip, limit } })
      .then((r) => r.data);
  },
};

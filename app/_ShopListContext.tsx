import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { shoplistsApi, ListItemResponse, ShoppingListResponse } from "./_shoplists-api";

export interface Item {
  id: number;
  listId: number;
  name: string;
  quantity: number;
  unit?: string | null;
  isCompleted: boolean;
  position: number;
  createdAt: string;
}

export interface ShopList {
  id: number;
  title: string;
  description?: string | null;
  ownerId: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string | null;
  items: Item[];
}

function toItem(res: ListItemResponse): Item {
  return {
    id: res.id,
    listId: res.list_id,
    name: res.name,
    quantity: res.quantity,
    unit: res.unit,
    isCompleted: res.is_completed,
    position: res.position,
    createdAt: res.created_at,
  };
}

function toShopList(res: ShoppingListResponse): ShopList {
  return {
    id: res.id,
    title: res.title,
    description: res.description,
    ownerId: res.owner_id,
    isArchived: res.is_archived,
    createdAt: res.created_at,
    updatedAt: res.updated_at,
    items: (res.items ?? []).map(toItem),
  };
}

interface ShopListContextType {
  shopLists: ShopList[];
  isLoading: boolean;
  addShopList: (title: string, description?: string | null) => Promise<number>;
  updateShopListTitle: (id: number, title: string) => Promise<void>;
  addItemToList: (listId: number, itemName: string) => Promise<void>;
  removeItemFromList: (listId: number, itemId: number) => Promise<void>;
  toggleItemPurchased: (listId: number, itemId: number) => Promise<void>;
  updateItemQuantity: (listId: number, itemId: number, quantity: number) => Promise<void>;
  deleteShopList: (id: number) => Promise<void>;
  getShopList: (id: number) => ShopList | undefined;
  fetchShopListById: (id: number) => Promise<ShopList | undefined>;
}

const ShopListContext = createContext<ShopListContextType | undefined>(undefined);

export const ShopListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shopLists, setShopLists] = useState<ShopList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await shoplistsApi.getAll();
        setShopLists(data.map(toShopList));
      } catch (e) {
        console.error("Failed to load shop lists", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getShopList = useCallback(
    (id: number) => shopLists.find((list) => list.id === id),
    [shopLists],
  );

  const addShopList = useCallback(async (title: string, description?: string | null) => {
    const res = await shoplistsApi.create({ title, description });
    const list = toShopList(res);
    setShopLists((prev) => [...prev, list]);
    return list.id;
  }, []);

  const updateShopListTitle = useCallback(async (id: number, title: string) => {
    await shoplistsApi.update(id, { title });
    setShopLists((prev) =>
      prev.map((list) => (list.id === id ? { ...list, title } : list)),
    );
  }, []);

  const deleteShopList = useCallback(async (id: number) => {
    await shoplistsApi.delete(id);
    setShopLists((prev) => prev.filter((list) => list.id !== id));
  }, []);

  const addItemToList = useCallback(async (listId: number, itemName: string) => {
    const res = await shoplistsApi.addItem(listId, { name: itemName, quantity: 1 });
    const item = toItem(res);
    setShopLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: [...list.items, item] } : list,
      ),
    );
  }, []);

  const removeItemFromList = useCallback(async (listId: number, itemId: number) => {
    try {
      await shoplistsApi.deleteItem(itemId);
    } catch {
      // item may already be deleted on backend
    }
    setShopLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list,
      ),
    );
  }, []);

  const toggleItemPurchased = useCallback(async (listId: number, itemId: number) => {
    const list = shopLists.find((l) => l.id === listId);
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    const newStatus = !item.isCompleted;
    await shoplistsApi.updateItem(itemId, { is_completed: newStatus });
    setShopLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.id === itemId ? { ...i, isCompleted: newStatus } : i,
              ),
            }
          : list,
      ),
    );
  }, [shopLists]);

  const updateItemQuantity = useCallback(async (listId: number, itemId: number, quantity: number) => {
    const validQuantity = Math.min(20, Math.max(1, quantity));
    await shoplistsApi.updateItem(itemId, { quantity: validQuantity });
    setShopLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: validQuantity }
                  : item,
              ),
            }
          : list,
      ),
    );
  }, []);

  const fetchShopListById = useCallback(async (id: number) => {
    try {
      const res = await shoplistsApi.getById(id);
      const list = toShopList(res);
      setShopLists((prev) =>
        prev.map((l) => (l.id === id ? list : l)),
      );
      return list;
    } catch (e) {
      console.error("Failed to fetch list", e);
      return undefined;
    }
  }, []);

  return (
    <ShopListContext.Provider
      value={{
        shopLists,
        isLoading,
        addShopList,
        updateShopListTitle,
        addItemToList,
        removeItemFromList,
        toggleItemPurchased,
        updateItemQuantity,
        deleteShopList,
        getShopList,
        fetchShopListById,
      }}
    >
      {children}
    </ShopListContext.Provider>
  );
};

export const useShopLists = () => {
  const context = useContext(ShopListContext);
  if (!context) {
    throw new Error("useShopLists must be used within a ShopListProvider");
  }
  return context;
};

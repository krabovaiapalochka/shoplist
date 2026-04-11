import React, { createContext, useContext, useState } from "react";

interface Item {
  id: string;
  name: string;
  purchased: boolean;
}

interface ShopList {
  id: string;
  title: string;
  items: Item[];
}

interface ShopListContextType {
  shopLists: ShopList[];
  addShopList: (title: string) => string;
  updateShopListTitle: (id: string, title: string) => void;
  addItemToList: (listId: string, itemName: string) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  toggleItemPurchased: (listId: string, itemId: string) => void;
  deleteShopList: (id: string) => void;
  getShopList: (id: string) => ShopList | undefined;
}

const ShopListContext = createContext<ShopListContextType | undefined>(undefined);

export const ShopListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopLists, setShopLists] = useState<ShopList[]>([
    {
      id: "1",
      title: "Список 1",
      items: [
        { id: "1", name: "Молоко", purchased: false },
        { id: "2", name: "Хлеб", purchased: true },
        { id: "3", name: "Яйца", purchased: false },
      ],
    },
  ]);

  const addShopList = (title: string) => {
    const newId = Date.now().toString();
    setShopLists([...shopLists, { id: newId, title, items: [] }]);
    return newId;
  };

  const updateShopListTitle = (id: string, title: string) => {
    setShopLists(shopLists.map(list => 
      list.id === id ? { ...list, title } : list
    ));
  };

  const addItemToList = (listId: string, itemName: string) => {
    setShopLists(shopLists.map(list => 
      list.id === listId 
        ? { ...list, items: [...list.items, { id: Date.now().toString(), name: itemName, purchased: false }] }
        : list
    ));
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setShopLists(shopLists.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const toggleItemPurchased = (listId: string, itemId: string) => {
    setShopLists(shopLists.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.map(item => 
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          ) }
        : list
    ));
  };

  const getShopList = (id: string) => shopLists.find(list => list.id === id);

  const deleteShopList = (id: string) => {
    setShopLists(shopLists.filter(list => list.id !== id));
  };

  return (
    <ShopListContext.Provider value={{
      shopLists,
      addShopList,
      updateShopListTitle,
      addItemToList,
      removeItemFromList,
      toggleItemPurchased,
      deleteShopList,
      getShopList,
    }}>
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
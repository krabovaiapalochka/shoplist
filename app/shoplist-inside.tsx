import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useShopLists } from "./ShopListContext";

const DATABASE = [
  "Апельсин", "Бананы", "Батон", "Булочки", "Гречка", "Йогурт", "Картофель", "Кефир",
  "Колбаса варёная", "Кофе", "Куриное филе", "Лук репчатый", "Макароны","Мандарин",
  "Масло сливочное", "Морковь", "Мука", "Молоко", "Пельмени", "Подсолнечное масло",
  "Рис", "Сахар", "Сметана", "Соль", "Сосиски", "Сыр твёрдый", "Творог",
  "Фарш мясной", "Хлеб белый", "Хлеб тостовый", "Хлеб чёрный", "Чай чёрный",
  "Яблоки", "Яйца",
];

export default function Index() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getShopList, updateShopListTitle, addItemToList, removeItemFromList, toggleItemPurchased, deleteShopList } = useShopLists();
  
  const shopList = id ? getShopList(id) : undefined;
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteList = () => {
    if (id) {
      deleteShopList(id);
      router.push("/list-of-shoplists");
    }
  };

  const searchHeaderIconColor = "#becc73";
  const searchHeaderTextColor = "#becc73";

  const title = shopList?.title || "Заголовок";
  const searchTitle = title === "Заголовок" ? "Список 1" : title;
  const items = shopList?.items || [];

  const filteredProducts = DATABASE.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTitleChange = (newTitle: string) => {
    if (id) {
      updateShopListTitle(id, newTitle);
    }
  };

  const handleAddItem = (productName: string) => {
    if (id) {
      addItemToList(id, productName);
      setSearchQuery("");
      setIsSearching(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (id) {
      removeItemFromList(id, itemId);
    }
  };

  const handleTogglePurchased = (itemId: string) => {
    if (id) {
      toggleItemPurchased(id, itemId);
    }
  };

  if (isSearching) {
    return (
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <TouchableOpacity 
            onPress={() => { setIsSearching(false); setSearchQuery(""); }} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={searchHeaderIconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, styles.searchTitle, { color: searchHeaderTextColor }]}>{searchTitle}</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#323e2f"//цвет поменять
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResultItem} 
                onPress={() => handleAddItem(item)}
              >
                <Text style={styles.searchResultText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.searchResultsList}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/list-of-shoplists")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#becc73" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-outline" size={24} color="#becc73" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setShowMenu(true)} activeOpacity={1}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#becc73" />
          </TouchableOpacity>

          {showMenu && (
            <View style={styles.menuOverlay}>
              <TouchableOpacity 
                style={styles.menuBackdrop} 
                onPress={() => setShowMenu(false)} 
                  activeOpacity={1}
               />
            <View style={styles.menuContainer} pointerEvents="box-none">
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={handleDeleteList} 
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#d66767" />
                    <Text style={styles.menuItemText}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </View>
      </View>

      <View style={styles.titleContainer}>
        {isEditingTitle ? (
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity 
              style={[styles.checkCircle, item.purchased && styles.checkCircleChecked]}
              onPress={() => handleTogglePurchased(item.id)}
            >
              {item.purchased && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            
            <Text style={[styles.itemText, item.purchased && styles.itemTextPurchased]}>
              {item.name}
            </Text>
            
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Список покупок пуст</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsSearching(true)}
      >
        <Ionicons name="add" size={58} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: -20,
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
    backgroundColor: "transparent",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchTitle: {
    paddingTop: 15,
    marginTop: 10,
    marginLeft: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#becc73",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#becc73",
    paddingVertical: 5,
    color: "#becc73",
  },
  listContent: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleChecked: {
    backgroundColor: "#becc73",
    borderColor: "#becc73",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemTextPurchased: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#becc73",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
   searchContainer: {
    backgroundColor: "#f4f4e6",
    marginHorizontal: 30,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    height: '60%',
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#becc73",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  searchResultsList: {
    backgroundColor: "#becc73",
    borderRadius: 20,
    padding: 5,
  },
  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#becc73",
  },
  searchResultText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c4829",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 3,
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    pointerEvents: "box-none",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "transparent",
  },
  menuItemText: {
    fontSize: 14,
    color: "#d66767",
    marginLeft: 6,
    flex: 1,
    textAlign: "left",
  },
});
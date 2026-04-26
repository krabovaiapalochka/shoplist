import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useShopLists } from "./ShopListContext";

const DATABASE = [
  "Апельсин",
  "Бананы",
  "Батон",
  "Булочки",
  "Гречка",
  "Йогурт",
  "Картофель",
  "Кефир",
  "Колбаса варёная",
  "Кофе",
  "Куриное филе",
  "Лук репчатый",
  "Макароны",
  "Мандарин",
  "Масло сливочное",
  "Морковь",
  "Мука",
  "Молоко",
  "Пельмени",
  "Подсолнечное масло",
  "Рис",
  "Сахар",
  "Сметана",
  "Соль",
  "Сосиски",
  "Сыр твёрдый",
  "Творог",
  "Фарш мясной",
  "Хлеб белый",
  "Хлеб тостовый",
  "Хлеб чёрный",
  "Чай чёрный",
  "Яблоки",
  "Яйца",
];

export default function Index() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getShopList,
    updateShopListTitle,
    addItemToList,
    removeItemFromList,
    toggleItemPurchased,
    deleteShopList,
  } = useShopLists();

  const shopList = id ? getShopList(id) : undefined;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteList = () => {
    if (id) {
      deleteShopList(id);
      router.push("/list-of-shoplists");
    }
  };

  const handleGoBack = () => {
    router.push("/list-of-shoplists");
  };

  const searchHeaderIconColor = "#8faa4f";
  const searchHeaderTextColor = "#8faa4f";

  const title = shopList?.title || "";
  const searchTitle = title === "Заголовок" ? "Список 1" : title;
  const items = shopList?.items || [];

  const filteredProducts = DATABASE.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase()),
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
            onPress={() => {
              setIsSearching(false);
              setSearchQuery("");
            }}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={searchHeaderIconColor}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.searchTitle}>{searchTitle}</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#323e2f" //цвет поменять
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
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#8faa4f" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => setShowShareModal(true)}
          >
            <Ionicons name="share-outline" size={24} color="#8faa4f" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#8faa4f" />
          </TouchableOpacity>

          {showMenu && (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  handleDeleteList();
                  setShowMenu(false);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#d66767" />
                <Text style={styles.menuItemText}>Удалить</Text>
              </TouchableOpacity>
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
              style={[
                styles.checkCircle,
                item.purchased && styles.checkCircleChecked,
              ]}
              onPress={() => handleTogglePurchased(item.id)}
            >
              {item.purchased && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.itemText,
                item.purchased && styles.itemTextPurchased,
              ]}
            >
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

      <TouchableOpacity style={styles.fab} onPress={() => setIsSearching(true)}>
        <Ionicons name="add" size={58} color="#fff" />
      </TouchableOpacity>

      {showShareModal && (
        <View style={styles.shareModalOverlay}>
          <TouchableOpacity 
            style={styles.shareModalBackdrop} 
            onPress={() => setShowShareModal(false)} 
          />
          <View style={styles.shareModalContainer}>
            <View style={styles.shareModalHeader}>
              <View style={styles.shareAppIcon}>
                <Ionicons name="basket-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.shareLink}>shoplist.app/list/{id}</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.shareDivider} />
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.shareAppsScrollContent}
            >
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="chatbubbles-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>Сообщения</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="mail-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>Почта</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="paper-plane-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="logo-vk" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>VK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="globe-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>Mail.ru</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareAppItem}>
                <View style={styles.shareAppIconLarge}>
                  <Ionicons name="at-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.shareAppName}>Gmail</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.shareCopySection}>
              <Text style={styles.shareCopyText}>Скопировать</Text>
              <Ionicons name="copy-outline" size={20} color="#666" />
            </View>
          </View>
        </View>
      )}
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
    marginBottom: 20,
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
    color: "#8faa4f",
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8faa4f",
    marginLeft: 10,
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8faa4f",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#8faa4f",
    paddingVertical: 5,
    color: "#8faa4f",
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
    backgroundColor: "#8faa4f",
    borderColor: "#8faa4f",
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
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchContainer: {
    backgroundColor: "#8faa4f",
    marginHorizontal: 30,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    height: "60%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c5d3a8",
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
    backgroundColor: "#c5d3a8",
    borderRadius: 20,
    padding: 5,
  },
  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#c5d3a8",
  },
  searchResultText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c4829",
  },
  shareModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shareModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  shareModalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  shareModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  shareAppIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  shareLink: {
    flex: 1,
    fontSize: 17,
    color: "#333",
  },
  shareAppsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  shareDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  shareAppsScrollContent: {
    paddingRight: 20,
  },
  shareAppItem: {
    alignItems: "center",
    marginRight: 25,
  },
  shareAppIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareAppName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  shareCopySection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  shareCopyText: {
    fontSize: 17,
    color: "#333",
    marginRight: 10,
  },
  menuContainer: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 101,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: "#d66767",
    marginLeft: 8,
  },
});
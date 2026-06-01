import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useShopLists } from "./_ShopListContext";
import { shoplistsApi } from "./_shoplists-api";
import * as Clipboard from "expo-clipboard";

export default function Index() {
  const router = useRouter();
  const { id: idStr } = useLocalSearchParams<{ id: string }>();
  const listId = Number(idStr);
  const {
    getShopList,
    updateShopListTitle,
    addItemToList,
    removeItemFromList,
    toggleItemPurchased,
    updateItemQuantity,
    deleteShopList,
    fetchShopListById,
  } = useShopLists();

  const shopList = idStr ? getShopList(listId) : undefined;
  const title = shopList?.title || "";
  const items = shopList?.items || [];

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-300))[0];
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (listId) {
      fetchShopListById(listId);
    }
  }, [listId]);

  useEffect(() => {
    if (listId) {
      if (items.length > 0) {
        setShowRecommendations(true);
        setIsMinimized(false);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowRecommendations(false));
      }
      shoplistsApi.getRecommendations(listId).then(setRecommendations).catch(() => {});
    }
  }, [items.length, listId]);

  useEffect(() => {
    shoplistsApi.getPurchaseHistory(0, 20).then((data) => {
      setPurchaseHistory(data.map((item) => item.product_name));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (searchQuery.trim().length > 0) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await shoplistsApi.getSuggestions(searchQuery.trim());
          setSuggestions(data ?? []);
        } catch {
          setSuggestions([]);
        }
      }, 400);
    } else {
      setSuggestions([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleDeleteList = async () => {
    if (listId) {
      await deleteShopList(listId);
      router.push("/list-of-shoplists");
    }
  };

  const handleGoBack = () => {
    router.push("/list-of-shoplists");
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`shoplist.app/list/${listId}`);
  };

  const searchHeaderIconColor = "#8faa4f";

  const handleTitleChange = async (newTitle: string) => {
    if (listId) {
      await updateShopListTitle(listId, newTitle);
    }
  };

  const handleAddItem = async (productName: string) => {
    if (listId) {
      await addItemToList(listId, productName);
    }
  };

  const handleOpenAddModal = () => {
    setAddModalVisible(true);
  };

  const handleConfirmAdd = async () => {
    if (listId && searchQuery.trim()) {
      await addItemToList(listId, searchQuery.trim());
      setAddModalVisible(false);
      setSearchQuery("");
    }
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleRemoveItem = async (itemId: number) => {
    if (listId) {
      await removeItemFromList(listId, itemId);
    }
  };

  const handleTogglePurchased = async (itemId: number) => {
    if (listId) {
      await toggleItemPurchased(listId, itemId);
    }
  };

  const handleQuantityChange = async (itemId: number, delta: number) => {
    if (listId) {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        await updateItemQuantity(listId, itemId, item.quantity + delta);
      }
    }
  };

  if (isSearching) {
    const displaySuggestions = searchQuery.trim().length > 0 ? suggestions : purchaseHistory;

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

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#323e2f"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#4a6530" />
              </TouchableOpacity>
            )}
          </View>

          {displaySuggestions.length > 0 ? (
            <FlatList
              data={displaySuggestions}
              keyExtractor={(item, idx) => String(idx)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => handleAddItem(item)}
                >
                  <Ionicons name="time-outline" size={20} color="#fff" />
                  <Text style={styles.historyItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.searchResultsList}
            />
          ) : (
            <View style={styles.searchResultsList}>
              {searchQuery.trim().length > 0 && (
                <TouchableOpacity style={styles.addItemButton} onPress={handleOpenAddModal}>
                  <Text style={styles.addItemButtonText}>Добавить товар</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <Modal
          visible={addModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCloseAddModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCloseAddModal}
          >
            <View style={styles.addModalContent}>
              <Text style={styles.addModalTitle}>{searchQuery}</Text>
              <TouchableOpacity style={styles.addModalButton} onPress={handleConfirmAdd}>
                <Text style={styles.addModalButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={[
                styles.checkCircle,
                item.isCompleted && styles.checkCircleChecked,
              ]}
              onPress={() => handleTogglePurchased(item.id)}
            >
              {item.isCompleted && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.itemText,
                item.isCompleted && styles.itemTextPurchased,
              ]}
            >
              {item.name}
            </Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, -1)}
              >
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, 1)}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Список покупок пуст</Text>
        }
        contentContainerStyle={[
          styles.listContent,
          showRecommendations && { paddingBottom: 220 },
        ]}
      />

      {showRecommendations && (
        <Animated.View
          style={[
            styles.recsOuter,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.recsContent}>
            <Text style={styles.recsTitle}>Рекомендации</Text>
            {recommendations === null ? (
              <Text style={styles.recsText}>Загрузка...</Text>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recsItem}
                  onPress={() => handleAddItem(rec)}
                >
                  <Text style={styles.recsText}>{rec}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.recsText}>Нет рекомендаций</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.recsHandle}
            onPress={() => {
              const newMinimized = !isMinimized;
              setIsMinimized(newMinimized);
              Animated.timing(slideAnim, {
                toValue: newMinimized ? -200 : 0,
                duration: 250,
                useNativeDriver: true,
              }).start();
            }}
          >
            <Ionicons
              name={isMinimized ? "chevron-forward" : "chevron-back"}
              size={20}
              color="#4a6530"
            />
          </TouchableOpacity>
        </Animated.View>
      )}

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
                <Ionicons name="basket-outline" size={25} color="#fff" />
              </View>
              <Text style={styles.shareLink}>shoplist.app/list/{listId}</Text>
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

            <TouchableOpacity style={styles.shareCopySection} onPress={handleCopyLink}>
              <Text style={styles.shareCopyText}>Скопировать</Text>
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
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
  clearButton: {
    marginLeft: 5,
  },
  searchResultsList: {
    flex: 1,
    backgroundColor: "#8faa4f",
    borderRadius: 20,
    padding: 5,
  },
  searchEmptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  addItemButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  addItemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  historyItemText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  addModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: 300,
    alignItems: "center",
  },
  addModalTitle: {
    fontSize: 20,
    color: "#4a6530",
    marginBottom: 25,
    fontWeight: "600",
    textAlign: "center",
  },
  addModalButton: {
    backgroundColor: "#8faa4f",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  addModalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
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
    height: "37%",
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
    width: 40,
    height: 40,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  recsOuter: {
    position: "absolute",
    left: 0,
    bottom: 60,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  recsContent: {
    width: 200,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4a6530",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  recsHandle: {
    width: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4a6530",
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  recsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4a6530",
  },
  recsItem: {
    paddingVertical: 2,
  },
  recsText: {
    fontSize: 14,
    color: "#4a6530",
    marginBottom: 2,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Item, ShopList, useShopLists } from "./ShopListContext";
import { useUser } from "./UserContext";

const FAB_POSITION = 35;
const maxItems = 7;

const App = () => {
  const router = useRouter();
  const { shopLists, addShopList, addItemToList, deleteShopList } = useShopLists();
  const { user } = useUser();
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [shopListToDelete, setShopListToDelete] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const [leftColHeight, setLeftColHeight] = useState(0);
  const [rightColHeight, setRightColHeight] = useState(0);

  const handleAddList = () => {
    const newListId = addShopList(`Список ${shopLists.length + 1}`, 14);
    router.push({ pathname: "/shoplist-inside", params: { id: newListId } });
  };
  const handleAddListDebug = () => {
    const newListId = addShopList(`Список ${shopLists.length + 1}`, 14);
  };

  const handleDeletePress = (id: string) => {
    setShopListToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (shopListToDelete) {
      deleteShopList(shopListToDelete);
      setShopListToDelete(null);
      setDeleteModalVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setShopListToDelete(null);
    setDeleteModalVisible(false);
  };

  const handleFabPress = () => {
    setNewListTitle(`Список ${shopLists.length + 1}`);
    setCreateModalVisible(true);
  };

  const handleCreateConfirm = () => {
    const title = newListTitle.trim() || `Список ${shopLists.length + 1}`;
    const newListId = addShopList(title, 14);
    setCreateModalVisible(false);
    router.push({ pathname: "/shoplist-inside", params: { id: newListId } });
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
  };

  const getFilteredLists = () => {
    if (!searchText.trim()) return shopLists;
    const search = searchText.toLowerCase();
    return [...shopLists].sort((a, b) => {
      const titleA = (
        a.title === "Заголовок" ? `Список ${shopLists.indexOf(a) + 1}` : a.title
      ).toLowerCase();
      const titleB = (
        b.title === "Заголовок" ? `Список ${shopLists.indexOf(b) + 1}` : b.title
      ).toLowerCase();
      const exactA = titleA === search;
      const exactB = titleB === search;
      if (exactA && !exactB) return -1;
      if (!exactA && exactB) return 1;
      if (titleA.startsWith(search) && !titleB.startsWith(search)) return -1;
      if (!titleA.startsWith(search) && titleB.startsWith(search)) return 1;
      return titleA.indexOf(search) - titleB.indexOf(search);
    });
  };

  const filteredLists = getFilteredLists();
  const distributeData = (data: Array<ShopList>) => {
    const left: Array<ShopList> = [];
    const right: Array<ShopList> = [];
    let leftH = 0;
    let rightH = 0;
    data.forEach((item) => {
      const itemWeight = item.items.slice(0, maxItems).length;
      if (leftH <= rightH) {
        left.push(item);
        leftH += itemWeight + 4; 
      } else {
        right.push(item);
        rightH += itemWeight + 4;
      }
    });
    left.reverse();
    right.reverse();
    return { left, right };
  };

  // 2. В компоненте
  const { left, right } = distributeData(filteredLists);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4e8" />

      <ImageBackground
        source={require("../assets/images/fon-background.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => router.push("/profil")}
            >
              <View style={styles.avatar}>
                <View style={styles.avatarCircle} />
                <Text style={styles.avatarText}>{user.username}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#fff"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Списки покупок</Text>

          <View style={styles.masonryContainer}>
            <View
              style={styles.masonryColumn}
              onLayout={(e) => setLeftColHeight(e.nativeEvent.layout.height)}
            >
              {left.map((shopList) => {
                const allPurchased = shopList.items.length > 0 && shopList.items.every((item: Item) => item.purchased);
                return (
                  <TouchableOpacity
                    key={shopList.id}
                    style={[styles.listCard]}
                    onPress={() =>
                      router.push({
                        pathname: "/shoplist-inside",
                        params: { id: shopList.id },
                      })
                    }
                  >
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.listTitle}>
                        {shopList.title === "Заголовок"
                          ? `Список ${filteredLists.indexOf(shopList) + 1}`
                          : shopList.title}
                      </Text>
                      {allPurchased && (
                        <TouchableOpacity onPress={() => handleDeletePress(shopList.id)}>
                          <Ionicons name="checkmark" size={24} color="#4a6530" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.itemsContainer}>
                      {shopList.items.slice(0, maxItems).map((item: Item) => (
                        <Text style={[styles.itemText, item.purchased && styles.itemTextPurchased]} key={item.id}>
                          {item.name}
                        </Text>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={styles.masonryColumn}
              onLayout={(e) => setRightColHeight(e.nativeEvent.layout.height)}
            >
              {right.map((shopList) => {
                const allPurchased = shopList.items.length > 0 && shopList.items.every((item: Item) => item.purchased);
                return (
                  <TouchableOpacity
                    key={shopList.id}
                    style={[styles.listCard]}
                    onPress={() =>
                      router.push({
                        pathname: "/shoplist-inside",
                        params: { id: shopList.id },
                      })
                    }
                  >
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.listTitle}>
                        {shopList.title === "Заголовок"
                          ? `Список ${filteredLists.indexOf(shopList) + 1}`
                          : shopList.title}
                      </Text>
                      {allPurchased && (
                        <TouchableOpacity onPress={() => handleDeletePress(shopList.id)}>
                          <Ionicons name="checkmark" size={24} color="#4a6530" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.itemsContainer}>
                      {shopList.items.slice(0, maxItems).map((item: Item) => (
                        <Text style={[styles.itemText, item.purchased && styles.itemTextPurchased]} key={item.id}>
                          {item.name}
                        </Text>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity
          style={[styles.fab, { right: FAB_POSITION }]}
          onPress={handleFabPress}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelDelete}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancelDelete}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Хотите удалить?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmDelete}
                >
                  <Text style={styles.modalButtonText}>Да</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancelDelete}
                >
                  <Text style={styles.modalButtonText}>Нет</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={createModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCreateCancel}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCreateCancel}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Название списка</Text>
                <TextInput
                  style={styles.createInput}
                  placeholder={newListTitle}
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={handleCreateConfirm} style={styles.createArrow}>
                  <Ionicons name="arrow-forward" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4e8",
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.5,
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    marginTop: 10,
  },
  avatarContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8faa4f",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#c5d3a8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 85,
    height: 95,
    backgroundColor: "#8faa4f",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 2,
  },
  searchIcon: {
    marginRight: 10,
    color: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    padding: 0,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#4a6530",
    marginBottom: 15,
    fontWeight: "500",
  },
  masonryContainer: {
    flexDirection: "row",
    gap: 10,
  },
  masonryColumn: {
    flex: 1,
    gap: 10,
  },

  listCard: {
    backgroundColor: "#c5d3a8",
    borderRadius: 15,
    padding: 15,
    width: "100%",
    minHeight: 100,
    maxHeight: 400,
  },

  listTitle: {
    fontSize: 17,
    color: "#4a6530",
    marginBottom: 10,
    fontWeight: "600",
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemsContainer: {
    alignItems: "flex-start",
  },
  itemText: {
    fontSize: 14,
    color: "#4a6530",
    marginBottom: 4,
  },
  itemTextPurchased: {
    textDecorationLine: "line-through",
    color: "#888",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
fabText: {
    fontSize: 70,
    color: "#fff",
    fontWeight: 200,
    marginTop: -10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 28,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    color: "#4a6530",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  modalButton: {
    backgroundColor: "#8faa4f",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
  },
  createInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c5d3a8",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  createInput: {
    backgroundColor: "#c5d3a8",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: "#4a6530",
    fontSize: 16,
    width: "100%",
    marginBottom: 20,
  },
  createArrow: {
    backgroundColor: "#8faa4f",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
  },
});

export default App;

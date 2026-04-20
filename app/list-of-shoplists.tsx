import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useShopLists } from "./ShopListContext";

const FAB_POSITION = 35;

const getRandomCardHeightStyle = (min = 100, max = 180) => {
  return { minHeight: Math.floor(Math.random() * max) + min };
};

const App = () => {
  const router = useRouter();
  const { shopLists, addShopList, addItemToList } = useShopLists();
  const [searchText, setSearchText] = useState("");

  const handleAddList = () => {
    const minHeight = getRandomCardHeightStyle().minHeight;
    const newListId = addShopList(`Список ${shopLists.length + 1}`, minHeight);
    router.push({ pathname: "/shoplist-inside", params: { id: newListId } });
  };
  const handleAddListDebug = () => {
    const minHeight = getRandomCardHeightStyle().minHeight;
    const newListId = addShopList(`Список ${shopLists.length + 1}`, minHeight);
  };

  const getFilteredLists = () => {
    if (!searchText.trim()) return shopLists;
    const search = searchText.toLowerCase();
    return [...shopLists].sort((a, b) => {
      const titleA = (a.title === "Заголовок" ? `Список ${shopLists.indexOf(a) + 1}` : a.title).toLowerCase();
      const titleB = (b.title === "Заголовок" ? `Список ${shopLists.indexOf(b) + 1}` : b.title).toLowerCase();
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
                <Text style={styles.avatarText}>Persi</Text>
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
            <View style={styles.masonryColumn}>
              {filteredLists
                .filter((_, i) => i % 2 === 0)
                .map((shopList, idx) => {
                  return (
                    <TouchableOpacity
                      key={shopList.id}
                      style={[
                        styles.listCard,
                        { minHeight: shopList.minHeight },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: "/shoplist-inside",
                          params: { id: shopList.id },
                        })
                      }
                    >
                      <Text style={styles.listTitle}>
                        {shopList.title === "Заголовок"
                          ? `Список ${filteredLists.indexOf(shopList) + 1}`
                          : shopList.title}
                      </Text>
                      <View style={styles.itemsContainer}>
                        {shopList.items
                          .slice(0, shopList.minHeight / 40 + 2)
                          .map((item) => (
                            <Text style={styles.itemText} key={item.id}>
                              {item.name}
                            </Text>
                          ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <View style={styles.masonryColumn}>
              {filteredLists
                .filter((_, i) => i % 2 === 1)
                .map((shopList, idx) => {
                  return (
                    <TouchableOpacity
                      key={shopList.id}
                      style={[
                        styles.listCard,
                        { minHeight: shopList.minHeight },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: "/shoplist-inside",
                          params: { id: shopList.id },
                        })
                      }
                    >
                      <Text style={styles.listTitle}>
                        {shopList.title === "Заголовок"
                          ? `Список ${filteredLists.indexOf(shopList) + 1}`
                          : shopList.title}
                      </Text>
                      <View style={styles.itemsContainer}>
                        {shopList.items
                          .slice(0, shopList.minHeight / 40 + 2)
                          .map((item) => (
                            <Text style={styles.itemText} key={item.id}>
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

        <TouchableOpacity style={[styles.fab, { right: FAB_POSITION }]} onPress={handleAddListDebug}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
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
  },
  cardShort: {
    minHeight: 100,
  },
  cardMedium: {
    minHeight: 150,
  },
  cardTall: {
    minHeight: 200,
  },
  listTitle: {
    fontSize: 17,
    color: "#4a6530",
    marginBottom: 10,
    fontWeight: "600",
  },
  itemsContainer: {
    alignItems: "flex-start",
  },
  itemText: {
    fontSize: 14,
    color: "#4a6530",
    marginBottom: 4,
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
    fontWeight: "200",
    marginTop: -10,
  },
});

export default App;

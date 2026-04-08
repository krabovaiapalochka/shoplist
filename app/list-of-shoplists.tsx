import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useShopLists } from './ShopListContext';

const App = () => {
  const router = useRouter();
  const { shopLists } = useShopLists();
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4e8" />
      
      <ImageBackground
        source={require("../assets/images/fon-background.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push("/profil")}>
              <View style={styles.avatar}>
                <View style={styles.avatarCircle} />
                <Text style={styles.avatarText}>Persi</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
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

          {shopLists.map((shopList, index) => (
            <TouchableOpacity 
              key={shopList.id}
              style={styles.listCard} 
              onPress={() => router.push({ pathname: '/shoplist-inside', params: { id: shopList.id } })}
            >
              <Text style={styles.listTitle}>{shopList.title === "Заголовок" ? `Список ${index + 1}` : shopList.title}</Text>
              
              <View style={styles.itemsContainer}>
                {shopList.items.slice(0, 3).map((item) => (
                  <Text style={styles.itemText} key={item.id}>
                    {item.name}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4e8',
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.5,
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    marginTop: 10,
  },
  avatarContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#becc73',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#E3E8C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 85,
    height: 95,
    backgroundColor: '#becc73',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  searchIcon: {
    marginRight: 10,
    color: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 0,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#5a7a3a',
    marginBottom: 15,
    fontWeight: '500',
  },
  listCard: {
    backgroundColor: '#E3E8C2',
    borderRadius: 15,
    padding: 15,
    width: 180,
    height: 160,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 17,
    color: '#5a7a3a',
    marginBottom: 10,
    fontWeight: '600',
  },
  itemsContainer: {
    alignItems: 'flex-start',
  },
  itemText: {
    fontSize: 14,
    color: '#5a7a3a',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    right: 35,
    bottom: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#becc73',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    fontSize: 70,
    color: '#fff',
    fontWeight: '200',
    marginTop: -9,
  },
});

export default App;
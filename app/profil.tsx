import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "./_UserContext";
import { API_BASE_URL } from "./_api";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar, deleteAvatar, logout } = useUser();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? "");
      setPhone(user.phone ?? "");
      setEmail(user.email ?? "");
      setBirthDate(user.birth_date ?? "");
    }
  }, [user]);

  const handleAvatarPress = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  const handleChangePhoto = () => {
    setShowAvatarMenu(false);
    setPhotoModalVisible(true);
  };

  const handleDeletePhoto = () => {
    setShowAvatarMenu(false);
    setDeleteModalVisible(true);
  };

  const handleConfirmDeletePhoto = async () => {
    setDeleteModalVisible(false);
    try {
      await deleteAvatar();
    } catch {
      Alert.alert("Ошибка", "Не удалось удалить фото");
    }
  };

  const handleSelectFromGallery = async () => {
    setPhotoModalVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Ошибка", "Нет доступа к галерее");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        await uploadAvatar(result.assets[0].uri);
      } catch {
        Alert.alert("Ошибка", "Не удалось загрузить фото");
      }
    }
  };

  const handleTakePhoto = async () => {
    setPhotoModalVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Ошибка", "Нет доступа к камере");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        await uploadAvatar(result.assets[0].uri);
      } catch {
        Alert.alert("Ошибка", "Не удалось загрузить фото");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        username: username.trim() || undefined,
        phone: phone.trim() || null,
        email: email.trim() || undefined,
        birth_date: birthDate.trim() || null,
      });
      setIsEditing(false);
    } catch (e: any) {
      const message = e.response?.data?.detail || "Ошибка сохранения";
      Alert.alert("Ошибка", message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace("/login");
  };

  const avatarSource = user?.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : `${API_BASE_URL}${user.avatar_url}`
    : null;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#8faa4f" style={{ marginTop: 300 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#d8e0cc" />

      <ImageBackground
        source={require("../assets/images/fon-background.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.greenRectangle} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#5a7a3a" />
        </TouchableOpacity>

        <View style={styles.card}>
          {isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#5a7a3a" />
              ) : (
                <Ionicons name="checkmark" size={24} color="#5a7a3a" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color="#5a7a3a" />
            </TouchableOpacity>
          )}

          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatar} onPress={handleAvatarPress} activeOpacity={0.7}>
              {avatarSource ? (
                <Image source={{ uri: avatarSource }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={50} color="#fff" />
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {showAvatarMenu && (
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleChangePhoto}
                >
                  <Text style={styles.menuItemText}>Изменить фото</Text>
                  <Ionicons name="create-outline" size={20} color="#5a7a3a" />
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleDeletePhoto}
                >
                  <Text style={[styles.menuItemText, styles.deleteText]}>Удалить фото</Text>
                  <Ionicons name="trash-outline" size={20} color="#d66767" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor="rgba(90, 122, 58, 0.5)"
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.username}>{user.username || "username"}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Номер тел."
              placeholderTextColor="#4a6530"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={isEditing}
            />

            <TextInput
              style={styles.inputField}
              placeholder="Эл.почта"
              placeholderTextColor="#4a6530"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
            />

            <TextInput
              style={styles.inputField}
              placeholder="Дата рожд."
              placeholderTextColor="#4a6530"
              value={birthDate}
              onChangeText={setBirthDate}
              editable={isEditing}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.exitButton} onPress={handleLogout}>
          <Text style={styles.exitText}>Выйти</Text>
        </TouchableOpacity>

        <Modal
          visible={photoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPhotoModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPhotoModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Изменить фото</Text>
              <TouchableOpacity
                style={styles.photoModalButton}
                onPress={handleSelectFromGallery}
              >
                <Ionicons name="images-outline" size={22} color="#4a6530" />
                <Text style={styles.photoModalButtonText}>Выбрать из галереи</Text>
              </TouchableOpacity>
              <View style={styles.buttonDivider} />
              <TouchableOpacity
                style={styles.photoModalButton}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera-outline" size={22} color="#4a6530" />
                <Text style={styles.photoModalButtonText}>Сделать фото</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonCenter}
                onPress={() => setPhotoModalVisible(false)}
              >
                <Text style={styles.cancelButtonCenterText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Удалить фото</Text>
              <Text style={styles.modalSubtitle}>Вы уверены, что хотите удалить фото?</Text>
              <View style={styles.deleteButtonsRow}>
                <TouchableOpacity
                  style={styles.deleteModalButton}
                  onPress={handleConfirmDeletePhoto}
                >
                  <Text style={styles.deleteModalButtonText}>Удалить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteModalCancelButton}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.deleteModalCancelButtonText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={logoutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setLogoutModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Вы точно хотите выйти из аккаунта?</Text>
              <View style={styles.deleteButtonsRow}>
                <TouchableOpacity
                  style={styles.deleteModalButton}
                  onPress={confirmLogout}
                >
                  <Text style={styles.deleteModalButtonText}>Да</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteModalCancelButton}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={styles.deleteModalCancelButtonText}>Нет</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.5,
    resizeMode: 'cover',
  },
  greenRectangle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#8faa4f",
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#c5d3a8",
    width: "90%",
    height: "51%",
    alignSelf: "center",
    borderRadius: 30,
    marginTop: 200,
    zIndex: 2,
    paddingBottom: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  editButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 2,
  },
  avatarContainer: {
    marginTop: -60,
    zIndex: 2,
    marginBottom: 10,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 90,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#f0f3d6",
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 90,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#8faa4f",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#c5d3a8",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5a7a3a",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    paddingVertical: 5,
    minWidth: 150,
    textAlign: "center",
    height: 40,
  },
  usernameInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5a7a3a",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#5a7a3a",
    paddingVertical: 5,
    minWidth: 150,
    textAlign: "center",
    height: 40,
  },
  inputContainer: {
    width: "85%",
    gap: 15,
  },
  inputField: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#5a7a3a",
    fontSize: 16,
    fontWeight: "600",
  },
  exitButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 150,
    zIndex: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exitText: {
    color: "#b84545",
    fontSize: 16,
    fontWeight: "600",
  },
  menuContainer: {
    position: "absolute",
    top: 165,
    left: -17,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 10,
    minWidth: 200,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  deleteText: {
    color: "#d66767",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: 330,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "#4a6530",
    marginBottom: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  photoModalButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonDivider: {
    height: 1,
    backgroundColor: "#4a6530",
    width: "100%",
    marginVertical: 5,
  },
  photoModalButtonText: {
    color: "#4a6530",
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 10,
  },
  cancelButtonCenter: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4a6530",
    paddingVertical: 9,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  cancelButtonCenterText: {
    color: "#4a6530",
    fontSize: 16,
    fontWeight: 600,
  },
  deleteModalButton: {
    backgroundColor: "#4a6530",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "45%",
    marginRight: 5,
  },
  deleteModalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  deleteModalCancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4a6530",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "45%",
    marginLeft: 5,
  },
  deleteModalCancelButtonText: {
    color: "#4a6530",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  deleteButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});

import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput,
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("IGGY");
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

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
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={24} color="#5a7a3a" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={50} color="#fff" />
            </View>
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
              <Text style={styles.username}>{username || "username"}</Text>
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
            />
            
            <TextInput
              style={styles.inputField}
              placeholder="Эл.почта"
              placeholderTextColor="#4a6530"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.inputField}
              placeholder="Дата рожд."
              placeholderTextColor="#4a6530"
              value={birthday}
              onChangeText={setBirthday}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitText}>Выйти</Text>
        </TouchableOpacity>
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
});

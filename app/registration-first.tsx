import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const handleLogin = () => {
    router.push("/list-of-shoplists");
  };

  const handleRegistration = () => {
    router.push("/registration-first");
  };
  
  return (
    <ImageBackground 
      source={require("../assets/images/fon-background.png")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Регистрация</Text>
        
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Почта\номер тел."
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
          />
          <Ionicons name="person-outline" size={22} color="#fff" style={styles.usernameIcon} />
        </View>
        
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#fff"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIconContainer}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color="#fff" 
              style={styles.passwordIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingTop: 330,
    paddingRight: 0,
  },
  title: {
    fontSize: 50,
    marginBottom: 40,
    alignSelf: "flex-start",
    marginLeft: 20,
    color: "#5a7a3a",
    fontWeight: "400", 
  },
  inputContainer: {
    width: "85%",
    height: 60,
    backgroundColor: "#8faa4f",
    borderRadius: 27,
    marginBottom: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emailInputContainer: {
    width: "70%",
    height: 80,
    backgroundColor: "#8faa4f",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 37,
    borderBottomRightRadius: 37,
    marginBottom: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  passwordInputContainer: {
    width: "60%",
    height: 80,
    backgroundColor: "#8faa4f",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 37,
    borderBottomRightRadius: 37,
    marginBottom: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
    fontSize: 17,
  },
  usernameIcon: {
    position: "absolute",
    right: 20,
    width: 30,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordIconContainer: {
    position: "absolute",
    right: 8,
    width: 50,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordIcon: {
    width: 30,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
    alignSelf: "flex-end",     
    marginRight: 40,           
  },
  buttonText: {
    fontSize: 50,
    height: 87,
    color: "white",
    fontWeight: "bold",
    marginTop: -5,
  },
});
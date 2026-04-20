import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <ImageBackground 
      source={require("../assets/images/fon-background.png")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Смена пароля</Text>
        
        <View style={styles.newPasswordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Новый пароль"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
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

        <View style={styles.confirmPasswordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Подтверждение пароля"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordIconContainer}>
            <Ionicons 
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color="#fff" 
              style={styles.passwordIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            console.log("Password:", password);
            console.log("Confirm Password:", confirmPassword);
            
            if (password !== confirmPassword) {
              alert("Пароли не совпадают!");
              return;
            }
            
            console.log("Пароли совпадают, отправляем...");
          }}
        >
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
    paddingTop: 350,
    paddingRight: 0,
  },
  title: {
    fontSize: 40,
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
    justifyContent: "space-between",
  },
  newPasswordInputContainer: {
    width: "75%",
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
    justifyContent: "space-between",
  },
  confirmPasswordInputContainer: {
    width: "65%",
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
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
    fontSize: 16,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 30,
    color: "#a4b05d",
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
});
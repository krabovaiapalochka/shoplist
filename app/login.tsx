import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
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
  
  const handleForgotPassword = () => {
    router.push("/restor-pass");
  };
  
  return (
    <ImageBackground 
      source={require("../assets/images/fon-background.png")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Логин</Text>
        
        <View style={styles.usernameInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Имя пользователя"
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
        
        <View style={styles.forgotContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkForgot}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleRegistration}>
          <Text style={styles.linkRegistration}>Регистрация</Text>
        </TouchableOpacity>
        
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
    paddingLeft: 0,
    paddingRight: 30,
  },
  title: {
    fontSize: 50,
    marginBottom: 40,
    alignSelf: "flex-start",
    marginLeft: 20,
    color: "#5a7a3a",
    fontWeight: "400", 
  },
  usernameInputContainer: {
    width: "75%",
    height: 80,
    backgroundColor: "#8faa4f",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 37,
    borderBottomRightRadius: 37,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  passwordInputContainer: {
    width: "65%",
    height: 80,
    backgroundColor: "#8faa4f",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 37,
    borderBottomRightRadius: 37,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 0,
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
  linkForgot: {
    color: "#c5d3a8",
    fontSize: 14,               
    marginBottom: 15,            
    alignSelf: "flex-end",      
  },
  forgotContainer: {
    width: "100%",
    alignItems: "center",
  },
  linkRegistration: {
    color: "#5a7a3a",
    fontSize: 20,
    marginBottom: 20,
    width: "100%",          
    textAlign: "left",      
    paddingHorizontal: 6,   
    fontWeight: "400", 
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8faa4f",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",     
    marginRight: 0,           
  },
  buttonText: {
    fontSize: 56,
    height: 94,
    color: "white",
    fontWeight: "bold",
    marginTop: -5,
  },
});
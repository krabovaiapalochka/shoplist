import { useState, useRef, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "./_auth";

const RESEND_SECONDS = 60;

export default function RestorPass() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setSecondsLeft(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Ошибка", "Введите почту");
      return;
    }
    setSending(true);
    try {
      await authApi.requestPasswordReset(email.trim());
      startResendTimer();
      Alert.alert("Готово", "Код для восстановления отправлен на вашу почту");
    } catch (e: any) {
      const message = e.response?.data?.detail || "Не удалось отправить код. Проверьте почту и соединение";
      Alert.alert("Ошибка", message);
    } finally {
      setSending(false);
    }
  };

  const handleContinue = () => {
    if (!email.trim()) {
      Alert.alert("Ошибка", "Введите почту");
      return;
    }
    if (!code.trim()) {
      Alert.alert("Ошибка", "Введите код из письма");
      return;
    }
    router.push({ pathname: "/new-pass", params: { token: code.trim(), email: email.trim() } });
  };

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
        
        <Text style={styles.title}>Восстановление пароля</Text>
        
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Почта\номер тел."
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            secureTextEntry={false}
            autoCapitalize="none"
          />
          <Ionicons name="person-outline" size={22} color="#fff" style={styles.usernameIcon} />
        </View>

        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Код"
            placeholderTextColor="#fff"
            value={code}
            onChangeText={setCode}
            secureTextEntry={!showCode}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowCode(!showCode)} style={styles.passwordIconContainer}>
            <Ionicons 
              name={showCode ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color="#fff" 
              style={styles.passwordIcon} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleSendCode}
          disabled={sending || secondsLeft > 0}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resendButtonText}>
              {secondsLeft > 0 ? `Отправить снова через ${secondsLeft} сек` : "Отправить код"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
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
    paddingTop: 300,
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
  codeInputContainer: {
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
  resendButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    marginLeft: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resendButtonText: {
    fontSize: 15,
    color: "#5a7a3a",
    fontWeight: "500",
  },
});
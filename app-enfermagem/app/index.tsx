import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const userType = usuario.toLowerCase() as
      | "estagiario"
      | "supervisor"
      | "coordenador";

    const validUsers = {
      estagiario: 1,
      supervisor: 2,
      coordenador: 3,
    };

    const idProfissio = validUsers[userType];

    const loginValido = senha === "123" && idProfissio;

    if (loginValido) {
      router.push({
        pathname: "/pacientes",
        params: {
          userType,
          idProfissio: idProfissio.toString(), // o Expo Router envia como string
        },
      });
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/login-illustration.png")}
            style={styles.image}
          />

          <Text style={styles.title}>Sistema de Enfermagem</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Usuário (estagiario, supervisor, coordenador)"
              placeholderTextColor="#888"
              onChangeText={setUsuario}
              value={usuario}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={setSenha}
              value={senha}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7FCEB", // verde clarinho
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 130,
    height: 130,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    color: "#005F3C",
    fontWeight: "bold",
    marginBottom: 32,
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#005F3C",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

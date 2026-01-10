import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import colors from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email.trim(), senha);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <View style={styles.header}>
          <Text style={styles.title}>Blog Escolar</Text>
          <Text style={styles.subtitle}>Acesso para docentes e estudantes</Text>
        </View>
        <View style={styles.card}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="professor@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <AppInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Sua senha"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
          <AppButton title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
});

export default LoginScreen;

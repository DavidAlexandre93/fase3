import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import colors from "../theme/colors";
import { registerUser } from "../services/auth";
import { fetchUser, updateUser } from "../services/users";
import type { UserRole } from "../types";
import { useAuth } from "../contexts/AuthContext";

const UserFormScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { mode, role, userId } = route.params;
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "professor") {
      Alert.alert("Acesso restrito", "Apenas professores podem gerenciar usuários.");
      navigation.navigate("Main");
    }
  }, [navigation, user]);

  useEffect(() => {
    if (mode === "edit" && userId) {
      fetchUser(userId).then((user) => {
        setNome(user.nome);
        setEmail(user.email);
      });
    }
  }, [mode, userId]);

  if (!user || user.role !== "professor") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Acesso restrito</Text>
        <Text>Somente professores podem cadastrar ou editar usuários.</Text>
      </ScrollView>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === "edit" && userId) {
        await updateUser(userId, { nome, email, role, senha: senha || undefined });
        Alert.alert("Sucesso", "Usuário atualizado com sucesso.");
      } else {
        await registerUser({ nome, email, senha, role: role as UserRole });
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso.");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>
        {mode === "edit"
          ? `Editar ${role === "professor" ? "professor" : "aluno"}`
          : `Novo ${role === "professor" ? "professor" : "aluno"}`}
      </Text>
      <View style={styles.card}>
        <AppInput label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" />
        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        <AppInput
          label={mode === "edit" ? "Nova senha (opcional)" : "Senha"}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />
        <AppButton title={loading ? "Salvando..." : "Salvar"} onPress={handleSubmit} disabled={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
});

export default UserFormScreen;

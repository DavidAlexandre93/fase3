import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import colors from "../theme/colors";
import { createPost, fetchPost, updatePost } from "../services/posts";
import { useAuth } from "../contexts/AuthContext";

const PostFormScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { mode, postId } = route.params || { mode: "create" };
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [area, setArea] = useState("");
  const [autoria, setAutoria] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "professor") {
      Alert.alert("Acesso restrito", "Apenas professores podem criar ou editar postagens.");
      navigation.navigate("Main");
      return;
    }
    if (mode === "edit" && postId) {
      fetchPost(postId).then((post) => {
        setTitulo(post.titulo);
        setConteudo(post.conteudo);
        setArea(post.areaDoConhecimento || "");
        setAutoria(post.autoria || "");
      });
    }
  }, [mode, navigation, postId, user]);

  useEffect(() => {
    if (mode === "create" && user?.nome && !autoria) {
      setAutoria(user.nome);
    }
  }, [mode, user?.nome, autoria]);

  if (!user || user.role !== "professor") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>Acesso restrito</Text>
        <Text>Somente professores podem criar ou editar postagens.</Text>
      </ScrollView>
    );
  }

  const handleSubmit = async () => {
    if (!user || user.role !== "professor") return;
    setLoading(true);
    try {
      const payload = {
        titulo,
        conteudo,
        autoria: autoria || user.nome,
        areaDoConhecimento: area || undefined,
      };
      if (mode === "edit" && postId) {
        await updatePost(postId, payload);
        Alert.alert("Sucesso", "Post atualizado com sucesso.");
      } else {
        await createPost(payload);
        Alert.alert("Sucesso", "Post criado com sucesso.");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a postagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>{mode === "edit" ? "Editar Postagem" : "Nova Postagem"}</Text>
      <View style={styles.card}>
        <AppInput label="Título" value={titulo} onChangeText={setTitulo} placeholder="Digite o título" />
        <AppInput label="Autor" value={autoria} onChangeText={setAutoria} placeholder="Nome do autor" />
        <AppInput
          label="Área do conhecimento"
          value={area}
          onChangeText={setArea}
          placeholder="Ex.: Ciências da Natureza"
        />
        <AppInput
          label="Conteúdo"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          placeholder="Escreva o conteúdo da postagem"
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

export default PostFormScreen;

import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
// Importamos novamente nossa instância do Supabase.
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function ProductManagementScreen() {
  // Estados para cada campo do formulário. Cada um controla um TextInput.
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Função utilitária para limpar todos os campos do formulário e fechar o teclado.
  const clearForm = () => {
    setProductId("");
    setTitle("");
    setPrice("");
    setDescription("");
    setImage("");
    Keyboard.dismiss();
  };
  // Função para ADICIONAR um novo produto. Corresponde ao "INSERT".
  const handleAddProduct = async () => {
    if (!title || !price || !description || !image) {
      Alert.alert("Atenção", "Preencha todos os campos para adicionar um produto.");
      return;
    }

    const priceNum = parseFloat(price);
    if (!isFinite(priceNum)) {
      Alert.alert("Atenção", "Preço inválido.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").insert([
        { title, price: priceNum, description, category: "app-add", image },
      ]).select();

      if (error) throw error;

      Alert.alert("Sucesso", "Produto adicionado!", [{ text: "OK" }]);
      clearForm();
    } catch (err: any) {
      console.error("Erro ao adicionar produto:", err.message || err);
      if ((err.message || "").includes("Could not find the table")) {
        Alert.alert(
          "Erro",
          "Tabela 'products' não encontrada no Supabase. Crie a tabela ou verifique o nome da tabela no código."
        );
      } else if ((err.message || "").includes("permission")) {
        Alert.alert(
          "Permissão negada",
          "Verifique as políticas RLS no Supabase ou as chaves usadas no cliente."
        );
      } else {
        Alert.alert("Erro", err.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    const updateObject: {
      title?: string;
      price?: number;
      description?: string;
      image?: string;
    } = {};
    if (title) updateObject.title = title;
    if (price) updateObject.price = parseFloat(price);
    if (description) updateObject.description = description;
    if (image) updateObject.image = image;
    if (Object.keys(updateObject).length === 0) {
      Alert.alert("Atenção", "Preencha pelo menos um campo para atualizar.");
      return;
    }

    const idNum = parseInt(productId, 10);
    if (!idNum) {
      Alert.alert("Atenção", "ID do produto inválido para atualização.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .update(updateObject)
        .eq("id", idNum)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert("Aviso", "Nenhum produto encontrado com esse ID.");
      } else {
        Alert.alert("Sucesso", "Produto atualizado!");
        clearForm();
      }
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err.message || err);
      if ((err.message || "").includes("Could not find the table")) {
        Alert.alert(
          "Erro",
          "Tabela 'products' não encontrada no Supabase. Crie a tabela ou verifique o nome da tabela no código."
        );
      } else {
        Alert.alert("Erro", err.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para DELETAR um produto. Corresponde ao "DELETE".
  const handleDeleteProduct = async () => {
    const idNum = parseInt(productId, 10);
    if (!idNum) {
      Alert.alert("Atenção", "Insira um ID válido do produto para deletar.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", idNum)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert("Aviso", "Nenhum produto encontrado com esse ID.");
      } else {
        Alert.alert("Sucesso", "Produto deletado!");
        clearForm();
      }
    } catch (err: any) {
      console.error("Erro ao deletar produto:", err.message || err);
      if ((err.message || "").includes("Could not find the table")) {
        Alert.alert(
          "Erro",
          "Tabela 'products' não encontrada no Supabase. Crie a tabela ou verifique o nome da tabela no código."
        );
      } else {
        Alert.alert("Erro", err.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  function handleBack() {
    router.navigate("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>TECHMARKET</Text>
        <Text style={styles.subtitle}>Seu E-commerce Simplificado</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Gerenciar Produtos</Text>
        {/* Cada TextInput está ligado a uma variável de estado e a sua função de atualização. */}
        <TextInput
          style={styles.input}
          placeholder="ID do Produto (para Editar/Deletar)"
          value={productId}
          onChangeText={setProductId}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Título do Produto"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Preco"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Descricão"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="URL da Imagem do Produto"
          value={image}
          onChangeText={setImage}
          keyboardType="url"
          autoCapitalize="none"
        />
        <View style={styles.buttonContainer}>
          {/* Cada botão chama a função de manipulação de dados correspondente. */}
          <Pressable
            onPress={handleAddProduct}
            style={[styles.button, styles.clientButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Adicionar Produto (INSERT)</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleUpdateProduct}
            style={[styles.button, styles.adminButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Atualizar Produto (UPDATE)</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleDeleteProduct}
            style={[styles.button, styles.dangerButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Deletar Produto (DELETE)</Text>
            )}
          </Pressable>

          <Pressable
            onPress={clearForm}
            style={[styles.button, styles.clearButton, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: '#333' }]}>Limpar Formulário</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  form: { padding: 20, flexGrow: 1 },
  headerContainer: {
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#264653'
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: { marginTop: 10, gap: 10 },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientButton: {
    backgroundColor: '#264653',
  },
  adminButton: {
    backgroundColor: '#e9c46a',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

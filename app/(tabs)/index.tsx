import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
// Importação do cliente Supabase
import { supabase } from "@/lib/supabase";

export default function AccessScreen() {
  // Estado para o Nome de Usuário (Nome)
  const [adminUsername, setAdminUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClientAccess = () => {
    router.replace("/products");
  };

  // Função assíncrona para realizar o login consultando a tabela de credenciais
  const handleAdminLogin = async () => {
    if (!adminUsername || !senha) {
      Alert.alert("Erro", "Por favor, preencha o Nome de Usuário e a Senha.");
      return;
    }

    setLoading(true);

    try {
     
      const { data, error } = await supabase
        .from("usersadmin") // <--- CERTIFIQUE-SE DE QUE ESTE NOME DE TABELA ESTÁ CORRETO!
        .select("name")
        .eq("name", adminUsername) //
        .eq("senha", senha) // Consulta a senha em texto simples
        .maybeSingle(); // Espera 0 ou 1 resultado

      if (error) throw error;

      if (data) {
        // Sucesso: Credenciais encontradas
        router.replace("../explore");
      } else {
        // Falha: Nenhum registro encontrado
        Alert.alert("Erro de Acesso", "Nome de usuário ou senha incorretos.");
      }
    } catch (err: any) {
      console.error("Erro de Consulta de Login:", err.message);
      Alert.alert("Erro", "Não foi possível conectar ao banco de dados.");
    } finally {
      setLoading(false);
      setSenha("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Configuração do Header */}
      <Stack.Screen options={{ title: "Bem-vindo(a)", headerShown: false }} />

      {/* Logo/Título da Loja */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>TECHMARKET</Text>
        <Text style={styles.subtitle}>Seu E-commerce Simplificado</Text>
      </View>

      {/* --- Opções de Navegação --- */}

      {/* Opção 1: Entrar como Cliente */}
      <Pressable
        onPress={handleClientAccess}
        style={[styles.button, styles.clientButton]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>🛍️ Entrar como Cliente</Text>
      </Pressable>

      {/* Opção 2: Área Administrativa (Toggle/Input) */}
      <Pressable
        onPress={() => setShowAdminInput(!showAdminInput)}
        style={styles.adminToggle}
        disabled={loading}
      >
        <Text style={styles.adminToggleText}>⚙️ Área Administrativa</Text>
      </Pressable>

      {/* Formulário de Login Admin */}
      {showAdminInput && (
        <View style={styles.adminContainer}>
          {/* Input para o Nome de Usuário */}
          <TextInput
            value={adminUsername}
            onChangeText={setAdminUsername}
            placeholder="Nome de Usuário"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="default"
            editable={!loading}
          />

          {/* Input para a Senha */}
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Senha de Acesso"
            secureTextEntry
            style={styles.input}
            editable={!loading}
            onSubmitEditing={handleAdminLogin}
          />
          <Pressable
            onPress={handleAdminLogin}
            style={[styles.button, styles.adminButton]}
            disabled={loading}
          >
            {/* Renderiza o spinner ou o texto do botão */}
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Acessar</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

// --- Estilos (Sem alterações) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#2a9d8f",
  },
  subtitle: {
    fontSize: 18,
    color: "#6c757d",
    marginTop: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },

  clientButton: {
        backgroundColor: '#264653', // Cor escura (anteriormente do admin)
    },
    
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    adminToggle: {
        marginTop: 20,
        marginBottom: 10,
        padding: 10,
    },
    adminToggleText: {
        fontSize: 16,
        color: '#264653', 
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    adminContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    
    // Botão Admin (AGORA MAIS CLARO)
    adminButton: {
        backgroundColor: '#e9c46a', // Cor clara (anteriormente do cliente)
        marginBottom: 0,
    },
});

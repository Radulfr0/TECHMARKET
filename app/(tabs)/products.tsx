import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (dbError) throw dbError;

      setProducts(data || []);
      setError(null);
    } catch (err: any) {
      setError('Ocorreu um erro ao buscar os produtos.');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>TECHMARKET</Text>
        <Text style={styles.subtitle}>Seu E-commerce Simplificado</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />

            <View style={styles.infoContainer}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.id}- {item.title}
              </Text>
              <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.productPrice}>R$ {Number(item.price).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },

  headerContainer: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  errorText: { color: 'red', fontSize: 16 },

  listContent: { paddingBottom: 30 },

  productContainer: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2a9d8f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productImage: {
    width: 96,
    height: 96,
    resizeMode: 'cover',
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0'
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#264653'
  },

  productDescription: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 6,
  },

  productPrice: {
    fontSize: 16,
    color: '#2a9d8f',
    marginTop: 8,
    fontWeight: '700'
  },
});
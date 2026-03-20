import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

interface HelloData {
  message: string;
  timestamp: string;
}

const HelloConnect = () => {
  const [data, setData] = useState<HelloData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/hello`);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data from API:', err);
        setError('Error al conectar con el backend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Conexión</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.successBox}>
          <Text style={styles.message}>{data?.message}</Text>
          {data?.timestamp && (
            <Text style={styles.timestamp}>
              Hora del servidor: {new Date(data.timestamp).toLocaleTimeString()}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  successBox: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
  },
});

export default HelloConnect;

import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../../services/api.service';
import HelloConnect from '../../components/HelloConnect';

export default function Home() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const testConnection = async () => {
    setConnectionStatus('loading');
    setErrorMessage(null);
    try {
      const isConnected = await apiService.checkConnection();
      if (isConnected) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setErrorMessage('No se pudo establecer conexión con el backend.');
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Error desconocido al conectar.');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        App QR ya está funcionando
      </Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Estado del Backend:</Text>
        {connectionStatus === 'loading' && <ActivityIndicator size="small" color="#007AFF" />}
        {connectionStatus === 'success' && (
          <Text style={[styles.statusText, { color: '#4CD964' }]}>Conectado</Text>
        )}
        {connectionStatus === 'error' && (
          <View>
            <Text style={[styles.statusText, { color: '#FF3B30' }]}>Error</Text>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={testConnection}
        disabled={connectionStatus === 'loading'}
      >
        <Text style={styles.buttonText}>Reintentar Conexión</Text>
      </TouchableOpacity>

      <HelloConnect />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  profileButton: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

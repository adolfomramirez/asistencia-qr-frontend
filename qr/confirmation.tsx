import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { success, message } = useLocalSearchParams<{ success: string; message: string }>();

  const isSuccess = success === "true";

  return (
    <View style={styles.container}>
      <Text style={isSuccess ? styles.success : styles.error}>
        {message || (isSuccess ? "Asistencia registrada correctamente" : "No se pudo registrar asistencia")}
      </Text>
      <Button title="Volver a escanear" onPress={() => router.push("/qr/scanner")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  success: { color: 'green', fontSize: 18, marginBottom: 20 },
  error: { color: 'red', fontSize: 18, marginBottom: 20 },
});

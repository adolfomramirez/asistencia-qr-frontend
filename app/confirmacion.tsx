import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  success: boolean;
  message?: string;
};

export default function Confirmacion({ success, message }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, success ? styles.success : styles.error]}>
        {success ? "✔️" : "❌"}
      </Text>
      <Text style={styles.title}>
        {success ? "Asistencia registrada con éxito" : "Error al registrar asistencia"}
      </Text>
      {message && <Text style={styles.message}>{message}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.buttonText}>
          {success ? "Volver al inicio" : "Intentar nuevamente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  icon: { fontSize: 60, marginBottom: 20 },
  success: { color: "green" },
  error: { color: "red" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getToken, login } from "../services/authService";

const DEMO_EMAIL = "ana@davinci.edu";
const DEMO_PASSWORD = "alumno123";

export default function LoginScreen() {
  const token = getToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

 const handleLogin = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await login(email, password);
    console.log("Sesión iniciada:", res);
    router.replace("/(tabs)");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const isDisabled = !email || !password || loading;

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.logo}>🎓 Universidad Da Vinci</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isDisabled}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
        </TouchableOpacity>

        <Text style={styles.forgot}>¿Olvidaste contraseña?</Text>
      </View>

      <Text style={styles.demoHint}>
        Demo: correo <Text selectable style={styles.demoInlineValue}>{DEMO_EMAIL}</Text> / contraseña{" "}
        <Text selectable style={styles.demoInlineValue}>{DEMO_PASSWORD}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 20, paddingTop: 70, paddingBottom: 32 },
  formSection: { width: "100%", alignItems: "center" },
  logo: { fontSize: 18, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonDisabled: { backgroundColor: "#99cfff" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  forgot: { marginTop: 15, fontSize: 12, color: "#555" },
  error: { color: "red", marginBottom: 10 },
  demoHint: { width: "100%", textAlign: "center", fontSize: 12, color: "#94a3b8", lineHeight: 18 },
  demoInlineValue: { color: "#64748b", fontWeight: "700" },
});

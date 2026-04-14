import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmacionScreen() {
  const { message, success, points, course } = useLocalSearchParams();
  const router = useRouter();

  const isSuccess = success === "true";

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {isSuccess ? (
          <>
            <MaterialIcons name="check-circle" size={80} color="#10B981" />
            <Text style={styles.title}>¡Asistencia Confirmada!</Text>
            <Text style={styles.course}>{course}</Text>
            {points && <Text style={styles.points}>+{points} puntos ganados</Text>}
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity onPress={() => router.replace("/perfil")} style={styles.button}>
              <Text style={styles.buttonText}>Ir a Perfil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <MaterialIcons name="error" size={80} color="#EF4444" />
            <Text style={styles.title}>Error</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity onPress={() => router.replace("/scanQR")} style={[styles.button, styles.buttonError]}>
              <Text style={styles.buttonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: "100%",
    maxWidth: 350,
  },
  title: { fontSize: 22, fontWeight: "700", marginTop: 12, color: "#1E293B" },
  course: { fontSize: 18, marginTop: 6, color: "#2563EB" },
  points: { fontSize: 16, color: "#10B981", marginTop: 6 },
  message: { fontSize: 14, color: "#475569", marginTop: 10, textAlign: "center" },
  button: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonError: { backgroundColor: "#EF4444" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
